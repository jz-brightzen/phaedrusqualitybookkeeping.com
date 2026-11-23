// The covers of "Building a [Quality Space]: Stories from The Leucadia Club".
//
// The first book's cover (night sky, a tree arching over, thin bracketed title, ∞) blended with
// the club's cartoon style (round-headed friends, flat shapes). Each cover is one picture drawn
// in code: 1200 × 1800, written as a JPG. See README.md for how to run it.
//
// Where to change things:
//   the words            Title() and Quote() below
//   the fonts            ZEN (caps) and MONT (the bracketed words)
//   the colours          AFTERGLOW and LAGOON (one "Look" per cover)
//   what is in the scene Scene(): the palm, the friends, and "extras" (torches, or the lounge:
//                        hut, string lights, tiki, torch). Each piece is its own small function.
//   which covers are made, and their file names: main() at the bottom
//
// Usage: tsx covers.tsx <out dir>     (render.sh does this with the fonts set up)
import path from "node:path";
import type React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";

const W = 1200;
const H = 1800;
const CAPS = "Avenir Next Condensed, Avenir Next, Helvetica Neue, Arial Narrow, sans-serif";
const THIN = "Avenir Next, Helvetica Neue, Helvetica, sans-serif";
// The quirky caps from the first book's cover ("ZEN AND THE ART OF").
const ZEN = "Zenzero Grotesk Sans, Avenir Next Condensed, sans-serif";
// The thin font of "[nothing]" on the first cover.
const MONT = "Montserrat, Montserrat Thin, Avenir Next, sans-serif";

// A small repeatable random, so the stars land in the same place every time.
function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function Stars({ seed, count, maxY, color = "#fff" }: { seed: number; count: number; maxY: number; color?: string }) {
  const r = rand(seed);
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = r() * W;
        const y = r() * maxY;
        const size = 1 + r() * 2.6;
        const o = (0.35 + r() * 0.65) * (1 - (y / maxY) * 0.6);
        return <circle key={i} cx={x} cy={y} r={size} fill={color} opacity={o} />;
      })}
    </g>
  );
}

type Tone = { ink: string; skin: string; outline: number };

// One member sitting on the sand, seen from behind, watching the water. (x, y) is
// where they sit; about 150 tall at size 1.
function Sitter({
  x,
  y,
  size = 1,
  hair,
  shirt,
  shorts,
  tone,
  arm = "rest",
  long = false,
}: {
  x: number;
  y: number;
  size?: number;
  hair: string;
  shirt: string;
  shorts: string;
  tone: Tone;
  arm?: "rest" | "up" | "around";
  long?: boolean;
}) {
  const st = { stroke: tone.ink, strokeWidth: tone.outline, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <ellipse cx={0} cy={6} rx={62} ry={12} fill={tone.ink} opacity={0.22} />
      <path d="M-40 -6 Q-44 -34 0 -34 Q44 -34 40 -6 Q0 8 -40 -6 Z" fill={shorts} {...st} />
      <rect x={-32} y={-104} width={64} height={86} rx={24} fill={shirt} {...st} />
      <path d="M-30 -84 Q-52 -50 -50 -10" fill="none" {...st} strokeWidth={tone.outline + 3} />
      <circle cx={-50} cy={-8} r={8} fill={tone.skin} {...st} strokeWidth={tone.outline - 1} />
      {arm === "rest" && (
        <>
          <path d="M30 -84 Q52 -50 50 -10" fill="none" {...st} strokeWidth={tone.outline + 3} />
          <circle cx={50} cy={-8} r={8} fill={tone.skin} {...st} strokeWidth={tone.outline - 1} />
        </>
      )}
      {arm === "up" && (
        <>
          <path d="M30 -86 Q58 -120 62 -160" fill="none" {...st} strokeWidth={tone.outline + 3} />
          <circle cx={62} cy={-163} r={8} fill={tone.skin} {...st} strokeWidth={tone.outline - 1} />
        </>
      )}
      {arm === "around" && <path d="M30 -86 Q70 -96 96 -78" fill="none" {...st} strokeWidth={tone.outline + 3} />}
      <circle cx={0} cy={-132} r={30} fill={tone.skin} {...st} />
      {long ? (
        <path d="M-31 -134 Q-34 -168 0 -166 Q34 -168 31 -134 L33 -92 Q16 -100 0 -96 Q-16 -100 -33 -92 Z" fill={hair} {...st} />
      ) : (
        <path d="M-31 -130 Q-36 -168 -6 -165 Q4 -174 18 -164 Q36 -160 31 -130 Q20 -116 0 -118 Q-20 -116 -31 -130 Z" fill={hair} {...st} />
      )}
    </g>
  );
}

