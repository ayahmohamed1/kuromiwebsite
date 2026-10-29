Add-Type -AssemblyName System.Drawing

$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class StickerCutter {
    public static void Cutout(
        string inputPath, 
        string outputPath, 
        int cropX, int cropY, int cropW, int cropH,
        int minGinghamG,
        int minGinghamDiff,
        bool addWhiteBorder,
        int borderWidth
    ) {
        using (Bitmap src = new Bitmap(inputPath)) {
            // Clamp crop rect to src boundaries
            if (cropX < 0) { cropW += cropX; cropX = 0; }
            if (cropY < 0) { cropH += cropY; cropY = 0; }
            if (cropX + cropW > src.Width) cropW = src.Width - cropX;
            if (cropY + cropH > src.Height) cropH = src.Height - cropY;

            using (Bitmap cropped = new Bitmap(cropW, cropH, PixelFormat.Format32bppArgb)) {
                using (Graphics g = Graphics.FromImage(cropped)) {
                    g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                    g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                    g.DrawImage(src, new Rectangle(0, 0, cropW, cropH), new Rectangle(cropX, cropY, cropW, cropH), GraphicsUnit.Pixel);
                }

                int w = cropped.Width;
                int h = cropped.Height;
                BitmapData bmpData = cropped.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                int stride = bmpData.Stride;
                byte[] bytes = new byte[stride * h];
                Marshal.Copy(bmpData.Scan0, bytes, 0, bytes.Length);

                bool[,] isBg = new bool[w, h];
                bool[,] visited = new bool[w, h];
                Queue<Point> queue = new Queue<Point>();

                Func<int, int, bool> isGingham = (x, y) => {
                    int idx = y * stride + x * 4;
                    int b = bytes[idx];
                    int g = bytes[idx + 1];
                    int r = bytes[idx + 2];

                    // Check if pixel belongs to pink gingham pattern
                    // R is brightest, B is second brightest, G is lowest
                    // Typical gingham: R: 238-255, G: 200-245, B: 220-252
                    if (r >= 225 && g >= minGinghamG && b >= 205) {
                        int rg = r - g;
                        int bg = b - g;
                        // Pink tint check
                        if (rg >= minGinghamDiff && (rg <= 55) && bg >= -5) {
                            return true;
                        }
                    }
                    return false;
                };

                // Seed queue from all borders
                for (int x = 0; x < w; x++) {
                    if (isGingham(x, 0)) queue.Enqueue(new Point(x, 0));
                    if (isGingham(x, h - 1)) queue.Enqueue(new Point(x, h - 1));
                }
                for (int y = 0; y < h; y++) {
                    if (isGingham(0, y)) queue.Enqueue(new Point(0, y));
                    if (isGingham(w - 1, y)) queue.Enqueue(new Point(w - 1, y));
                }

                // BFS flood fill
                while (queue.Count > 0) {
                    Point p = queue.Dequeue();
                    int x = p.X;
                    int y = p.Y;
                    if (x < 0 || x >= w || y < 0 || y >= h) continue;
                    if (visited[x, y]) continue;
                    visited[x, y] = true;

                    if (isGingham(x, y)) {
                        isBg[x, y] = true;
                        queue.Enqueue(new Point(x + 1, y));
                        queue.Enqueue(new Point(x - 1, y));
                        queue.Enqueue(new Point(x, y + 1));
                        queue.Enqueue(new Point(x, y - 1));
                    }
                }

                // Make background transparent, and soften anti-aliased edge
                for (int y = 0; y < h; y++) {
                    for (int x = 0; x < w; x++) {
                        int idx = y * stride + x * 4;
                        if (isBg[x, y]) {
                            bytes[idx + 3] = 0; // Transparent
                        } else {
                            // Check neighbor for anti-aliasing / defringing
                            int b = bytes[idx];
                            int g = bytes[idx + 1];
                            int r = bytes[idx + 2];
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
                                // If near background and looks like a blend of gingham
                                if (r > 200 && g > 165 && (r - g) >= 5) {
                                    // Soften edge
                                    double factor = Math.Max(0.0, Math.Min(1.0, (255.0 - r) / 60.0));
                                    bytes[idx + 3] = (byte)(factor * 255);
                                }
                            }
                        }
                    }
                }

                Marshal.Copy(bytes, 0, bmpData.Scan0, bytes.Length);
                cropped.UnlockBits(bmpData);

                // Find tight bounding box of visible pixels
                int minX = w, maxX = 0, minY = h, maxY = 0;
                BitmapData checkData = cropped.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
                byte[] checkBytes = new byte[stride * h];
                Marshal.Copy(checkData.Scan0, checkBytes, 0, checkBytes.Length);
                cropped.UnlockBits(checkData);

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
                    // Add small padding
                    int pad = 4;
                    minX = Math.Max(0, minX - pad);
                    minY = Math.Max(0, minY - pad);
                    maxX = Math.Min(w - 1, maxX + pad);
                    maxY = Math.Min(h - 1, maxY + pad);

                    int finalW = maxX - minX + 1;
                    int finalH = maxY - minY + 1;

                    using (Bitmap finalBmp = new Bitmap(finalW, finalH, PixelFormat.Format32bppArgb)) {
                        using (Graphics gFinal = Graphics.FromImage(finalBmp)) {
                            gFinal.DrawImage(cropped, new Rectangle(0, 0, finalW, finalH), new Rectangle(minX, minY, finalW, finalH), GraphicsUnit.Pixel);
                        }
                        finalBmp.Save(outputPath, ImageFormat.Png);
                    }
                } else {
                    cropped.Save(outputPath, ImageFormat.Png);
                }
            }
        }
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies "System.Drawing.dll"

