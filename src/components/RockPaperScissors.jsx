import { useEffect, useRef, useState } from 'react'
import { site, gameConfig, rpsHands } from '../data.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'

const STORE_KEY = 'weezie_rps_v3'
const MOVES = ['rock', 'paper', 'scissors']
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' }
const LOSES_TO = { rock: 'paper', paper: 'scissors', scissors: 'rock' }
const COUNT_WORDS = ['ROCK', 'PAPER', 'SCISSORS', 'SHOOT!']

// Computer's move, weighted so a best-of-3 game lands near a 30% player win-rate.
function pickComputer(player) {
  const { computerLoses, computerWins, tie } = gameConfig.weights
  const total = computerLoses + computerWins + tie
  let r = Math.random() * total
  if (r < computerLoses) return BEATS[player]
  r -= computerLoses
  if (r < computerWins) return LOSES_TO[player]
  return player
}
function resolve(p, c) {
  if (p === c) return 'tie'
  return BEATS[p] === c ? 'win' : 'lose'
}
function makeCode() {
  const s = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `WEEZIE${gameConfig.discountPct}-${s}`
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* private mode */ }
  return { gamesPlayed: 0, hasWon: false, code: '' }
}
function saveState(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)) } catch { /* ignore */ }
}

// A round hand shown inside a soft circular well. Computer's hand is mirrored.
// While `shuffling`, the image just swaps rapidly (no entrance animation).
function Hand({ move, mirror, shuffling }) {
  return (
    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-paper neu-inset sm:h-36 sm:w-36">
      <img
        src={rpsHands[move]}
        alt={move}
        className={`h-[78%] w-[78%] object-contain ${shuffling ? '' : 'throw-in'}`}
        style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}
      />
    </div>
  )
}