// A surfboard stood up in the sand.
function PlantedBoard({ x, y, h = 250, lean = 6, color, stripe, tone }: { x: number; y: number; h?: number; lean?: number; color: string; stripe: string; tone: Tone }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean})`}>
      <path d={`M0 0 Q-34 ${-h * 0.45} 0 ${-h} Q34 ${-h * 0.45} 0 0 Z`} fill={color} stroke={tone.ink} strokeWidth={tone.outline} strokeLinejoin="round" />
      <path d={`M0 -10 V${-h + 22}`} stroke={stripe} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
}

// A palm that arches over the scene, the way the tree does on the first book.
// (x, y) is the foot of the trunk; `dir` 1 leans right, -1 leans left.
function ArchPalm({ x, y, dir = 1, k = 1, trunk, frond, edge }: { x: number; y: number; dir?: 1 | -1; k?: number; trunk: string; frond: string; edge?: string }) {
  const fronds = [
    "M0 0 Q150 -150 330 -60",
    "M0 0 Q180 -60 320 80",
    "M0 0 Q90 30 190 200",
    "M0 0 Q40 -190 190 -250",
    "M0 0 Q-90 -210 -250 -210",
    "M0 0 Q-170 -110 -330 -10",
    "M0 0 Q-150 -10 -250 150",
    "M0 0 Q-40 60 -90 220",
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * k} ${k})`}>
      <path d="M0 0 C40 -330 150 -640 380 -860" fill="none" stroke={edge ?? trunk} strokeWidth={edge ? 70 : 0} strokeLinecap="round" />
      <path d="M0 0 C40 -330 150 -640 380 -860" fill="none" stroke={trunk} strokeWidth={56} strokeLinecap="round" />
      <g transform="translate(380 -860)">
        {edge && fronds.map((d) => <path key={`e${d}`} d={d} fill="none" stroke={edge} strokeWidth={50} strokeLinecap="round" />)}
        {fronds.map((d) => (
          <path key={d} d={d} fill="none" stroke={frond} strokeWidth={36} strokeLinecap="round" />
        ))}
        <circle cx={-6} cy={22} r={20} fill={trunk} stroke={edge ?? "none"} strokeWidth={edge ? 7 : 0} />
        <circle cx={30} cy={30} r={17} fill={trunk} stroke={edge ?? "none"} strokeWidth={edge ? 7 : 0} />
      </g>
    </g>
  );
}

type Type = { caps: string; capsWeight: number; big: string; bigWeight: number; bigSize: number; bigText: string; track: number };
// The first cover's own pairing: Zenzero caps, and the bracketed words in Montserrat Thin.
const FIRST_BOOK: Type = { caps: ZEN, capsWeight: 400, big: MONT, bigWeight: 100, bigSize: 156, bigText: "[Quality Space]", track: 5 };

function Title({ color, gold, soft, type }: { color: string; gold: string; soft: string; type: Type }) {
  return (
    <g fill={color} textAnchor="middle">
      <text x={W / 2} y={282} fontFamily={type.caps} fontWeight={type.capsWeight} fontSize={84} letterSpacing={type.track + 4}>
        BUILDING A
      </text>
      <text x={W / 2} y={452} fontFamily={type.big} fontWeight={type.bigWeight} fontSize={type.bigSize} letterSpacing={1}>
        {type.bigText}
      </text>
      <text x={W / 2} y={1554} fontFamily={THIN} fontWeight={300} fontSize={120} fill={gold}>
        ∞
      </text>
      <text x={W / 2} y={1631} fontFamily={type.caps} fontWeight={type.capsWeight} fontSize={58} letterSpacing={type.track - 1} fill={soft}>
        STORIES FROM THE LEUCADIA CLUB
      </text>
      <text x={W / 2} y={1726} fontFamily={THIN} fontWeight={300} fontSize={120} fill={gold}>
        ∞
      </text>
    </g>
  );
}