$src = "C:\Users\AYAH ELMAGHRABY\.gemini\antigravity\brain\e9dce0d8-06dc-4ac9-98df-e8ddf0a31046\.user_uploaded\media_1793292208420_cf67f65c.jpg"
$destDir = "A:\projects\c126\public\images"

Write-Output "Processing Kuromi Shy (Bottom-Left)..."
[StickerCutter]::Cutout($src, "$destDir\kuromi-shy.png", 30, 705, 175, 205, 185, 4, $false, 0)

Write-Output "Processing Kuromi Pouting / Crying (Bottom-Center)..."
[StickerCutter]::Cutout($src, "$destDir\kuromi-crying.png", 210, 705, 175, 205, 185, 4, $false, 0)
Copy-Item "$destDir\kuromi-crying.png" "$destDir\kuromi-pouting.png" -Force

Write-Output "Processing Kuromi Heart (Bottom-Right)..."
[StickerCutter]::Cutout($src, "$destDir\kuromi-heart.png", 375, 705, 185, 205, 185, 4, $false, 0)

Write-Output "Processing Kuromi Lace Heart (Center)..."
[StickerCutter]::Cutout($src, "$destDir\kuromi-lace-heart.png", 70, 245, 435, 470, 185, 4, $false, 0)
Copy-Item "$destDir\kuromi-lace-heart.png" "$destDir\kuromi-flowers.png" -Force

Write-Output "Processing Kuromi Books & Potion..."
[StickerCutter]::Cutout($src, "$destDir\kuromi-books.png", 25, 510, 195, 215, 185, 4, $false, 0)
Copy-Item "$destDir\kuromi-books.png" "$destDir\kuromi-camera.png" -Force

Write-Output "Processing Kuromi Pillow..."
[StickerCutter]::Cutout($src, "$destDir\kuromi-pillow.png", 412, 575, 150, 150, 185, 4, $false, 0)

Write-Output "Processing Kuromi Ribbon Bow (Top)..."
[StickerCutter]::Cutout($src, "$destDir\kuromi-bow.png", 55, 35, 465, 175, 185, 4, $false, 0)

# Music sticker: Bottom-left Kuromi or with cute accents
Copy-Item "$destDir\kuromi-shy.png" "$destDir\kuromi-music.png" -Force

# Cake / Letter sticker: Kuromi holding heart
Copy-Item "$destDir\kuromi-heart.png" "$destDir\kuromi-cake.png" -Force

Write-Output "All stickers created successfully!"
