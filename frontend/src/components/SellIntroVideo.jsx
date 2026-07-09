import { useState, useEffect, useRef } from 'react'

const SCENES = [
  {
    emoji: '📸',
    title: 'Snap great photos',
    text: 'Take clear, bright pictures of your item from a few angles.',
    narration: 'Step one. Take clear, bright photos of your item from a few angles. Good photos sell up to three times faster.',
    bg: 'from-orange-500 to-amber-600',
  },
  {
    emoji: '💰',
    title: 'Set your price',
    text: 'Check what similar items sell for, then pick a fair price.',
    narration: 'Step two. Set your price. Check what similar items are selling for on Merkato, and price yours fairly.',
    bg: 'from-amber-500 to-orange-600',
  },
  {
    emoji: '💬',
    title: 'Chat with buyers',
    text: 'Interested buyers will message you — quick replies close deals.',
    narration: 'Step three. Buyers will message you with questions and offers. Quick, friendly replies close deals.',
    bg: 'from-orange-600 to-red-500',
  },
  {
    emoji: '🤝',
    title: 'Meet up or ship',
    text: 'Meet locally in a safe public place, or ship it. Get paid!',
    narration: 'Step four. Meet the buyer in a safe public place, or ship the item. Get paid, and you are done. Happy selling on Merkato!',
    bg: 'from-emerald-500 to-teal-600',
  },
]

const SCENE_SECONDS = 7

export default function SellIntroVideo() {
  const [scene, setScene] = useState(-1) // -1 = not started
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef(null)

  function speak(text) {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.95
    window.speechSynthesis.speak(u)
  }

  function start() {
    setScene(0)
    setPlaying(true)
  }

  function stop() {
    setPlaying(false)
    window.speechSynthesis.cancel()
    clearTimeout(timerRef.current)
  }

  // Advance scenes while playing
  useEffect(() => {
    if (!playing || scene < 0) return
    speak(SCENES[scene].narration)
    timerRef.current = setTimeout(() => {
      if (scene < SCENES.length - 1) {
        setScene(scene + 1)
      } else {
        setPlaying(false)
      }
    }, SCENE_SECONDS * 1000)
    return () => clearTimeout(timerRef.current)
  }, [scene, playing])

  // Cleanup if the modal unmounts mid-play
  useEffect(() => () => {
    window.speechSynthesis.cancel()
    clearTimeout(timerRef.current)
  }, [])

  // ----- Not started yet: poster with play button -----
  if (scene === -1) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 flex flex-col items-center justify-center text-white">
        <button
          onClick={start}
          className="h-16 w-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center text-3xl transition hover:scale-110"
        >
          ▶
        </button>
        <p className="mt-4 font-semibold">How selling works</p>
        <p className="text-xs text-white/70">30 seconds · with sound 🔊</p>
      </div>
    )
  }

  const current = SCENES[scene]

  return (
    <div className={`w-full h-full bg-gradient-to-br ${current.bg} flex flex-col text-white relative overflow-hidden`}>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
        {SCENES.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            <div
              className={`h-full bg-white transition-all ${
                i < scene ? 'w-full' : i === scene && playing ? 'w-full duration-[7000ms] ease-linear' : 'w-0'
              }`}
              style={i === scene && playing ? { transitionDuration: `${SCENE_SECONDS}s` } : {}}
            />
          </div>
        ))}
      </div>

      {/* Scene content */}
      <div key={scene} className="flex-1 flex flex-col items-center justify-center text-center px-8 animate-[fadeIn_0.6s_ease]">
        <div className="text-6xl mb-4 animate-bounce">{current.emoji}</div>
        <h3 className="text-xl font-bold mb-2">
          {scene + 1}. {current.title}
        </h3>
        <p className="text-sm text-white/85 max-w-xs">{current.text}</p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        {playing ? (
          <button onClick={stop} className="text-xs bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-full">
            ⏸ Pause
          </button>
        ) : (
          <button onClick={() => setPlaying(true)} className="text-xs bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-full">
            ▶ Resume
          </button>
        )}
        <button onClick={() => { stop(); setScene(-1) }} className="text-xs bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-full">
          ↺ Replay
        </button>
      </div>

    </div>
  )
}