function Quote({ x, y, color, gold, size = 54 }: { x: number; y: number; color: string; gold: string; size?: number }) {
  const step = size * 1.15;
  return (
    <g textAnchor="middle" fontFamily={ZEN} fontSize={size} fill={color} letterSpacing={3}>
      <text x={x} y={y}>
        “AND THE MEMBERS
      </text>
      <text x={x} y={y + step}>
        THOUGHT IT WAS
      </text>
      <text x={x} y={y + step * 2} fill={gold}>
        GOOD.”
      </text>
    </g>
  );
}

const WAVES = "q16 -9 32 0 t32 0 t32 0 t32 0";

// A tiki torch stuck in the sand, burning.
function Torch({ x, y, h = 300, dark, id }: { x: number; y: number; h?: number; dark: string; id: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={0} cy={-h - 40} r={120} fill={`url(#${id})`} />
      <path d={`M0 0 V${-h}`} stroke={dark} strokeWidth={12} strokeLinecap="round" />
      <path d={`M-22 ${-h - 34} H22 L14 ${-h + 6} H-14 Z`} fill={dark} />
      <path d={`M-20 ${-h - 12} H20 M-17 ${-h - 22} H17`} stroke="#ff8a4c" strokeWidth={3} opacity={0.7} />
      <path d={`M0 ${-h - 108} C30 ${-h - 76} 24 ${-h - 44} 0 ${-h - 34} C-24 ${-h - 44} -20 ${-h - 70} -6 ${-h - 84} C-4 ${-h - 72} 4 ${-h - 70} 0 ${-h - 108} Z`} fill="#ffb347" />
      <path d={`M0 ${-h - 80} C14 ${-h - 62} 12 ${-h - 46} 0 ${-h - 38} C-12 ${-h - 46} -8 ${-h - 60} 0 ${-h - 80} Z`} fill="#fff1bd" />
    </g>
  );
}

// A carved tiki, glowing from inside.
function Tiki({ x, y, k = 1, dark, glow }: { x: number; y: number; k?: number; dark: string; glow: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M-52 0 V-250 Q-52 -300 0 -300 Q52 -300 52 -250 V0 Z" fill={dark} />
      <path d="M-62 -214 H62 M-62 -74 H62" stroke={dark} strokeWidth={16} strokeLinecap="round" />
      <path d="M-34 -262 Q-18 -278 -6 -262 M6 -262 Q18 -278 34 -262" fill="none" stroke={glow} strokeWidth={7} strokeLinecap="round" />
      <ellipse cx={-21} cy={-232} rx={13} ry={9} fill={glow} />
      <ellipse cx={21} cy={-232} rx={13} ry={9} fill={glow} />
      <path d="M-9 -206 L0 -186 L9 -206" fill="none" stroke={glow} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-34 -160 H34 V-112 H-34 Z" fill={glow} />
      <path d="M-22 -160 V-112 M-8 -160 V-112 M6 -160 V-112 M20 -160 V-112 M-34 -136 H34" stroke={dark} strokeWidth={6} />
      <path d="M-30 -44 l12 -14 l12 14 l12 -14 l12 14 l12 -14" fill="none" stroke={glow} strokeWidth={5} strokeLinejoin="round" opacity={0.85} />
    </g>
  );
}

