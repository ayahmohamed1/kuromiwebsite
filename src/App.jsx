import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import content from './content.js'
import MusicToggle from './components/MusicToggle.jsx'
import WelcomePage  from './pages/WelcomePage.jsx'
import NoThanksPage from './pages/NoThanksPage.jsx'
import MenuPage     from './pages/MenuPage.jsx'
import MemoriesPage from './pages/MemoriesPage.jsx'
import FlowersPage  from './pages/FlowersPage.jsx'
import SongPage     from './pages/SongPage.jsx'
import LetterPage   from './pages/LetterPage.jsx'
import PasswordPage from './pages/PasswordPage.jsx'

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.35 },
}

// Read ?name= from URL, fallback to content.js
const params = new URLSearchParams(window.location.search)
const recipientName = params.get('name') || content.welcome.name

export default function App() {
  const [page, setPage] = useState('password')

  const go   = (p) => setPage(p)
  const back = () => setPage('menu')

  return (
    <>
      <MusicToggle src={content.music} />

      <AnimatePresence mode="wait">
        <motion.div key={page} {...fade}>

          {page === 'password' && (
            <PasswordPage
              onSuccess={() => go('welcome')}
              content={content}
            />
          )}

          {page === 'welcome' && (
            <WelcomePage
              go={go}
              content={content}
              name={recipientName}
            />
          )}

          {page === 'noThanks' && (
            <NoThanksPage
              back={() => go('welcome')}
              content={content}
            />
          )}

          {page === 'menu' && (
            <MenuPage
              go={go}
              back={() => go('welcome')}
              content={content}
            />
          )}

          {page === 'memories' && (
            <MemoriesPage back={back} content={content} />
          )}

          {page === 'flowers' && (
            <FlowersPage back={back} content={content} />
          )}

          {page === 'song' && (
            <SongPage back={back} content={content} />
          )}

          {page === 'letter' && (
            <LetterPage back={back} content={content} />
          )}

        </motion.div>
      </AnimatePresence>
    </>
    
  )
}
