// ★ EDIT THIS FILE ONLY ★

const content = {
  // --- Background music ---
  // Put your .mp3 file in public/music/ and set the filename here
  // Set to null to hide the music button
  music: '/music/music.mp3',

  // --- Secret Date / Password Protection ---
  password: {
    code: '2510',
    title: 'enter a secret date',
    subtitle: 'a date only we know ♡',
    buttonText: 'UNLOCK ♡',
    errorMessages: [
      'no babee!',
      'no try 2510',
    ],
    sticker: '/images/kuromi-crying.png',
  },

  welcome: {
    greeting: 'hello ',
    name: 'my love',
    question: 'would you like to open your gift?',
    yesButton: 'YES PLEASE',
    noButton: 'NO THANKS',
  },

  noThanks: {
    message: "i promise you'll like it",
    tryAgainButton: 'TRY AGAIN',
  },

  menu: {
    title: 'pick a gift',
    subtitle: 'choose one to open ↓',
    items: [
      { id: 'memories', icon: '📸', sticker: '/images/kuromi-memories.png', label: 'Captured\nMemories' },
      { id: 'flowers', icon: '🌷', sticker: '/images/kuromi-flowers.png', label: 'Virtual\nFlowers' },
      { id: 'song', icon: '🎵', sticker: '/images/kuromi-music.png', label: 'our\nsong' },
      { id: 'letter', icon: '💌', sticker: '/images/kuromi-heart.png', label: 'Love\nLetter' },
    ],
  },

  memories: {
    title: 'our memories',
    returnButton: 'RETURN',
    images: [
      { src: '/images/memory1.jpg', label: '❤️', tag: 'my fav' },
      { src: '/images/memory2.jpg', label: '❤️', tag: 'cute' },
      { src: '/images/memory3.jpg', label: '❤️', tag: 'forever' },
      { src: '/images/memory4.jpg', label: '❤️', tag: 'love' },
      { src: '/images/memory5.jpg', label: '❤️', tag: 'always' },
    ],
  },



  flowers: {
    title: 'for you',
    returnButton: 'RETURN',
    flowerName: 'TULIP',
    flowerSubtitle: 'just like you — rare & beautiful',
    poems: [
      `"حبـيبتي لـيلاي
جـميلةٌ مِثـل اللـيل 
بـهيـةٌ مِـثل القمر 🌙.`,
      `"أحـب كُـل مـا بـكِ
سـعة تـفهمك، جمـيل احتـوائك و كثـافة حُبك"`,

      `"كُـلما أمطـرت 
شـعرت بـرغبة عـارمة فـي أن أكـون مـعكِ، كـم يُـشبهك الـمطر حنـون وغـزير ❄️"`,
      `"I had never met a soul who could speak my language until there was you, you are fluent in me"`,
      `"Darling don't be afraid 
I have loved you for a thousand year 
I'll love you far a thousand more"`,
      `"My eyes on your eyes
Like Peter Pan up in the sky
My best friend's house tonight"`,
      `"Every moment with you, is a precious treasure"`,
      `"I will spend my whole life trying to give you the love, you should have always received"`,
    ],
  },

  song: {
    title: 'our song',
    returnButton: 'RETURN',
    // Put your .mp3 in public/music/ and update this path:
    audioSrc: '/music/music.mp3',
    remindsText: 'this song always makes me think of you',
    songTitle: 'our song',
    artist: 'for you 🎵',
    highlight: 'every lyric feels like us 💕',
  },

  letter: {
    title: 'a letter',
    returnButton: 'RETURN',
    message: `11:11
It's your birthday bb💘
Finally, this day has come my love, I think this year is different from the others one of our dreams has come true، finally seeing you in front of me, I still can't believe it, It feels like a miracle, I've seen the person who has supported me so much throughout my life, Every moment I spent with you is incredibly precious to me, just as you are baby, We've been through so much together, I can't believe these years have truly passed, There is much sadness in our lives, but my happiest moments are when I am with you، Thank you for supportting me always, wish you a beautiful day like you

your dear; 
Mero`,
    signoff: 'I love you always,',
    signature: 'Your love ♡',
  },


}

export default content
