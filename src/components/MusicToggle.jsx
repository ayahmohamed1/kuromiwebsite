import { useEffect, useRef, useState } from 'react'

export default function MusicToggle({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!src) return
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.45
    audioRef.current = audio

    audio.addEventListener('canplaythrough', () => setReady(true))
    audio.load()

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [src])

  if (!src) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <button
      onClick={toggle}
      title={playing ? 'Pause music' : 'Play music'}
      style={{
        position: 'fixed',
        bottom: '1.2rem',
        right: '1.2rem',
        zIndex: 9999,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '2px solid var(--red)',
        background: '#ffffff',
        color: 'var(--red)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        boxShadow: '0 3px 12px rgba(255,77,121,0.22)',
        transition: 'all 0.25s ease',
        opacity: ready ? 1 : 0.5,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--red)'
        e.currentTarget.style.color = '#ffffff'
        e.currentTarget.style.transform = 'scale(1.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#ffffff'
        e.currentTarget.style.color = 'var(--red)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {playing ? '⏸' : '♪'}
    </button>
  )
}
