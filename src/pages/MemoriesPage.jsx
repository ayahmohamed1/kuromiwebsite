import { motion } from 'framer-motion'
import { useState } from 'react'
import styles from './MemoriesPage.module.css'

const TILTS = [-4, 3, -2.5, 4, -3, 2]

export default function MemoriesPage({ back, content }) {
  const m = content.memories
  const [broken, setBroken] = useState({})

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* dashed border line top */}
        <div className={styles.dashedTop} />

        {/* Hello Kitty with camera sticker */}
        <motion.div 
          className={styles.kittyCameraWrapper}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img 
            src="/images/kuromi-memories.png" 
            alt="Kuromi memories" 
            className={styles.kittyCameraImg}
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.div
          className={styles.strip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {m.images.map((img, i) => (
            <motion.div
              key={i}
              className={styles.polaroid}
              style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` }}
              initial={{ opacity: 0, y: 30, rotate: TILTS[i % TILTS.length] }}
              animate={{ opacity: 1, y: 0,  rotate: TILTS[i % TILTS.length] }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 120, damping: 14 }}
              whileHover={{ rotate: 0, scale: 1.06, zIndex: 10 }}
            >
              {img.tag && <span className={styles.tag}>{img.tag}</span>}
              {broken[i] ? (
                <div className={styles.placeholder}>
                  <img src="/images/kuromi-memories.png" alt="memories" className={styles.placeholderImg} />
                </div>
              ) : (
                <img
                  src={img.src}
                  alt={img.label}
                  className={styles.photo}
                  onError={() => setBroken(b => ({ ...b, [i]: true }))}
                  loading="lazy"
                />
              )}
              <p className={styles.caption}>{img.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.dashedBottom} />

        <motion.div
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className={styles.title}>{m.title}</h2>
          <button className="btn-return" onClick={back}>{m.returnButton}</button>
        </motion.div>
      </div>
    </div>
  )
}
