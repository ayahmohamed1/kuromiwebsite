import { motion } from 'framer-motion'
import styles from './MenuPage.module.css'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}
const itemV = {
  hidden:  { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1,   y: 0, transition: { type: 'spring', stiffness: 160, damping: 16 } }
}

export default function MenuPage({ go, back, content }) {
  const m = content.menu

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>{m.title}</h1>
          <p className={styles.subtitle}>{m.subtitle}</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {m.items.map(item => (
            <motion.button
              key={item.id}
              className={styles.gridItem}
              variants={itemV}
              whileHover={{ scale: 1.05, translateY: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => go(item.id)}
            >
              <div className={styles.gridIcon}>
                {item.sticker ? (
                  <img src={item.sticker} alt={item.label} className={styles.menuSticker} />
                ) : (
                  <span>{item.icon}</span>
                )}
              </div>
              <span className={styles.gridLabel}>{item.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button className="btn-return" onClick={back}>RETURN</button>
        </motion.div>
      </div>
    </div>
  )
}
