Add-Type -AssemblyName System.Drawing

$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class WhiteBgRemover {
    public static void Process(string inputPath, string outputPath, bool removeSignature) {
        using (Bitmap src = new Bitmap(inputPath)) {
            int w = src.Width;
            int h = src.Height;

            Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(bmp)) {
                g.DrawImage(src, 0, 0, w, h);
            }

            BitmapData bmpData = bmp.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            int stride = bmpData.Stride;
            byte[] bytes = new byte[stride * h];
            Marshal.Copy(bmpData.Scan0, bytes, 0, bytes.Length);

            // If removeSignature, clear signature area in bottom right
            if (removeSignature) {
                for (int y = (int)(h * 0.85); y < h; y++) {
                    for (int x = (int)(w * 0.72); x < w; x++) {
                        int idx = y * stride + x * 4;
                        bytes[idx] = 255;
                        bytes[idx + 1] = 255;
                        bytes[idx + 2] = 255;
                    }
                }
            }

            Func<int, int, bool> isWhiteBg = (x, y) => {
                int idx = y * stride + x * 4;
                int b = bytes[idx];
                int g = bytes[idx + 1];
                int r = bytes[idx + 2];
                if (r >= 238 && g >= 238 && b >= 238) {
                    if (Math.Abs(r - g) < 15 && Math.Abs(r - b) < 15 && Math.Abs(g - b) < 15) {
                        return true;
                    }
                }
                return false;
            };

            bool[,] isBg = new bool[w, h];
            bool[,] visited = new bool[w, h];
            Queue<Point> queue = new Queue<Point>();

            for (int x = 0; x < w; x++) {
                if (isWhiteBg(x, 0)) queue.Enqueue(new Point(x, 0));
                if (isWhiteBg(x, h - 1)) queue.Enqueue(new Point(x, h - 1));
            }
            for (int y = 0; y < h; y++) {
                if (isWhiteBg(0, y)) queue.Enqueue(new Point(0, y));
                if (isWhiteBg(w - 1, y)) queue.Enqueue(new Point(w - 1, y));
            }

            while (queue.Count > 0) {
                Point p = queue.Dequeue();
                int x = p.X;
                int y = p.Y;
                if (x < 0 || x >= w || y < 0 || y >= h) continue;
                if (visited[x, y]) continue;
                visited[x, y] = true;

                if (isWhiteBg(x, y)) {
                    isBg[x, y] = true;
                    queue.Enqueue(new Point(x + 1, y));
                    queue.Enqueue(new Point(x - 1, y));
                    queue.Enqueue(new Point(x, y + 1));
                    queue.Enqueue(new Point(x, y - 1));
                }
            }

            // Anti-aliasing / defringing near background
            for (int y = 0; y < h; y++) {
                for (int x = 0; x < w; x++) {
                    int idx = y * stride + x * 4;
                    if (isBg[x, y]) {
                        bytes[idx + 3] = 0; // Transparent
                    } else {
                        bool nearBg = false;
                        for (int dy = -1; dy <= 1; dy++) {
                            for (int dx = -1; dx <= 1; dx++) {
                                int nx = x + dx, ny = y + dy;
                                if (nx >= 0 && nx < w && ny >= 0 && ny < h && isBg[nx, ny]) {
                                    nearBg = true;
                                    break;
                                }
                            }
                            if (nearBg) break;
                        }

                        if (nearBg) {
                            int b = bytes[idx];
                            int g = bytes[idx + 1];
                            int r = bytes[idx + 2];
                            int brightness = (r + g + b) / 3;
                            if (brightness > 200) {
                                double alphaFactor = Math.Max(0.0, Math.Min(1.0, (255.0 - brightness) / 55.0));
                                bytes[idx + 3] = (byte)(alphaFactor * 255);
                            }
                        }
                    }
                }
            }

            Marshal.Copy(bytes, 0, bmpData.Scan0, bytes.Length);
            bmp.UnlockBits(bmpData);

            // Auto crop tight bounding box
            int minX = w, maxX = 0, minY = h, maxY = 0;
            BitmapData checkData = bmp.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            byte[] checkBytes = new byte[stride * h];
            Marshal.Copy(checkData.Scan0, checkBytes, 0, checkBytes.Length);
            bmp.UnlockBits(checkData);

            for (int y = 0; y < h; y++) {
                for (int x = 0; x < w; x++) {
                    int alpha = checkBytes[y * stride + x * 4 + 3];
                    if (alpha > 15) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            if (minX <= maxX && minY <= maxY) {
                int pad = 12;
                minX = Math.Max(0, minX - pad);
                minY = Math.Max(0, minY - pad);
                maxX = Math.Min(w - 1, maxX + pad);
                maxY = Math.Min(h - 1, maxY + pad);

                int finalW = maxX - minX + 1;
                int finalH = maxY - minY + 1;

                using (Bitmap finalBmp = new Bitmap(finalW, finalH, PixelFormat.Format32bppArgb)) {
                    using (Graphics gFinal = Graphics.FromImage(finalBmp)) {
                        gFinal.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                        gFinal.DrawImage(bmp, new Rectangle(0, 0, finalW, finalH), new Rectangle(minX, minY, finalW, finalH), GraphicsUnit.Pixel);
                    }
                    finalBmp.Save(outputPath, ImageFormat.Png);
                }
            } else {
                bmp.Save(outputPath, ImageFormat.Png);
            }

            bmp.Dispose();
        }
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies "System.Drawing.dll"

$uploadsDir = "C:\Users\AYAH ELMAGHRABY\.gemini\antigravity\brain\e9dce0d8-06dc-4ac9-98df-e8ddf0a31046\.user_uploaded"
$destDir = "A:\projects\c126\public\images"

Write-Output "Processing 1. Kuromi Shy / Smiling (media_...e13d0264.jpg)..."
[WhiteBgRemover]::Process("$uploadsDir\media_1793293350600_e13d0264.jpg", "$destDir\kuromi-shy.png", $false)
Copy-Item "$destDir\kuromi-shy.png" "$destDir\kuromi-music.png" -Force

Write-Output "Processing 2. Kuromi Winking / Greeting (media_...18824589.jpg)..."
[WhiteBgRemover]::Process("$uploadsDir\media_1793293350600_18824589.jpg", "$destDir\kuromi-welcome.png", $false)
Copy-Item "$destDir\kuromi-welcome.png" "$destDir\kuromi-wink.png" -Force

Write-Output "Processing 3. Kuromi With Hearts (media_...387c8ef1.jpg)..."
[WhiteBgRemover]::Process("$uploadsDir\media_1793293350600_387c8ef1.jpg", "$destDir\kuromi-memories.png", $true)
Copy-Item "$destDir\kuromi-memories.png" "$destDir\kuromi-camera.png" -Force

Write-Output "Processing 4. Kuromi With Flowers (media_...3770a59c.jpg)..."
[WhiteBgRemover]::Process("$uploadsDir\media_1793293350641_3770a59c.jpg", "$destDir\kuromi-flowers.png", $true)

Write-Output "Processing 5. Kuromi Blowing Heart Kiss (media_...6df885a1.jpg)..."
[WhiteBgRemover]::Process("$uploadsDir\media_1793293350646_6df885a1.jpg", "$destDir\kuromi-heart.png", $false)
Copy-Item "$destDir\kuromi-heart.png" "$destDir\kuromi-letter.png" -Force
Copy-Item "$destDir\kuromi-heart.png" "$destDir\kuromi-cake.png" -Force

Write-Output "All 5 stickers processed and saved as transparent PNG!"

