// Hand-drawn doodle marks recreated from the Weezie brand art
// (crown, eye, star, X, dots, rings, arc, robot faces, squiggle, "B").
const RED = '#DE3B2C'
const BLUE = '#2f6bff'
const GREEN = '#6DA23A'
const INK = '#17150F'
const EYE = '#F5EFDD'

const S = { className: 'h-full w-full', viewBox: '0 0 40 40', xmlns: 'http://www.w3.org/2000/svg' }

const DOODLES = {
  crown: () => (
    <svg {...S}>
      <path d="M7 27 L10 12 L15 22 L20 9 L25 22 L30 12 L33 27" fill="none" stroke={RED} strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M8 31 H32" stroke={RED} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  ),
  eye: () => (
    <svg {...S}>
      <path d="M5 20 Q20 9 35 20 Q20 31 5 20 Z" fill="none" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="4.4" fill={INK} />
      <path d="M20 5 v3.5 M11 8 l1.6 2.8 M29 8 l-1.6 2.8" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  star: () => (
    <svg {...S}>
      <g stroke={GREEN} strokeWidth="3" strokeLinecap="round">
        <line x1="20" y1="6" x2="20" y2="34" />
        <line x1="8" y1="13" x2="32" y2="27" />
        <line x1="32" y1="13" x2="8" y2="27" />
      </g>
    </svg>
  ),
  x: () => (
    <svg {...S}>
      <g stroke={INK} strokeWidth="3.4" strokeLinecap="round">
        <line x1="11" y1="11" x2="29" y2="29" />
        <line x1="29" y1="11" x2="11" y2="29" />
      </g>
    </svg>
  ),
  dots: () => (
    <svg {...S}>
      <g fill={INK}>
        <circle cx="20" cy="10" r="2.6" />
        <circle cx="20" cy="20" r="2.6" />
        <circle cx="20" cy="30" r="2.6" />
      </g>
    </svg>
  ),
  ring: () => (
    <svg {...S}><circle cx="20" cy="20" r="12" fill="none" stroke={BLUE} strokeWidth="3.4" /></svg>
  ),
  ringRed: () => (
    <svg {...S}><circle cx="20" cy="20" r="11.5" fill="none" stroke={RED} strokeWidth="4.6" /></svg>
  ),
  arc: () => (
    <svg {...S}><path d="M8 14 Q20 35 32 14" fill="none" stroke={GREEN} strokeWidth="3.6" strokeLinecap="round" /></svg>
  ),
  faceBlue: () => (
    <svg {...S}>
      <rect x="7" y="7" width="26" height="26" rx="7" fill={BLUE} />
      <rect x="14.5" y="15" width="3" height="8" rx="1.5" fill={EYE} />
      <rect x="22.5" y="15" width="3" height="8" rx="1.5" fill={EYE} />
    </svg>
  ),
  faceGreen: () => (
    <svg {...S}>
      <rect x="7" y="7" width="26" height="26" rx="7" fill={GREEN} />
      <rect x="14.5" y="15" width="3" height="8" rx="1.5" fill={EYE} />
      <rect x="22.5" y="15" width="3" height="8" rx="1.5" fill={EYE} />
    </svg>
  ),
  faceRed: () => (
    <svg {...S}>
      <rect x="7" y="7" width="26" height="26" rx="7" fill={RED} />
      <rect x="14.5" y="15" width="3" height="8" rx="1.5" fill={EYE} />
      <rect x="22.5" y="15" width="3" height="8" rx="1.5" fill={EYE} />
    </svg>
  ),
  wave: () => (
    <svg {...S}><path d="M5 22 q3.75 -8 7.5 0 t7.5 0 t7.5 0 t7.5 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" /></svg>
  ),
  bee: () => (
    <svg {...S}>
      <path d="M14 7 Q31 9 22 20 Q32 22 22 33 Q17 34 14 33" fill="none" stroke={BLUE} strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="14" y1="7" x2="14" y2="33" stroke={BLUE} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  ),
}

export const DOODLE_NAMES = Object.keys(DOODLES)

export function Doodle({ name, className = '', style }) {
  const render = DOODLES[name]
  if (!render) return null
  return (
    <span className={className} style={style} aria-hidden="true">
      {render()}
    </span>
  )
}

// Preset scatters for section backgrounds (positions in %, size in px)
const PRESETS = {
  a: [
    { name: 'x', top: '12%', left: '6%', size: 26, rot: 8 },
    { name: 'star', top: '68%', left: '4%', size: 30, rot: 0 },
    { name: 'ring', top: '22%', right: '7%', size: 30, rot: 0 },
    { name: 'dots', top: '78%', right: '10%', size: 22, rot: 12 },
    { name: 'wave', top: '46%', left: '2%', size: 34, rot: 0 },
    { name: 'faceBlue', top: '84%', left: '46%', size: 26, rot: -6 },
  ],
  b: [
    { name: 'crown', top: '10%', right: '6%', size: 34, rot: -6 },
    { name: 'ringRed', top: '72%', left: '5%', size: 26, rot: 0 },
    { name: 'x', top: '40%', right: '4%', size: 24, rot: 0 },
    { name: 'arc', top: '16%', left: '8%', size: 30, rot: 0 },
    { name: 'faceGreen', top: '80%', right: '8%', size: 26, rot: 8 },
    { name: 'dots', top: '30%', left: '3%', size: 20, rot: 0 },
  ],
  c: [
    { name: 'eye', top: '14%', left: '5%', size: 30, rot: 0 },
    { name: 'bee', top: '70%', right: '6%', size: 30, rot: 0 },
    { name: 'star', top: '30%', right: '5%', size: 26, rot: 0 },
    { name: 'x', top: '82%', left: '8%', size: 24, rot: 10 },
    { name: 'wave', top: '52%', right: '3%', size: 32, rot: 0 },
    { name: 'ring', top: '86%', left: '44%', size: 22, rot: 0 },
  ],
}

// How much bigger the background "murals" are than the base doodle marks.
const MURAL_SCALE = 5

// Decorative doodle layer — big mural-scale marks that sit behind a section's content.
export function DoodleScatter({ variant = 'a', className = '' }) {
  const items = PRESETS[variant] || PRESETS.a
  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            top: it.top,
            left: it.left,
            right: it.right,
            width: it.size * MURAL_SCALE,
            height: it.size * MURAL_SCALE,
            transform: `rotate(${it.rot || 0}deg)`,
            opacity: 0.3,
          }}
        >
          {DOODLES[it.name]()}
        </span>
      ))}
    </div>
  )
}
