import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

export default function Home() {
  const [answer, setAnswer] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [hearts, setHearts] = useState([]);
  const [showLetter, setShowLetter] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(0);
  const [animateTitle, setAnimateTitle] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const audioRef = useRef(null);
  // Gallery states
  const [showGallery, setShowGallery] = useState(false);
  const [galleryType, setGalleryType] = useState(null); // 'special' or 'beautiful'
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const backgroundGradients = [
    'linear-gradient(135deg, #ffeff2 0%, #ffd6e0 100%)',
    'linear-gradient(135deg, #ffe8f7 0%, #ffc8ee 100%)',
    'linear-gradient(135deg, #fff0e8 0%, #ffd8c8 100%)',
    'linear-gradient(135deg, #e8f0ff 0%, #c8d8ff 100%)',
    'linear-gradient(135deg, #f8e8ff 0%, #e8c8ff 100%)'
  ];

  // Add photo arrays
  const specialMomentPhotos = [
    "/special/1.jpg",
    "/special/2.jpg",
    "/special/3.jpg",
    "/special/4.jpg",
  ];
  
  const beautifulMemoryPhotos = [
    "/beautiful/5.jpg",
    "/beautiful/6.jpg",
    "/beautiful/7.jpg", 
    "/beautiful/8.jpg",
  ];

  useEffect(() => {
    // Set window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Create floating hearts
    const newHearts = [];
    for (let i = 0; i < 25; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 30,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 20,
        emoji: chooseRandomEmoji()
      });
    }
    setHearts(newHearts);

    // Set background interval
    const bgInterval = setInterval(() => {
      setCurrentBackground(prev => (prev + 1) % backgroundGradients.length);
    }, 8000);

    // Event listener for window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set page as loaded after a slight delay
    setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(bgInterval);
    };
  }, []);

  function chooseRandomEmoji() {
    const emojis = ['❤', '💕', '💖', '💗', '💓', '💘', '💝', '💞', '💟', '🌸', '🌹', '🌺', '🌷'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  const handleYes = () => {
    setAnswer('yes');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 7000);
  };

  const handleNo = () => {
    setAnswer('no');
  };

  const toggleLetter = () => {
    setShowLetter(!showLetter);
  };

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
        setShowMusicPrompt(false);
      }).catch(e => {
        console.log("Play failed:", e);
        setIsMusicPlaying(false);
      });
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play().catch(e => {
          console.log("Audio play failed:", e);
        });
        setIsMusicPlaying(true);
      }
    }
  };

  // Make sure music plays when user interacts with the page
  const ensureMusicPlays = () => {
    if (audioRef.current && !isMusicPlaying && !showMusicPrompt) {
      audioRef.current.play().catch(e => console.log("Play failed:", e));
      setIsMusicPlaying(true);
    }
  };

  // Gallery functions
  const openGallery = (type) => {
    setGalleryType(type);
    setCurrentPhotoIndex(0);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    const photos = galleryType === 'special' ? specialMomentPhotos : beautifulMemoryPhotos;
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    const photos = galleryType === 'special' ? specialMomentPhotos : beautifulMemoryPhotos;
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Auto-play music when Yes is clicked or any button is clicked if it failed before
  useEffect(() => {
    if (answer === 'yes' && audioRef.current && !isMusicPlaying) {
      audioRef.current.play().catch(e => console.log("Auto-play failed:", e));
      setIsMusicPlaying(true);
    }
  }, [answer]);

  return (
    <div 
      className="container"
      style={{ 
        background: backgroundGradients[currentBackground],
        transition: "background 3s ease" 
      }}
    >
      <Head>
        <title>I Miss You Akanshaaaa</title>
        <meta name="description" content="A special message for my Akansha" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&family=Quicksand:wght@400;700&family=Satisfy&display=swap" rel="stylesheet" />
        <style>{`
          /* Add styles for photo gallery */
          .gallery-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .gallery-content {
            position: relative;
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            background-color: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .gallery-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #FF6B8A;
            z-index: 2;
          }
          
          .gallery-title {
            margin-top: 10px;
            margin-bottom: 20px;
            color: #FF6B8A;
            text-align: center;
            font-family: 'Dancing Script', cursive;
            font-size: 28px;
          }
          
          .gallery-image-container {
            position: relative;
            width: 100%;
            height: 60vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }
          
          .gallery-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .gallery-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.8);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: #FF6B8A;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          }
          
          .gallery-nav.prev {
            left: 10px;
          }
          
          .gallery-nav.next {
            right: 10px;
          }
          
          .gallery-dots {
            display: flex;
            justify-content: center;
            margin-top: 15px;
          }
          
          .gallery-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #ddd;
            margin: 0 5px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          
          .gallery-dot.active {
            background-color: #FF6B8A;
          }
          
          .memory-photo {
            cursor: pointer;
          }

          /* Music prompt styles */
          .music-prompt-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.85);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(8px);
          }
          
          .music-prompt-container {
            background: rgba(255, 255, 255, 0.9);
            padding: 30px;
            border-radius: 20px;
            max-width: 90%;
            width: 400px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }
          
          .music-prompt-title {
            font-family: 'Dancing Script', cursive;
            font-size: 28px;
            color: #FF6B8A;
            margin-bottom: 15px;
          }
          
          .music-prompt-message {
            font-family: 'Quicksand', sans-serif;
            margin-bottom: 25px;
            line-height: 1.5;
            color: #333;
          }
          
          .music-prompt-button {
            background: linear-gradient(135deg, #FF6B8A, #FF4778);
            border: none;
            color: white;
            padding: 12px 30px;
            border-radius: 30px;
            font-family: 'Quicksand', sans-serif;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 5px 15px rgba(255, 107, 138, 0.4);
          }
          
          .music-prompt-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(255, 107, 138, 0.6);
          }
          
          .music-prompt-button:active {
            transform: translateY(0);
            box-shadow: 0 4px 10px rgba(255, 107, 138, 0.4);
          }
          
          .music-prompt-icon {
            font-size: 40px;
            margin-bottom: 15px;
            color: #FF6B8A;
          }

          /* Content fade-in effect */
          .main-content {
            opacity: 0;
            transition: opacity 1.5s ease;
          }
          
          .main-content.loaded {
            opacity: 1;
          }
        `}</style>
      </Head>

      {/* Hidden audio element for our song */}
      <audio 
        ref={audioRef}
        src="/our-song.mp3" 
        loop
        preload="auto"
      />

      {/* Music permission prompt */}
      <AnimatePresence>
        {showMusicPrompt && (
          <motion.div 
            className="music-prompt-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="music-prompt-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="music-prompt-icon">🎵</div>
              <h2 className="music-prompt-title">Enable Music</h2>
              <p className="music-prompt-message">
                Love, Please enable music for better experience ;)
              </p>
              <motion.button 
                className="music-prompt-button"
                onClick={startMusic}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Yes, Play Music! ❤️
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content with conditional class for fade-in effect */}
      <div className={`main-content ${pageLoaded ? 'loaded' : ''}`}>
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={true}
            numberOfPieces={300}
            gravity={0.05}
            colors={['#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493', '#DB7093', '#FFD700', '#FFA500']}
            confettiSource={{
              x: windowSize.width / 2,
              y: windowSize.height / 3,
              w: 0,
              h: 0
            }}
          />
        )}

        {/* Ensure music plays on any user interaction with the page */}
        <div 
          className="interaction-layer" 
          onClick={ensureMusicPlays}
          onTouchStart={ensureMusicPlays}
        >
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              className="floating-heart"
              initial={{ x: `${heart.x}vw`, y: `${heart.y}vh`, opacity: 0.7 }}
              animate={{
                y: [`${heart.y}vh`, `${heart.y - 20}vh`, `${heart.y}vh`],
                x: [`${heart.x}vw`, `${heart.x + 5}vw`, `${heart.x}vw`],
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: heart.duration,
                delay: heart.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ 
                fontSize: `${heart.size}px`,
                color: `rgba(255, ${100 + Math.floor(Math.random() * 100)}, ${150 + Math.floor(Math.random() * 100)}, 0.8)`,
                filter: "drop-shadow(0 0 5px rgba(255,255,255,0.7))"
              }}
            >
              {heart.emoji}
            </motion.div>
          ))}
        </div>

        <main className="main" onClick={ensureMusicPlays}>
          <motion.div 
            className="card"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", delay: 0.3 }}
          >
            <motion.div 
              className="title-container"
              animate={{ 
                y: animateTitle ? [0, -10, 0] : 0
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              onHoverStart={() => setAnimateTitle(false)}
              onHoverEnd={() => setAnimateTitle(true)}
            >
              <motion.h1 
                className="title"
                animate={{ 
                  scale: [1, 1.05, 1],
                  color: ['#FF6B8A', '#FF8E9E', '#FF6B8A', '#FF4778', '#FF6B8A']
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity
                }}
              >
                I'm Missing You So Much Akanshaaaa!
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="subtitle"
              >
                My Sweet Baby Girl ✨
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="image-container"
              whileHover={{ 
                scale: 1.05,
                rotate: [0, 2, -2, 0],
                transition: { duration: 0.5 }
              }}
            >
              <svg className="love-image" viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF4778" />
                    <stop offset="50%" stopColor="#FF6B8A" />
                    <stop offset="100%" stopColor="#FF8E9E" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feFlood floodColor="#FF6B8A" floodOpacity="0.7" result="color"/>
                    <feComposite in="color" in2="blur" operator="in" result="shadow"/>
                    <feComposite in="SourceGraphic" in2="shadow" operator="over"/>
                  </filter>
                </defs>
                <path d="M100,30 C60,10 0,30 0,90 C0,150 100,170 100,170 C100,170 200,150 200,90 C200,30 140,10 100,30 Z" fill="url(#heartGradient)" filter="url(#glow)">
                  <animate attributeName="d" dur="2s" repeatCount="indefinite" 
                    values="M100,30 C60,10 0,30 0,90 C0,150 100,170 100,170 C100,170 200,150 200,90 C200,30 140,10 100,30 Z;
                           M100,35 C65,15 5,35 5,95 C5,155 100,165 100,165 C100,165 195,155 195,95 C195,35 135,15 100,35 Z;
                           M100,30 C60,10 0,30 0,90 C0,150 100,170 100,170 C100,170 200,150 200,90 C200,30 140,10 100,30 Z" />
                </path>
                <text x="100" y="105" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="16" fontWeight="bold">My baby girl !!!</text>
                <text x="100" y="125" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="12">Forever Yours</text>
              </svg>

              <motion.div
                className="photo-frames"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                <motion.div 
                  className="photo-frame left"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  
                </motion.div>
                <motion.div 
                  className="photo-frame right"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.button
              className="love-letter-button"
              onClick={toggleLetter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showLetter ? "Hide My Love Letter 💌" : "Click To Read My Love Letter 💌"}
            </motion.button>

            <AnimatePresence>
              {showLetter && (
                <motion.div
                  className="love-letter"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p>My dearest Mine Forever,</p>
                  <p>Every moment without you feels like an eternity. I miss your beautiful smile, your voice, your touch, and everything about you. When we're apart, I find myself counting down the days until I can see you again.</p>
                  <p>From knowing you from class 10 to now this endless end game loop...I wanna be stuck with you forever</p>
                  <p>No matter how many times we fight, argue, or hate each other... we will always find a way to love and support each other</p>
                  <p>You are my sunshine, my heartbeat, my favorite thought throughout the day. No distance can dim the love I feel for you.</p>
                  <p>Waiting eagerly to hold you in my arms again...</p>
                  <p>Yours forever and always,</p>
                  <p>❤️</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.p 
              className="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Do you miss me too, Love?
            </motion.p>
            
            <div className="button-container">
              <motion.button 
                className="button yes-button"
                onClick={handleYes}
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: "0 0 20px rgba(255, 107, 138, 0.6)" 
                }}
                whileTap={{ scale: 0.95 }}
              >
                Yes, I do! ❤️
              </motion.button>
              
              <motion.button 
                className="button no-button"
                onClick={handleNo}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.95 }}
              >
                No 😔
              </motion.button>
            </div>
            
            <AnimatePresence>
              {answer === 'yes' && (
                <motion.div 
                  className="response"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="yes-response">Yay! I knew it! ❤️</h2>
                  <p className="message">Every moment apart only makes our love grow stronger! Thank you for keeping me in your heart.</p>
                  <div className="photos-container">
                    <motion.div 
                      className="memory-photo"
                      whileHover={{ scale: 1.05, rotate: -5 }}
                      onClick={() => openGallery('special')}
                    >
                      🏞️
                      <span>Our Special Moments</span>
                    </motion.div>
                    <motion.div 
                      className="memory-photo"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      onClick={() => openGallery('beautiful')}
                    >
                      🏖️
                      <span>Beautiful Memories</span>
                    </motion.div>
                  </div>
                  <motion.div 
                    className="heart-burst"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  >
                    ❤️💕💖
                  </motion.div>
                  <motion.p
                    className="countdown"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Can't wait to see you again! ✨
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {answer === 'no' && (
                <motion.div 
                  className="response no-response-container"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="no-response">Please say yes! 🥺</h2>
                  <p className="message">I know deep down you miss me too... just a little bit? My heart is aching to hear you say it!</p>
                  <motion.div 
                    className="cute-puppy"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  >
                    <span className="puppy-emoji">🐶</span> 
                    <span className="puppy-text">Woof ! Woof ! Even me, your future pet misses him!</span>
                  </motion.div>
                  <div className="sad-photos">
                    <motion.div 
                      className="sad-photo"
                      animate={{
                        rotate: [-3, 3, -3],
                        transition: { 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }
                      }}
                    >
                      😢
                    </motion.div>
                  </div>
                  <motion.button 
                    className="button reconsider-button"
                    onClick={handleYes}
                    whileHover={{ 
                      scale: 1.1, 
                      boxShadow: "0 0 20px rgba(255, 107, 138, 0.6)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Ok fine, I miss you too! ❤️
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div
              className="music-control"
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleMusic();
              }}
            >
              {isMusicPlaying ? '🔊 Pause Music' : '🔈 Music Paused'}
            </motion.div>
          </motion.div>
        </main>
        
        <footer className="footer">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            Made with ❤️ just for you by Your Forever !!
          </motion.div>
        </footer>
      </div>

      {/* Photo Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div 
            className="gallery-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGallery}
          >
            <motion.div 
              className="gallery-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="gallery-close"
                onClick={closeGallery}
              >
                ✖️
              </button>
              
              <h3 className="gallery-title">
                {galleryType === 'special' ? 'Our Special Moments' : 'Beautiful Memories'}
              </h3>
              
              <div className="gallery-image-container">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhotoIndex}
                    className="gallery-image"
                    src={galleryType === 'special' 
                      ? specialMomentPhotos[currentPhotoIndex] 
                      : beautifulMemoryPhotos[currentPhotoIndex]}
                    alt={galleryType === 'special' 
                      ? `Special moment ${currentPhotoIndex + 1}` 
                      : `Beautiful memory ${currentPhotoIndex + 1}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                
                <button 
                  className="gallery-nav prev"
                  onClick={prevPhoto}
                >
                  ◀
                </button>
                
                <button 
                  className="gallery-nav next"
                  onClick={nextPhoto}
                >
                  ▶
                </button>
              </div>
              
              <div className="gallery-dots">
                {(galleryType === 'special' ? specialMomentPhotos : beautifulMemoryPhotos).map((_, index) => (
                  <motion.div
                    key={index}
                    className={`gallery-dot ${index === currentPhotoIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPhotoIndex(index);
                    }}
                    whileHover={{ scale: 1.3 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}