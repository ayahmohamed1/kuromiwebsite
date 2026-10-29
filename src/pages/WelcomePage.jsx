import { motion } from 'framer-motion'
import styles from './WelcomePage.module.css'

export default function WelcomePage({ go, content, name }) {
  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.contentBox}
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {/* Winking Kuromi Sticker on Welcome Card */}
        <motion.div 
          className={styles.kittyStickerWrap}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img 
            src="/images/kuromi-welcome.png" 
            alt="Kuromi welcome" 
            className={styles.welcomeKittySticker} 
          />
        </motion.div>
        
        {/* Hello greeting */}
        <div className={styles.textGroup}>
          <h1 className={styles.helloText}>{content.welcome.greeting}</h1>
          <h1 className={styles.loveText}>{name}!</h1>
        </div>
        
        <p className={styles.question}>{content.welcome.question || 'do you want to see your gift?'}</p>
        
        <div className={styles.buttons}>
          <button onClick={() => go('menu')} className="btn-return">
            {content.welcome.yesButton}
          </button>
          <button onClick={() => go('noThanks')} className="btn-return">
            {content.welcome.noButton}
          </button>
        </div>
      </motion.div>
    </div>
  )
}