// A thatched tiki bar, lit from inside.
function Hut({ x, y, dark, glow }: { x: number; y: number; dark: string; glow: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-150} y={-190} width={300} height={190} fill={glow} opacity={0.9} />
      <path d="M-150 0 V-200 M150 0 V-200 M-150 -96 H150" stroke={dark} strokeWidth={18} strokeLinecap="round" />
      <path d="M-150 -96 H150 V0 H-150 Z" fill={dark} />
      <path d="M-206 -190 L-60 -330 H60 L206 -190 Z" fill={dark} />
      <path d="M-206 -190 l18 26 l18 -26 l18 26 l18 -26 l18 26 l18 -26 l18 26 l18 -26 l18 26 l18 -26 l18 26 l18 -26 l18 26 l18 -26 l18 26 l18 -26 l18 26 l18 -26 l18 26 l18 -26 l18 26 l18 -26 l14 20" fill={dark} stroke={dark} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-96 -150 q0 -22 18 -22 q18 0 18 22 v20 h-36 Z M-20 -152 h40 l-8 34 h-24 Z M62 -150 q0 -22 18 -22 q18 0 18 22 v20 h-36 Z" fill={dark} />
    </g>
  );
}

// Lights strung between two points, sagging in the middle.
function StringLights({ x1, y1, x2, y2, sag = 90, n = 11, colors }: { x1: number; y1: number; x2: number; y2: number; sag?: number; n?: number; colors: string[] }) {
  const pts = Array.from({ length: n }, (_, i) => {
    const t = (i + 1) / (n + 1);
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + sag * 4 * t * (1 - t)] as const;
  });
  return (
    <g>
      <path d={`M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag * 2} ${x2} ${y2}`} fill="none" stroke="#150a24" strokeWidth={4} />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y + 12} r={22} fill={colors[i % colors.length]} opacity={0.28} />
          <circle cx={x} cy={y + 12} r={10} fill={colors[i % colors.length]} />
        </g>
      ))}
    </g>
  );
}

type Look = {
  sky: [number, string][];
  sea: [string, string];
  dark: string;
  sun: string;
  streak: string;
  clouds: [string, string, string];
  starsTo: number;
};
const AFTERGLOW: Look = {
  sky: [[0, "#1a1040"], [0.36, "#5a2a82"], [0.62, "#c8477a"], [0.84, "#ff8a4c"], [1, "#ffd27a"]],
  sea: ["#b8436f", "#2a1450"],
  dark: "#150a24",
  sun: "#fff1bd",
  streak: "#ffd98a",
  clouds: ["#ffb07a", "#f58aa0", "#ffd08a"],
  starsTo: 560,
};
// Tiki lounge: teal night over an orange horizon.
const LAGOON: Look = {
  sky: [[0, "#06222e"], [0.38, "#0c5560"], [0.64, "#2f9a8c"], [0.84, "#f7a24b"], [1, "#ffdc8a"]],
  sea: ["#d9823f", "#0b3a46"],
  dark: "#04161d",
  sun: "#fff1bd",
  streak: "#ffe0a0",
  clouds: ["#f9b572", "#7fd0bd", "#ffd08a"],
  starsTo: 600,
};

