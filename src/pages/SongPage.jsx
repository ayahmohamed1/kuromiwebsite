import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import styles from './SongPage.module.css'

export default function SongPage({ back, content }) {
  const s = content.song
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!s.audioSrc) return
    const audio = new Audio(s.audioSrc)
    audioRef.current = audio
    audio.volume = 0.6

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    })

    audio.play().then(() => setPlaying(true)).catch(() => {})

    return () => { 
      audio.pause()
      audio.src = '' 
    }
  }, [s.audioSrc])

  const togglePlay = () => {
    if (playing) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  const handleSeek = (e) => {
    if (!audioRef.current?.duration) return
    const newTime = (e.target.value / 100) * audioRef.current.duration
    audioRef.current.currentTime = newTime
    setProgress(e.target.value)
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.dashedTop} />

        <div className={styles.content}>
          <p className={styles.remindsText} dir="auto">{s.remindsText}</p>

          <div className={styles.mainContent}>
            {/* Hello Kitty with headphones sticker */}
            <motion.div
              className={styles.kittyMusicContainer}
              animate={playing ? { 
                y: [0, -6, 0],
                rotate: [-2, 2, -2]
              } : { y: 0, rotate: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img 
                src="/images/kuromi-music.png" 
                alt="Kuromi listening to music" 
                className={styles.kittyMusicImg}
              />
              {playing && (
                <div className={styles.musicNotesWrap}>
                  <motion.span 
                    className={styles.note}
                    animate={{ y: [-5, -25], opacity: [0, 1, 0], x: [-5, 8] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                  >
                    ♪
                  </motion.span>
                  <motion.span 
                    className={styles.note}
                    animate={{ y: [-5, -30], opacity: [0, 1, 0], x: [5, -10] }}
                    transition={{ duration: 1.8, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
                  >
                    ♫
                  </motion.span>
                  <motion.span 
                    className={styles.note}
                    animate={{ y: [-5, -28], opacity: [0, 1, 0], x: [-2, 12] }}
                    transition={{ duration: 1.6, delay: 0.9, repeat: Infinity, ease: 'easeOut' }}
                  >
                    ♡
                  </motion.span>
                </div>
              )}
            </motion.div>

            {/* Music Player Bar */}
            <div className={styles.playerContainer}>
              <div className={styles.playerBar}>
                <button className={styles.playBtn} onClick={togglePlay} title={playing ? 'Pause' : 'Play'}>
                  {playing ? '⏸' : '▶'}
                </button>

                <div className={styles.metadata}>
                  <div className={styles.songTitle} dir="auto">{s.songTitle}</div>
                  <div className={styles.artist} dir="auto">{s.artist}</div>
                </div>

                <input 
                  type="range" min="0" max="100" value={progress} onChange={handleSeek}
                  className={styles.seekbar}
                />
              </div>
            </div>
          </div>

          <p className={styles.highlight} dir="auto">{s.highlight}</p>
        </div>

        <div className={styles.dashedBottom} />

        <motion.div
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className={styles.title} dir="auto">{s.title}</h2>
          <button className="btn-return" onClick={back}>{s.returnButton}</button>
        </motion.div>
      </div>
    </div>
  )
}