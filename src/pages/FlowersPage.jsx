import { motion } from 'framer-motion'
import styles from './FlowersPage.module.css'

export default function FlowersPage({ back, content }) {
  const f = content.flowers
  const leftPoems  = f.poems.slice(0, 4)
  const rightPoems = f.poems.slice(4, 8)

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.dashedTop} />

        <div className={styles.layout}>
          {/* Left poems */}
          <div className={styles.poemCol}>
            {leftPoems.map((p, i) => (
              <motion.div
                key={i}
                className={styles.poemBox}
                dir="auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
              >
                {p}
              </motion.div>
            ))}
          </div>

          {/* Center Hello Kitty with flowers */}
          <motion.div
            className={styles.flowerCenter}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 }}
          >
            <motion.div
              className={styles.flowerEmoji}
              animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img 
                src="/images/kuromi-flowers.png" 
                alt="Kuromi flowers" 
                className={styles.kittyFlowerImg} 
              />
            </motion.div>
            <div className={styles.flowerName} dir="auto">{f.flowerName}</div>
            <div className={styles.flowerSub} dir="auto">{f.flowerSubtitle}</div>
          </motion.div>

          {/* Right poems */}
          <div className={styles.poemCol}>
            {rightPoems.map((p, i) => (
              <motion.div
                key={i}
                className={styles.poemBox}
                dir="auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
              >
                {p}
              </motion.div>
            ))}
          </div>
        </div>

        <div className={styles.dashedBottom} />

        <motion.div
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className={styles.title} dir="auto">{f.title}</h2>
          <button className="btn-return" onClick={back}>{f.returnButton}</button>
        </motion.div>
      </div>
    </div>
  )
}