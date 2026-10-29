import { motion } from 'framer-motion'
import styles from './LetterPage.module.css'

export default function LetterPage({ back, content }) {
  const l = content.letter
  const lines = l.message.split('\n')

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.dashedTop} />

        {/* Hello Kitty with birthday cake sticker at top of letter */}
        <motion.div 
          className={styles.kittyCakeWrapper}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img 
            src="/images/kuromi-heart.png" 
            alt="Kuromi with heart" 
            className={styles.kittyCakeImg}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.div
          className={styles.letter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {lines.map((line, i) =>
            line.trim() === '' ? (
              <div key={i} className={styles.spacer} />
            ) : (
              <motion.p
                key={i}
                className={styles.line}
                dir="auto"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.03 }}
              >
                {line}
              </motion.p>
            )
          )}

          <motion.div
            className={styles.signoff}
            dir="auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p>{l.signoff}</p>
            <p className={styles.signature}>{l.signature}</p>
          </motion.div>
        </motion.div>

        <div className={styles.dashedBottom} />

        <motion.div
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className={styles.title} dir="auto">{l.title}</h2>
          <button className="btn-return" onClick={back}>{l.returnButton}</button>
        </motion.div>
      </div>
    </div>
  )
}