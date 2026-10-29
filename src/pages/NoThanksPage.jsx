import { motion } from 'framer-motion'
import styles from './NoThanksPage.module.css'

export default function NoThanksPage({ back, content }) {
  const n = content.noThanks
  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 130, damping: 14 }}
      >
        <motion.div
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className={styles.kittyWrapper}
        >
          <img 
            src="/images/kuromi-crying.png" 
            alt="Kuromi crying" 
            className={styles.kittyImg}
          />
        </motion.div>

        <motion.p
          className={styles.message}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {n.message}
        </motion.p>

        <motion.button
          className="btn-return"
          onClick={back}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {n.tryAgainButton}
        </motion.button>
      </motion.div>
    </div>
  )
}