function Scene({ look, type, extras }: { look: Look; type: Type; extras: "none" | "torches" | "lounge" }) {
  const dark = look.dark;
  const tone: Tone = { ink: dark, skin: dark, outline: 6 };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          {look.sky.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3c2" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb35c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="flame" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd27a" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ff8a4c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look.sea[0]} />
          <stop offset="1" stopColor={look.sea[1]} />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <rect width={W} height={1100} fill="url(#sky)" />
      <Stars seed={21} count={120} maxY={look.starsTo} />
      <g filter="url(#soft)" opacity={0.5}>
        <ellipse cx={260} cy={760} rx={330} ry={20} fill={look.clouds[0]} />
        <ellipse cx={930} cy={690} rx={300} ry={16} fill={look.clouds[1]} />
        <ellipse cx={720} cy={900} rx={380} ry={18} fill={look.clouds[2]} />
      </g>
      <ellipse cx={640} cy={1100} rx={520} ry={330} fill="url(#glow)" />
      <circle cx={640} cy={1100} r={150} fill={look.sun} />
      <rect y={1100} width={W} height={236} fill="url(#sea)" />
      <path d="M520 1120 H760 M545 1158 H735 M568 1196 H712 M590 1234 H690 M606 1272 H674" stroke={look.streak} strokeWidth={11} strokeLinecap="round" opacity={0.85} />
      <path d={`M0 1128 ${WAVES} ${WAVES} ${WAVES} ${WAVES} ${WAVES} ${WAVES} ${WAVES} ${WAVES} ${WAVES} ${WAVES}`} fill="none" stroke={look.streak} strokeWidth={4} opacity={0.45} />
      <path d="M0 1322 Q300 1286 620 1318 T1200 1302 V1800 H0 Z" fill={dark} />
      <ArchPalm x={60} y={1480} k={1.04} trunk={dark} frond={dark} />

      {extras === "none" && (
        <>
          <PlantedBoard x={1040} y={1440} h={280} lean={8} color={dark} stripe="#ff8a4c" tone={tone} />
          <PlantedBoard x={1112} y={1450} h={230} lean={-5} color={dark} stripe="#ffd27a" tone={tone} />
        </>
      )}
      {extras === "torches" && (
        <>
          <Torch x={330} y={1372} h={250} dark={dark} id="flame" />
          <Torch x={1010} y={1366} h={290} dark={dark} id="flame" />
          <PlantedBoard x={1110} y={1450} h={250} lean={7} color={dark} stripe="#ff8a4c" tone={tone} />
        </>
      )}
      {extras === "lounge" && (
        <>
          <StringLights x1={470} y1={724} x2={985} y2={992} sag={70} colors={["#ffd27a", "#ff8a4c", "#7fe0cf", "#fff1bd"]} />
          <Hut x={985} y={1330} dark={dark} glow="#f7a24b" />
          <Tiki x={236} y={1356} k={0.78} dark={dark} glow="#ff9a4c" />
          <Torch x={360} y={1372} h={230} dark={dark} id="flame" />
        </>
      )}

      {extras === "lounge" ? (
        <>
          <Sitter x={436} y={1338} hair={dark} shirt={dark} shorts={dark} tone={tone} arm="around" />
          <Sitter x={562} y={1342} size={0.94} hair={dark} shirt={dark} shorts={dark} tone={tone} />
          <Sitter x={682} y={1338} hair={dark} shirt={dark} shorts={dark} tone={tone} arm="up" />
          <Sitter x={770} y={1346} size={0.7} hair={dark} shirt={dark} shorts={dark} tone={tone} />
        </>
      ) : (
        <>
          <Sitter x={470} y={1338} hair={dark} shirt={dark} shorts={dark} tone={tone} arm="around" />
          <Sitter x={600} y={1342} size={0.94} hair={dark} shirt={dark} shorts={dark} tone={tone} />
          <Sitter x={726} y={1338} hair={dark} shirt={dark} shorts={dark} tone={tone} arm="up" />
          <Sitter x={852} y={1344} size={0.72} hair={dark} shirt={dark} shorts={dark} tone={tone} />
        </>
      )}
      <Quote x={920} y={752} color="#fff6dc" gold="#ffc84a" />
      <Title color="#ffffff" gold="#ffc84a" soft={extras === "lounge" ? "#e6f6f2" : "#f3e6f5"} type={type} />
    </svg>
  );
}

async function main() {
  const out = process.argv[2];
  if (!out) throw new Error("Say where the JPGs go: tsx covers.tsx <out dir>");
  // File name → cover. The first is the one the site uses for link previews.
  const covers: [string, React.ReactElement][] = [
    ["quality-space-cover", <Scene key="lounge" look={LAGOON} type={FIRST_BOOK} extras="lounge" />],
    ["quality-space-cover-torches", <Scene key="torches" look={AFTERGLOW} type={FIRST_BOOK} extras="torches" />],
  ];
  for (const [name, cover] of covers) {
    const svg = renderToStaticMarkup(cover);
    const file = path.join(out, `${name}.jpg`);
    const info = await sharp(Buffer.from(svg), { density: 96 }).resize(W, H).jpeg({ quality: 92, mozjpeg: true }).toFile(file);
    console.log(`${name}.jpg ${info.width} × ${info.height}, ${Math.round(info.size / 1024)} KB`);
  }
}
main().then(() => process.exit(0), (e) => { console.error(e instanceof Error ? e.stack : e); process.exit(1); });