export default function RockPaperScissors() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [saved, setSaved] = useState(loadState)
  const remaining = gameConfig.maxGames - saved.gamesPlayed

  const [phase, setPhase] = useState(saved.hasWon ? 'won' : remaining <= 0 ? 'gameover' : 'intro')
  const [playerScore, setPlayerScore] = useState(0)
  const [cpuScore, setCpuScore] = useState(0)
  const [history, setHistory] = useState([])
  const [last, setLast] = useState(null)
  const [countWord, setCountWord] = useState('')
  const [outcome, setOutcome] = useState(null)
  const [shuffleIdx, setShuffleIdx] = useState(0)
  const timers = useRef([])

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => clearTimers, [])

  // Shuffle the 3 hands in the arena until the player picks.
  useEffect(() => {
    if (phase !== 'countdown' && phase !== 'pick') return
    const id = setInterval(() => setShuffleIdx((i) => (i + 1) % MOVES.length), reduceMotion ? 380 : 110)
    return () => clearInterval(id)
  }, [phase, reduceMotion])

  function persist(next) { setSaved(next); saveState(next) }

  function beginThrow() {
    clearTimers()
    setLast(null)
    setOutcome(null)
    setPhase('countdown')
    const step = reduceMotion ? 300 : 560
    COUNT_WORDS.forEach((w, i) => {
      timers.current.push(setTimeout(() => setCountWord(w), i * step))
    })
    timers.current.push(setTimeout(() => setPhase('pick'), COUNT_WORDS.length * step))
  }

  function startGame() {
    setPlayerScore(0)
    setCpuScore(0)
    setHistory([])
    beginThrow()
  }

  // The computer commits the instant you click, and both hands reveal together — fair.
  function play(move) {
    if (phase !== 'pick') return
    const cpu = pickComputer(move)
    const r = resolve(move, cpu)
    const nextP = playerScore + (r === 'win' ? 1 : 0)
    const nextC = cpuScore + (r === 'lose' ? 1 : 0)
    setLast({ p: move, c: cpu, r })
    setHistory((h) => [...h, { p: move, c: cpu, r }])
    setPlayerScore(nextP)
    setCpuScore(nextC)
    // once the discount is already won, further games are just for fun
    const won = nextP >= gameConfig.winsPerGame
    const lost = nextC >= gameConfig.winsPerGame
    setOutcome(won ? (saved.hasWon ? 'funWon' : 'gameWon') : lost ? (saved.hasWon ? 'funLost' : 'gameLost') : 'continue')
    setPhase('reveal')
  }

  function claimWin() {
    const code = makeCode()
    persist({ gamesPlayed: saved.gamesPlayed + 1, hasWon: true, code })
    // hand the code to the contact form so it's attached before sending
    window.dispatchEvent(new CustomEvent('weezie:code', { detail: code }))
    setPhase('won')
  }
  function afterLoss() {
    const played = saved.gamesPlayed + 1
    persist({ ...saved, gamesPlayed: played })
    setPhase(played >= gameConfig.maxGames ? 'gameover' : 'lostGame')
  }

  const gamesLeft = gameConfig.maxGames - saved.gamesPlayed
  const inArena = phase === 'countdown' || phase === 'pick' || phase === 'reveal'

  return (
    <section id="play" className="relative overflow-hidden bg-paper px-6 py-24 md:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-ink">// optional · just for fun</p>
        <h2 className="reveal display mt-4 text-5xl text-ink md:text-7xl">
          FEELING <span className="text-gradient">LUCKY?</span>
        </h2>
        <p className="reveal mx-auto mt-5 max-w-xl text-lg font-medium leading-relaxed text-ink-soft">
          Beat me at rock&nbsp;·&nbsp;paper&nbsp;·&nbsp;scissors and unlock{' '}
          <strong className="text-ink">{gameConfig.discountPct}% off</strong> your first project.
          Best of 3 — you get {gameConfig.maxGames} tries.
        </p>

        <div className="reveal relative mx-auto mt-12 max-w-2xl rounded-[32px] bg-paper p-6 neu md:p-10">
          {/* ---------- INTRO ---------- */}
          {phase === 'intro' && (
            <div>
              <div className="flex items-center justify-center gap-4">
                {MOVES.map((m) => (
                  <div key={m} className="flex h-20 w-20 items-center justify-center rounded-full bg-paper neu-inset">
                    <img src={rpsHands[m]} alt={m} className="h-[74%] w-[74%] object-contain" />
                  </div>
                ))}
              </div>
              <p className="mt-6 text-base font-medium text-ink-soft">
                Hit start, I&rsquo;ll count us in — <strong className="text-ink">Rock, Paper, Scissors, Shoot!</strong> — then pick your throw.
              </p>
              <button
                type="button"
                onClick={startGame}
                className="btn-gradient mt-7 rounded-full px-10 py-4 text-sm font-bold uppercase tracking-[0.1em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
              >
                Start — {gamesLeft} {gamesLeft === 1 ? 'try' : 'tries'} left
              </button>
              <div className="mt-4">
                <a href="#work" className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 hover:text-ink">
                  Maybe later — see the work ↓
                </a>
              </div>
            </div>
          )}

          {/* ---------- ARENA (countdown / pick / reveal) ---------- */}
          {inArena && (
            <div>
              {/* scoreboard */}
              <div className="flex items-center justify-center gap-5 text-ink">
                <span className="text-sm font-bold uppercase tracking-[0.1em]">You</span>
                <span className="display text-3xl">{playerScore}</span>
                <span className="text-ink-soft">–</span>
                <span className="display text-3xl">{cpuScore}</span>
                <span className="text-sm font-bold uppercase tracking-[0.1em]">Me</span>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
                {saved.hasWon
                  ? 'Best of 3 · Just for fun — no extra discount'
                  : `Best of 3 · Game ${saved.gamesPlayed + 1} of ${gameConfig.maxGames}`}
              </p>

              {/* hands */}
              <div className="mt-7 flex items-center justify-center gap-4 sm:gap-10" aria-live="polite">
                <div className="text-center">
                  <Hand move={last ? last.p : MOVES[shuffleIdx]} shuffling={!last} />
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">You</p>
                </div>

                <div className="flex min-w-[84px] flex-col items-center justify-center">
                  {phase === 'reveal' ? (
                    <span className="display text-xl text-ink">
                      {last?.r === 'win' ? 'YOU WIN' : last?.r === 'lose' ? 'I WIN' : 'TIE'}
                    </span>
                  ) : (
                    <span key={countWord} className="count-pop display text-2xl text-ink sm:text-3xl">{countWord}</span>
                  )}
                </div>

                <div className="text-center">
                  <Hand move={last ? last.c : MOVES[(shuffleIdx + 1) % MOVES.length]} mirror shuffling={!last} />
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">Me</p>
                </div>
              </div>

              {/* result line */}
              {phase === 'reveal' && (
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.08em] text-ink">
                  {last.r === 'win' ? 'You take that throw!' : last.r === 'lose' ? 'I take that one.' : "Dead heat — throw again."}
                </p>
              )}
              {phase === 'pick' && (
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-ink">Pick your throw now!</p>
              )}
              {phase === 'countdown' && (
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink-soft">Get ready…</p>
              )}

              {/* choices */}
              {phase !== 'reveal' && (
                <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-5">
                  {MOVES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => play(m)}
                      disabled={phase !== 'pick'}
                      aria-label={`Throw ${m}`}
                      className="neu-hover flex flex-col items-center gap-2 rounded-3xl bg-paper py-4 disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper neu-inset">
                        <img src={rpsHands[m]} alt="" aria-hidden="true" className="h-[72%] w-[72%] object-contain" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">{m}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* reveal actions */}
              {phase === 'reveal' && (
                <div className="mt-7">
                  {outcome === 'continue' && (
                    <button type="button" onClick={beginThrow} className="btn-gradient rounded-full px-9 py-4 text-sm font-bold uppercase tracking-[0.1em]">
                      Throw Again
                    </button>
                  )}
                  {outcome === 'gameWon' && (
                    <button type="button" onClick={claimWin} className="btn-gradient rounded-full px-9 py-4 text-sm font-bold uppercase tracking-[0.1em]">
                      Claim Your Reward
                    </button>
                  )}
                  {outcome === 'gameLost' && (
                    <button type="button" onClick={afterLoss} className="rounded-full bg-paper px-9 py-4 text-sm font-bold uppercase tracking-[0.1em] text-ink neu-hover">
                      Continue
                    </button>
                  )}
                  {(outcome === 'funWon' || outcome === 'funLost') && (
                    <div className="flex flex-col items-center gap-3">
                      {outcome === 'funWon' && (
                        <p className="text-sm font-bold uppercase tracking-[0.1em] text-blue">You got me! (discount already claimed)</p>
                      )}
                      <button type="button" onClick={startGame} className="btn-gradient rounded-full px-9 py-4 text-sm font-bold uppercase tracking-[0.1em]">
                        Play Again
                      </button>
                      <button type="button" onClick={() => setPhase('won')} className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 hover:text-ink">
                        Back to my code
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ---------- LOST A GAME ---------- */}
          {phase === 'lostGame' && (
            <div>
              <h3 className="display text-3xl text-ink">So close!</h3>
              <p className="mt-3 text-base font-medium text-ink-soft">
                I edged that one. You&rsquo;ve got <strong className="text-ink">{gamesLeft} {gamesLeft === 1 ? 'try' : 'tries'}</strong> left.
              </p>
              <button type="button" onClick={startGame} className="btn-gradient mt-6 rounded-full px-9 py-4 text-sm font-bold uppercase tracking-[0.1em]">
                Play Again
              </button>
            </div>
          )}

          {/* ---------- WON ---------- */}
          {phase === 'won' && (
            <div aria-live="polite">
              <img src="/party.png" alt="" aria-hidden="true" className="throw-in mx-auto h-24 w-auto md:h-28" />
              <h3 className="display mt-4 text-4xl text-ink">YOU <span className="text-gradient">WON!</span></h3>
              <p className="mt-3 text-base font-medium text-ink-soft">
                Here&rsquo;s <strong className="text-ink">{gameConfig.discountPct}% off</strong> your first project. Use this code when you reach out:
              </p>
              <div className="mx-auto mt-5 inline-flex items-center rounded-full bg-paper px-7 py-3 neu-inset">
                <span className="display text-2xl tracking-normal text-ink">{saved.code}</span>
              </div>
              <div className="mt-7 flex flex-col items-center gap-3">
                <a
                  href="#contact"
                  className="btn-gradient rounded-full px-9 py-4 text-sm font-bold uppercase tracking-[0.1em]"
                >
                  Claim it — send a message
                </a>
                <button
                  type="button"
                  onClick={startGame}
                  className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 hover:text-ink"
                >
                  Play again — just for fun
                </button>
              </div>
            </div>
          )}

          {/* ---------- GAME OVER ---------- */}
          {phase === 'gameover' && (
            <div>
              <div className="text-6xl" aria-hidden="true">🤝</div>
              <h3 className="display mt-4 text-3xl text-ink">Good games!</h3>
              <p className="mt-3 text-base font-medium text-ink-soft">
                Luck wasn&rsquo;t on your side this time — but let&rsquo;s still build something great together.
              </p>
              <a href="#contact" className="btn-gradient mt-6 inline-block rounded-full px-9 py-4 text-sm font-bold uppercase tracking-[0.1em]">
                Get In Touch
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
