'use client'
import { useState, useEffect, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// ── Theme palette ─────────────────────────────────────────────────────────────
const G  = '#16a34a'
const P  = '#ec4899'
const GZ = 'rgba(16,163,74,0.18)'
const PZ = 'rgba(236,72,153,0.15)'
const FZ = 'rgba(180,140,50,0.22)'
const FS = '#d97706'
const LN = '#9ca3af'
const TX = '#6b7280'

// ── SVG helpers ───────────────────────────────────────────────────────────────
function Candle({ x, w=14, high, open, close, low, color }: { x:number; w?:number; high:number; open:number; close:number; low:number; color:string }) {
  const top = Math.min(open, close)
  const h   = Math.max(Math.abs(open - close), 3)
  return <g><line x1={x+w/2} y1={high} x2={x+w/2} y2={low} stroke={color} strokeWidth={1.5}/><rect x={x} y={top} width={w} height={h} fill={color} rx={1.5}/></g>
}
function D({ children, h=210 }: { children:ReactNode; h?:number }) {
  return <div className="w-full rounded-xl overflow-hidden my-2" style={{ background:'var(--t-item-bg)' }}><svg viewBox={`0 0 560 ${h}`} className="w-full" style={{ maxHeight:260 }}>{children}</svg></div>
}

// ── Diagrams ──────────────────────────────────────────────────────────────────
function BosChart() {
  // UP: peak at (95,88), trough at (148,152), arrow tip at (220,38)
  // line crosses BOS level (y=88) again at: 88=152+(38-152)/(220-148)*(x-148) → x≈195
  // DOWN: trough at (375,145), bounce at (418,105), arrow tip at (495,195)
  // line crosses BOS level (y=145) again at: 145=105+(195-105)/(495-418)*(x-418) → x≈452
  return <D h={215}>
    <defs>
      <marker id="ag" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 Z" fill={G}/></marker>
      <marker id="ap" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 Z" fill={P}/></marker>
    </defs>

    {/* UP TREND */}
    <text x={120} y={20} textAnchor="middle" fontSize={13} fontWeight="bold" fill={G}>UP TREND</text>
    <polyline points="25,192 95,88 148,152 220,38"
      fill="none" stroke={G} strokeWidth={2.5} strokeLinejoin="miter" markerEnd="url(#ag)"/>
    {/* BOS: from peak to where final segment re-crosses y=88 */}
    <line x1={95} y1={88} x2={195} y2={88} stroke={G} strokeWidth={1.5} strokeDasharray="6,4"/>
    <text x={145} y={82} textAnchor="middle" fontSize={10} fill={G} fontWeight="700">BOS</text>
    <text x={120} y={208} textAnchor="middle" fontSize={9} fill={TX}>Break the last <tspan fontWeight="bold" fill={G}>High</tspan> with <tspan fontWeight="bold" textDecoration="underline">candle body</tspan></text>

    <line x1={265} y1={25} x2={265} y2={200} stroke={LN} strokeWidth={0.5} strokeDasharray="4,4"/>

    {/* DOWN TREND */}
    <text x={400} y={20} textAnchor="middle" fontSize={13} fontWeight="bold" fill={P}>DOWN TREND</text>
    <polyline points="308,38 375,145 418,105 495,195"
      fill="none" stroke={P} strokeWidth={2.5} strokeLinejoin="miter" markerEnd="url(#ap)"/>
    {/* BOS: from trough to where final segment re-crosses y=145 */}
    <line x1={375} y1={145} x2={452} y2={145} stroke={P} strokeWidth={1.5} strokeDasharray="6,4"/>
    <text x={413} y={139} textAnchor="middle" fontSize={10} fill={P} fontWeight="700">BOS</text>
    <text x={400} y={208} textAnchor="middle" fontSize={9} fill={TX}>Break the last <tspan fontWeight="bold" fill={P}>Low</tspan> with <tspan fontWeight="bold" textDecoration="underline">candle body</tspan></text>
  </D>
}

function MssChart() {
  // viewBox 560×215. Left 0-265, right 265-560.
  // UP: (22,192)→peak1(82,108)→trough(128,150)→peak2(175,50)→drop(248,183)
  //   BOS green y=108: x1=82, x2=175 (peak1→peak2 x)
  //   MSS pink y=150: (175,50)→(248,183) at y=150 → x=175+(150-50)/(183-50)*73=175+54.9≈230
  //     x1=128, x2=230
  // DOWN: (290,42)→trough1(355,118)→bounce(400,80)→trough2(452,192)→rise(538,48)
  //   BOS pink y=118: (400,80)→(452,192) at y=118 → x=400+(118-80)/(192-80)*52=400+17.6≈418
  //     x1=355, x2=418
  //   MSS green y=80: (452,192)→(538,48) at y=80 → x=452+(80-192)/(48-192)*86=452+66.9≈519
  //     x1=400, x2=519
  return <D h={215}>
    <defs>
      <marker id="mg" markerWidth="14" markerHeight="14" refX="7" refY="7" orient="auto"><path d="M0,0 L14,7 L0,14 Z" fill={G}/></marker>
      <marker id="mp" markerWidth="14" markerHeight="14" refX="7" refY="7" orient="auto"><path d="M0,0 L14,7 L0,14 Z" fill={P}/></marker>
    </defs>

    {/* UP TREND → MSS */}
    <text x={132} y={20} textAnchor="middle" fontSize={12} fontWeight="bold" fill={G}>UP TREND → MSS</text>
    <polyline points="22,192 82,108 128,150 175,50 248,183"
      fill="none" stroke={G} strokeWidth={2.5} strokeLinejoin="miter" markerEnd="url(#mg)"/>
    {/* BOS: ends at x≈148 where segment (128,150)→(175,50) crosses y=108 */}
    <line x1={82} y1={108} x2={148} y2={108} stroke={G} strokeWidth={1.5} strokeDasharray="6,4"/>
    <text x={115} y={102} textAnchor="middle" fontSize={10} fill={G} fontWeight="700">BOS</text>
    <line x1={128} y1={150} x2={230} y2={150} stroke={P} strokeWidth={1.5} strokeDasharray="6,4"/>
    <text x={179} y={164} textAnchor="middle" fontSize={10} fill={P} fontWeight="700">MSS</text>
    <text x={132} y={208} textAnchor="middle" fontSize={9} fill={TX}>Focus on <tspan fontWeight="bold" fill={P}>Protective Low</tspan> <tspan fontWeight="bold">taken</tspan></text>

    <line x1={265} y1={25} x2={265} y2={200} stroke={LN} strokeWidth={0.5} strokeDasharray="4,4"/>

    {/* DOWN TREND → MSS */}
    <text x={412} y={20} textAnchor="middle" fontSize={12} fontWeight="bold" fill={P}>DOWN TREND → MSS</text>
    <polyline points="290,42 355,118 400,80 452,192 538,48"
      fill="none" stroke={P} strokeWidth={2.5} strokeLinejoin="miter" markerEnd="url(#mp)"/>
    <line x1={355} y1={118} x2={418} y2={118} stroke={P} strokeWidth={1.5} strokeDasharray="6,4"/>
    <text x={386} y={132} textAnchor="middle" fontSize={10} fill={P} fontWeight="700">BOS</text>
    <line x1={400} y1={80} x2={519} y2={80} stroke={G} strokeWidth={1.5} strokeDasharray="6,4"/>
    <text x={459} y={74} textAnchor="middle" fontSize={10} fill={G} fontWeight="700">MSS</text>
    <text x={412} y={208} textAnchor="middle" fontSize={9} fill={TX}>Focus on <tspan fontWeight="bold" fill={G}>Protective High</tspan> <tspan fontWeight="bold">taken</tspan></text>
  </D>
}

function FvgIntroChart() {
  // Box spans the full width. Candles grouped in left portion:
  // Candle1 body BELOW box (high wick = fvgBot), Candle2 spans box, Candle3 body ABOVE box (low wick = fvgTop)
  const fvgTop = 36, fvgBot = 150, w = 20, arrowX = 490
  const c1x = 80, c2x = 126, c3x = 190
  return <D h={205}>
    {/* FVG zone — starts left of all candles, extends to right */}
    <rect x={18} y={fvgTop} width={512} height={fvgBot-fvgTop} fill={GZ} stroke={G} strokeWidth={1} rx={4}/>

    {/* Candle 1 — body below box, high wick stops at fvgBot */}
    <line x1={c1x+w/2} y1={fvgBot} x2={c1x+w/2} y2={188} stroke="#fff" strokeWidth={2}/>
    <rect x={c1x} y={160} width={w} height={20} fill="#fff" stroke={G} strokeWidth={1} rx={2}/>

    {/* Candle 2 — tall, body fills box, wicks extend beyond */}
    <line x1={c2x+w/2} y1={20} x2={c2x+w/2} y2={164} stroke="#fff" strokeWidth={2}/>
    <rect x={c2x} y={fvgTop+2} width={w} height={fvgBot-fvgTop-4} fill="#fff" stroke={G} strokeWidth={1} rx={2}/>

    {/* Candle 3 — body above box, low wick stops at fvgTop */}
    <line x1={c3x+w/2} y1={10} x2={c3x+w/2} y2={fvgTop} stroke="#fff" strokeWidth={2}/>
    <rect x={c3x} y={14} width={w} height={18} fill="#fff" stroke={G} strokeWidth={1} rx={2}/>

    {/* Double-headed arrow at right side of box */}
    <line x1={arrowX} y1={fvgTop+14} x2={arrowX} y2={fvgBot-14} stroke="#fff" strokeWidth={2.5}/>
    <polygon points={`${arrowX-8},${fvgTop+16} ${arrowX},${fvgTop} ${arrowX+8},${fvgTop+16}`} fill="#fff"/>
    <polygon points={`${arrowX-8},${fvgBot-16} ${arrowX},${fvgBot} ${arrowX+8},${fvgBot-16}`} fill="#fff"/>

    {/* Label */}
    <text x={310} y={198} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#fff">Fair Value Gap</text>
  </D>
}

function BisiSibiChart() {
  // Same layout as FvgIntroChart: box spans left portion, candles grouped left
  // BISI: c1 body below box (high wick=fvgBot), c2 GREEN spans box, c3 body above box (low wick=fvgTop)
  // SIBI: mirrored — c1 body ABOVE box (low wick=fvgTop), c2 PINK spans box, c3 body BELOW box (high wick=fvgBot)
  const fvgTop=38, fvgBot=152, w=16
  return <D h={215}>
    {/* ── BISI ── */}
    <text x={132} y={18} textAnchor="middle" fontSize={11} fontWeight="bold" fill={G}>BISI — Bullish FVG</text>
    <rect x={15} y={fvgTop} width={240} height={fvgBot-fvgTop} fill={GZ} stroke={G} strokeWidth={1} rx={3}/>
    {/* c1: neutral white */}
    <line x1={68+w/2} y1={fvgBot} x2={68+w/2} y2={184} stroke="#fff" strokeWidth={1.5}/>
    <rect x={68} y={156} width={w} height={20} fill="#fff" stroke={LN} strokeWidth={1} rx={2}/>
    {/* c2: bullish GREEN candle */}
    <line x1={100+w/2} y1={22} x2={100+w/2} y2={160} stroke={G} strokeWidth={1.5}/>
    <rect x={100} y={fvgTop+2} width={w} height={fvgBot-fvgTop-4} fill={G} stroke={G} strokeWidth={1} rx={2}/>
    {/* c3: neutral white */}
    <line x1={144+w/2} y1={12} x2={144+w/2} y2={fvgTop} stroke="#fff" strokeWidth={1.5}/>
    <rect x={144} y={16} width={w} height={18} fill="#fff" stroke={LN} strokeWidth={1} rx={2}/>
    <text x={132} y={208} textAnchor="middle" fontSize={9} fill={TX}>2nd candle → <tspan fontWeight="bold" fill={G}>bullish candle</tspan></text>

    <line x1={265} y1={25} x2={265} y2={198} stroke={LN} strokeWidth={0.5} strokeDasharray="3,3"/>

    {/* ── SIBI ── */}
    <text x={412} y={18} textAnchor="middle" fontSize={11} fontWeight="bold" fill={P}>SIBI — Bearish FVG</text>
    <rect x={278} y={fvgTop} width={240} height={fvgBot-fvgTop} fill={PZ} stroke={P} strokeWidth={1} rx={3}/>
    {/* c1: white, body ABOVE box (low wick = fvgTop) */}
    <line x1={322+w/2} y1={12} x2={322+w/2} y2={fvgTop} stroke="#fff" strokeWidth={1.5}/>
    <rect x={322} y={16} width={w} height={18} fill="#fff" stroke={LN} strokeWidth={1} rx={2}/>
    {/* c2: bearish PINK candle */}
    <line x1={354+w/2} y1={22} x2={354+w/2} y2={160} stroke={P} strokeWidth={1.5}/>
    <rect x={354} y={fvgTop+2} width={w} height={fvgBot-fvgTop-4} fill={P} stroke={P} strokeWidth={1} rx={2}/>
    {/* c3: neutral white */}
    <line x1={398+w/2} y1={fvgBot} x2={398+w/2} y2={184} stroke="#fff" strokeWidth={1.5}/>
    <rect x={398} y={156} width={w} height={20} fill="#fff" stroke={LN} strokeWidth={1} rx={2}/>
    <text x={412} y={208} textAnchor="middle" fontSize={9} fill={TX}>2nd candle → <tspan fontWeight="bold" fill={P}>bearish candle</tspan></text>
  </D>
}

function FvgTip1Chart() {
  const PL=150, bh=22
  return <D h={228}>
    <defs>
      <marker id="t1ar" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
        <path d="M0,0 L12,6 L0,12 Z" fill={G}/>
      </marker>
    </defs>
    {/* Price path: rise → peak → trough at PL → sharp rise with arrow */}
    <polyline points="45,220 172,65 280,150 420,26" fill="none" stroke={G} strokeWidth={2} strokeLinejoin="miter" markerEnd="url(#t1ar)"/>
    {/* Protective Low: from trough rightward */}
    <line x1={280} y1={PL} x2={542} y2={PL} stroke={LN} strokeWidth={1}/>
    <text x={411} y={PL-5} textAnchor="middle" fontSize={9} fill={TX}>Protective Low</text>
    {/* 3 valid FVGs above PL — right side, stacked */}
    <rect x={292} y={120} width={210} height={bh} fill={GZ} stroke={G} strokeWidth={1} rx={2}/>
    <line x1={297} y1={131} x2={497} y2={131} stroke={G} strokeWidth={1} strokeDasharray="5,4"/>
    <rect x={292} y={90} width={210} height={bh} fill={GZ} stroke={G} strokeWidth={1} rx={2}/>
    <line x1={297} y1={101} x2={497} y2={101} stroke={G} strokeWidth={1} strokeDasharray="5,4"/>
    <rect x={292} y={60} width={210} height={bh} fill={GZ} stroke={G} strokeWidth={1} rx={2}/>
    <line x1={297} y1={71} x2={497} y2={71} stroke={G} strokeWidth={1} strokeDasharray="5,4"/>
    {/* 2 invalid FVGs below PL — faded out */}
    <rect x={52} y={160} width={218} height={bh} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} rx={2}/>
    <line x1={57} y1={171} x2={265} y2={171} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="5,4"/>
    <rect x={52} y={190} width={218} height={bh} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} rx={2}/>
    <line x1={57} y1={201} x2={265} y2={201} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="5,4"/>
  </D>
}

function FvgTip2Chart() {
  const PL=178, bh=22, gap=10
  const lx=155, lw=110, rx=432, rw=105, mY=110
  return <D h={222}>
    <defs>
      <marker id="t2ar" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
        <path d="M0,0 L12,6 L0,12 Z" fill={G}/>
      </marker>
    </defs>
    {/* ── LEFT: 4H ── */}
    <text x={139} y={18} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#3b82f6">4H</text>
    <polyline points="15,214 88,65 168,178 252,24" fill="none" stroke={G} strokeWidth={2} strokeLinejoin="miter" markerEnd="url(#t2ar)"/>
    <line x1={168} y1={PL} x2={265} y2={PL} stroke={LN} strokeWidth={1}/>
    <text x={216} y={PL+11} textAnchor="middle" fontSize={8} fill={TX}>Protective Low</text>
    <rect x={lx} y={mY} width={lw} height={bh} fill={GZ} stroke={G} strokeWidth={1} rx={2}/>
    <line x1={lx+4} y1={mY+11} x2={lx+lw-4} y2={mY+11} stroke={G} strokeWidth={1} strokeDasharray="5,4"/>

    {/* divider */}
    <line x1={278} y1={18} x2={278} y2={215} stroke={LN} strokeWidth={0.5} strokeDasharray="3,3"/>

    {/* ── RIGHT: 30min ── */}
    <text x={419} y={18} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#3b82f6">30min</text>
    <polyline points="292,214 365,65 448,178 532,24" fill="none" stroke={G} strokeWidth={2} strokeLinejoin="miter" markerEnd="url(#t2ar)"/>
    <line x1={448} y1={PL} x2={545} y2={PL} stroke={LN} strokeWidth={1}/>
    <text x={496} y={PL+11} textAnchor="middle" fontSize={8} fill={TX}>Protective Low</text>
    {/* FVG above — faded */}
    <rect x={rx} y={mY-bh-gap} width={rw} height={bh} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} rx={2}/>
    <line x1={rx+4} y1={mY-bh-gap+11} x2={rx+rw-4} y2={mY-bh-gap+11} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="5,4"/>
    {/* FVG main — green, aligned with left FVG */}
    <rect x={rx} y={mY} width={rw} height={bh} fill={GZ} stroke={G} strokeWidth={1} rx={2}/>
    <line x1={rx+4} y1={mY+11} x2={rx+rw-4} y2={mY+11} stroke={G} strokeWidth={1} strokeDasharray="5,4"/>
    {/* FVG below — faded, 16px gap above PL */}
    <rect x={rx} y={mY+bh+gap} width={rw} height={bh} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} rx={2}/>
    <line x1={rx+4} y1={mY+bh+gap+11} x2={rx+rw-4} y2={mY+bh+gap+11} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="5,4"/>
  </D>
}

function FvgTip3Chart() {
  const PL=178, bh=22, gap=10
  const lx=155, lw=105, rx=432, rw=105, mY=110
  return <D h={222}>
    <defs>
      <marker id="t3ar" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
        <path d="M0,0 L12,6 L0,12 Z" fill={G}/>
      </marker>
    </defs>
    {/* ── LEFT: 30min — 3 zones ── */}
    <text x={139} y={18} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#3b82f6">30min</text>
    <polyline points="15,214 88,65 168,178 252,24" fill="none" stroke={G} strokeWidth={2} strokeLinejoin="miter" markerEnd="url(#t3ar)"/>
    <line x1={168} y1={PL} x2={265} y2={PL} stroke={LN} strokeWidth={1}/>
    <text x={216} y={PL+11} textAnchor="middle" fontSize={8} fill={TX}>Protective Low</text>
    {/* FVG above — faded */}
    <rect x={lx} y={mY-bh-gap} width={lw} height={bh} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} rx={2}/>
    <line x1={lx+4} y1={mY-bh-gap+11} x2={lx+lw-4} y2={mY-bh-gap+11} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="5,4"/>
    {/* FVG main — green */}
    <rect x={lx} y={mY} width={lw} height={bh} fill={GZ} stroke={G} strokeWidth={1} rx={2}/>
    <line x1={lx+4} y1={mY+11} x2={lx+lw-4} y2={mY+11} stroke={G} strokeWidth={1} strokeDasharray="5,4"/>
    {/* FVG below — faded */}
    <rect x={lx} y={mY+bh+gap} width={lw} height={bh} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} rx={2}/>
    <line x1={lx+4} y1={mY+bh+gap+11} x2={lx+lw-4} y2={mY+bh+gap+11} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="5,4"/>

    {/* divider */}
    <line x1={278} y1={18} x2={278} y2={215} stroke={LN} strokeWidth={0.5} strokeDasharray="3,3"/>

    {/* ── RIGHT: 4H — 1 zone ── */}
    <text x={419} y={18} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#3b82f6">4H</text>
    <polyline points="292,214 365,65 448,178 532,24" fill="none" stroke={G} strokeWidth={2} strokeLinejoin="miter" markerEnd="url(#t3ar)"/>
    <line x1={448} y1={PL} x2={545} y2={PL} stroke={LN} strokeWidth={1}/>
    <text x={496} y={PL+11} textAnchor="middle" fontSize={8} fill={TX}>Protective Low</text>
    {/* 1 FVG — green */}
    <rect x={rx} y={mY} width={rw} height={bh} fill={GZ} stroke={G} strokeWidth={1} rx={2}/>
    <line x1={rx+4} y1={mY+11} x2={rx+rw-4} y2={mY+11} stroke={G} strokeWidth={1} strokeDasharray="5,4"/>
  </D>
}

function ObChart() {
  const bw=18
  const blueF='rgba(59,130,246,0.15)', blueS='rgba(59,130,246,0.6)'
  return <D h={220}>
    {/* ══ LEFT: Bearish OB− ══ */}
    <text x={139} y={18} textAnchor="middle" fontSize={11} fontWeight="bold" fill={TX}>Bearish OB−</text>
    {/* Blue OB box: spans FULL WICK range of green OB candle (y=58 to y=160) */}
    <rect x={74} y={58} width={186} height={102} fill={blueF} stroke={blueS} strokeWidth={1} rx={3}/>
    <text x={167} y={116} textAnchor="middle" fontSize={10} fontWeight="bold" fill={blueS}>Order Block</text>
    {/* Bearish FVG: gap between C3 wick-low (y=128) and C5 wick-top (y=148) */}
    <rect x={92} y={128} width={168} height={20} fill={PZ} stroke={P} strokeWidth={0.8} rx={2}/>
    {/* C1: small green */}
    <line x1={18+bw/2} y1={140} x2={18+bw/2} y2={170} stroke={G} strokeWidth={1.5}/>
    <rect x={18} y={147} width={bw} height={16} fill={G} rx={2}/>
    {/* C2: green OB — wick top=58, body 72–148, wick bot=160 */}
    <line x1={54+bw/2} y1={58} x2={54+bw/2} y2={160} stroke={G} strokeWidth={1.5}/>
    <rect x={54} y={72} width={bw} height={76} fill={G} rx={2}/>
    {/* C3: red 1st — wick bottom at y=128 (FVG top boundary) */}
    <line x1={92+bw/2} y1={74} x2={92+bw/2} y2={128} stroke={P} strokeWidth={1.5}/>
    <rect x={92} y={82} width={bw} height={38} fill={P} rx={2}/>
    {/* C4: red 2nd — big/fast displacement, bridges the FVG */}
    <line x1={130+bw/2} y1={78} x2={130+bw/2} y2={188} stroke={P} strokeWidth={1.5}/>
    <rect x={130} y={86} width={bw} height={96} fill={P} rx={2}/>
    {/* C5: red 3rd — wick top at y=148 (FVG bottom boundary) */}
    <line x1={168+bw/2} y1={148} x2={168+bw/2} y2={207} stroke={P} strokeWidth={1.5}/>
    <rect x={168} y={156} width={bw} height={44} fill={P} rx={2}/>

    {/* divider */}
    <line x1={278} y1={18} x2={278} y2={212} stroke={LN} strokeWidth={0.5} strokeDasharray="3,3"/>

    {/* ══ RIGHT: Bullish OB+ ══ */}
    <text x={419} y={18} textAnchor="middle" fontSize={11} fontWeight="bold" fill={TX}>Bullish OB+</text>
    {/* Blue OB box: spans FULL WICK range of red OB candle (y=90 to y=175) */}
    <rect x={370} y={90} width={170} height={85} fill={blueF} stroke={blueS} strokeWidth={1} rx={3}/>
    <text x={455} y={158} textAnchor="middle" fontSize={10} fontWeight="bold" fill={blueS}>Order Block</text>
    {/* Bullish FVG: gap between C4 wick-top (y=130) and C6 wick-bot (y=110) */}
    <rect x={388} y={110} width={152} height={20} fill={GZ} stroke={G} strokeWidth={0.8} rx={2}/>
    {/* C1: red */}
    <line x1={284+bw/2} y1={46} x2={284+bw/2} y2={108} stroke={P} strokeWidth={1.5}/>
    <rect x={284} y={54} width={bw} height={48} fill={P} rx={2}/>
    {/* C2: red */}
    <line x1={318+bw/2} y1={66} x2={318+bw/2} y2={140} stroke={P} strokeWidth={1.5}/>
    <rect x={318} y={74} width={bw} height={60} fill={P} rx={2}/>
    {/* C3: red OB — wick top=90, body 100–162, wick bot=175 */}
    <line x1={352+bw/2} y1={90} x2={352+bw/2} y2={175} stroke={P} strokeWidth={1.5}/>
    <rect x={352} y={100} width={bw} height={62} fill={P} rx={2}/>
    {/* C4: green 1st — wick top at y=130 (FVG bottom boundary, lower price) */}
    <line x1={390+bw/2} y1={130} x2={390+bw/2} y2={170} stroke={G} strokeWidth={1.5}/>
    <rect x={390} y={137} width={bw} height={26} fill={G} rx={2}/>
    {/* C5: green 2nd — big/fast displacement, bridges the FVG */}
    <line x1={425+bw/2} y1={36} x2={425+bw/2} y2={170} stroke={G} strokeWidth={1.5}/>
    <rect x={425} y={44} width={bw} height={118} fill={G} rx={2}/>
    {/* C6: green 3rd — wick bot at y=110 (FVG top boundary, higher price) */}
    <line x1={460+bw/2} y1={36} x2={460+bw/2} y2={110} stroke={G} strokeWidth={1.5}/>
    <rect x={460} y={44} width={bw} height={58} fill={G} rx={2}/>
  </D>
}

function ErlIrlChart() {
  return <D h={210}>
    <defs>
      <marker id="al" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse"><path d="M0,0 L7,3.5 L0,7 Z" fill={LN}/></marker>
      <marker id="ar" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={LN}/></marker>
    </defs>
    <text x={30} y={35} fontSize={12} fontWeight="bold" fill={P}>IRL</text>
    <line x1={55} y1={30} x2={490} y2={30} stroke={LN} strokeWidth={1.5} markerEnd="url(#ar)" markerStart="url(#al)"/>
    <text x={500} y={35} fontSize={12} fontWeight="bold" fill={G}>ERL</text>
    <polyline points="30,185 75,115 115,148 155,82 195,118 240,152 280,92 335,160 395,72" fill="none" stroke={G} strokeWidth={2} strokeLinejoin="round"/>
    <line x1={150} y1={82} x2={520} y2={82} stroke={G} strokeWidth={1.5} strokeDasharray="5,4"/>
    <text x={445} y={78} fontSize={9} fill={G} fontWeight="bold">ERL</text>
    <rect x={215} y={133} width={195} height={28} fill={GZ} stroke={G} strokeWidth={1.5} rx={4}/>
    <text x={312} y={151} textAnchor="middle" fontSize={9} fill={G} fontWeight="bold">IRL (FVG / OB)</text>
    <line x1={30} y1={185} x2={520} y2={185} stroke={P} strokeWidth={1} strokeDasharray="4,3"/>
    <text x={440} y={181} fontSize={8} fill={P}>Protective Low</text>
  </D>
}

function LiqTrapChart() {
  const RT=62, RB=190  // range top/bottom y
  return <D h={272}>
    <defs>
      <marker id="ltAr" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill={G}/>
      </marker>
    </defs>
    {/* Yellow range box */}
    <rect x={0} y={RT} width={308} height={RB-RT} fill="rgba(234,179,8,0.10)" stroke="rgba(234,179,8,0.35)" strokeWidth={1}/>
    {/* Pink PDA box (below the range, right side) */}
    <rect x={300} y={RB} width={200} height={72} fill={PZ} stroke={P} strokeWidth={1} rx={2}/>
    <text x={488} y={234} textAnchor="end" fontSize={12} fontWeight="bold" fill={P}>PDA</text>
    {/* Blue target box (top right) */}
    <rect x={448} y={28} width={108} height={138} fill="rgba(59,130,246,0.13)" stroke="rgba(59,130,246,0.45)" strokeWidth={1} rx={2}/>
    {/* $$$ top dashed line — full width */}
    <line x1={0} y1={RT} x2={55} y2={RT} stroke={LN} strokeWidth={1}/>
    <text x={93} y={RT+4} textAnchor="middle" fontSize={10} fontWeight="bold" fill={LN}>$$$</text>
    <line x1={130} y1={RT} x2={548} y2={RT} stroke={LN} strokeWidth={1} strokeDasharray="6,4"/>
    {/* $$$ bottom dashed line — range width only */}
    <line x1={0} y1={RB} x2={55} y2={RB} stroke={LN} strokeWidth={1}/>
    <text x={93} y={RB+4} textAnchor="middle" fontSize={10} fontWeight="bold" fill={LN}>$$$</text>
    <line x1={130} y1={RB} x2={302} y2={RB} stroke={LN} strokeWidth={1} strokeDasharray="6,4"/>
    {/* Price path: range oscillation */}
    <polyline points="8,190 52,70 100,188 150,69 200,187 252,69 302,188"
      fill="none" stroke={LN} strokeWidth={2.5} strokeLinejoin="miter"/>
    {/* Sweep into PDA + W recovery */}
    <polyline points="302,188 348,252 384,222 414,246"
      fill="none" stroke={LN} strokeWidth={2.5} strokeLinejoin="miter"/>
    {/* Shoot up into target (green + arrow) */}
    <polyline points="414,246 462,44"
      fill="none" stroke={G} strokeWidth={3} strokeLinejoin="miter" markerEnd="url(#ltAr)"/>
  </D>
}


function LiqTargetChart() {
  const ZX=212, ZW=344       // gray+teal boxes: left edge, width
  const SY=44                // 1H SIBI dashed line y (top of yellow)
  const GY=82, GB=128        // gray box top/bottom
  const TB=256               // teal box bottom
  const PL=270               // PLL dashed line y
  return <D h={284}>
    <defs>
      <marker id="ltDn" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto">
        <path d="M0,0 L8,0 L4,8 Z" fill={P}/>
      </marker>
    </defs>
    {/* Title */}
    <text x={280} y={22} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#3b82f6">TF 5min</text>
    {/* Yellow SIBI zone (wider, starts further left) */}
    <rect x={148} y={SY} width={407} height={GY-SY+18} fill="rgba(234,179,8,0.11)" stroke="rgba(234,179,8,0.28)" strokeWidth={1} rx={2}/>
    {/* 1H SIBI dashed line */}
    <line x1={148} y1={SY} x2={555} y2={SY} stroke="rgba(180,140,0,0.55)" strokeWidth={1} strokeDasharray="5,4"/>
    <text x={348} y={SY+14} fontSize={9} fontWeight="bold" fill="rgba(160,120,0,0.85)">1H SIBI</text>
    {/* Gray OB/entry box (overlaps lower yellow) */}
    <rect x={ZX} y={GY} width={ZW} height={GB-GY} fill="rgba(156,163,175,0.18)" stroke="rgba(156,163,175,0.32)" strokeWidth={1} rx={2}/>
    {/* Teal target box */}
    <rect x={ZX} y={GB} width={ZW} height={TB-GB} fill="rgba(20,184,166,0.11)" stroke="rgba(20,184,166,0.35)" strokeWidth={1} rx={2}/>
    {/* PLL dashed line (Previous Last Low) */}
    <line x1={8} y1={PL} x2={550} y2={PL} stroke={LN} strokeWidth={1} strokeDasharray="5,4"/>
    {/* Price staircase HH/HL going up */}
    <polyline points="15,270 46,210 74,228 104,173 132,191 162,142 190,160 215,88"
      fill="none" stroke={LN} strokeWidth={2} strokeLinejoin="miter"/>
    {/* Entry arrow pointing down (reversal at PDA) */}
    <line x1={215} y1={88} x2={215} y2={126} stroke={P} strokeWidth={2.5} markerEnd="url(#ltDn)"/>
    {/* $$$ PLL */}
    <text x={18} y={280} fontSize={9} fill={LN}>$$$</text>
    <line x1={42} y1={275} x2={70} y2={275} stroke={LN} strokeWidth={1}/>
    {/* $$$ HL1 */}
    <text x={77} y={231} fontSize={9} fill={LN}>$$$</text>
    <line x1={101} y1={226} x2={129} y2={226} stroke={LN} strokeWidth={1}/>
    {/* $$$ HL2 */}
    <text x={135} y={194} fontSize={9} fill={LN}>$$$</text>
    <line x1={159} y1={189} x2={187} y2={189} stroke={LN} strokeWidth={1}/>
    {/* $$$ HL3 */}
    <text x={193} y={163} fontSize={9} fill={LN}>$$$</text>
    <line x1={217} y1={158} x2={245} y2={158} stroke={LN} strokeWidth={1}/>
  </D>
}

function TimeframesVisual() {
  const rows = [
    { tfs:'4H · 1D · 1W · 1M', role:'Identify the Trend',  color:G },
    { tfs:'30min · 1H · 4H',   role:'Identify the Zone',   color:'#3b82f6' },
    { tfs:'3min · 5min · 15min',role:'Sweep Liquidity',     color:'#f59e0b' },
    { tfs:'3min · 5min',        role:'Entry',               color:P },
  ]
  return (
    <div className="flex flex-col gap-2 my-2">
      {rows.map((r,i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background:r.color+'12', border:`1px solid ${r.color}33` }}>
          <span className="font-mono text-xs font-bold shrink-0" style={{ color:r.color, minWidth:140 }}>{r.tfs}</span>
          <span className="text-sm font-semibold" style={{ color:'var(--t-text-main)' }}>{r.role}</span>
        </div>
      ))}
    </div>
  )
}

function NewsVisual() {
  return (
    <div className="flex justify-center gap-6 my-4 flex-wrap">
      {['NFP','CPI','FOMC'].map(n => (
        <div key={n} className="w-20 h-20 rounded-full flex items-center justify-center text-sm font-black text-white"
          style={{ background:G, boxShadow:`0 0 20px ${G}55` }}>{n}</div>
      ))}
    </div>
  )
}

function LotSizeStep1() {
  const px=22, py=12, pw=226
  const lx=px+12, vx=px+132, iw=76, ih=13
  const Row = ({label,val,oy,hi=false}:{label:string;val:string;oy:number;hi?:boolean}) => <>
    {hi && <rect x={px+1} y={py+oy-11} width={pw-2} height={17} fill={PZ} rx={1}/>}
    <text x={lx} y={py+oy} fontSize={8.5} fill={hi?P:TX} fontWeight={hi?'bold':'normal'}>{label}</text>
    <rect x={vx} y={py+oy-11} width={iw} height={ih} rx={2}
      fill={hi?'rgba(236,72,153,0.12)':'rgba(255,255,255,0.05)'}
      stroke={hi?P:'rgba(255,255,255,0.1)'} strokeWidth={1}/>
    <text x={vx+4} y={py+oy} fontSize={8.5} fill={hi?P:'#d1d5db'} fontWeight={hi?'bold':'normal'}>{val}</text>
  </>
  return <D h={268}>
    <defs>
      <marker id="ls1Ar" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
        <path d="M0,0 L10,4 L0,8 Z" fill={P}/>
      </marker>
    </defs>
    {/* Panel card */}
    <rect x={px} y={py} width={pw} height={244} rx={6} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth={1}/>
    {/* Title */}
    <text x={lx} y={py+18} fontSize={11} fontWeight="bold" fill="#e5e7eb">Long position</text>
    <text x={px+pw-10} y={py+18} textAnchor="middle" fontSize={10} fill={TX}>✕</text>
    <line x1={px} y1={py+26} x2={px+pw} y2={py+26} stroke="rgba(255,255,255,0.08)" strokeWidth={1}/>
    {/* Tabs */}
    <text x={lx} y={py+40} fontSize={8.5} fontWeight="bold" fill="#e5e7eb">Inputs</text>
    <line x1={lx} y1={py+43} x2={lx+32} y2={py+43} stroke="#e5e7eb" strokeWidth={1.5}/>
    <text x={lx+42} y={py+40} fontSize={8.5} fill={TX}>Style</text>
    <text x={lx+74} y={py+40} fontSize={8.5} fill={TX}>Visibility</text>
    <line x1={px} y1={py+47} x2={px+pw} y2={py+47} stroke="rgba(255,255,255,0.08)" strokeWidth={1}/>
    {/* Form rows */}
    <Row label="Account size" val="1000"      oy={62}/>
    <Row label="Lot size"     val="1"          oy={78}/>
    <Row label="Risk"         val="25.00"      oy={94}/>
    <Row label="Entry price"  val="2988.132"   oy={110}/>
    <Row label="Leverage"     val="10000.0"    oy={126}/>
    <text x={lx} y={py+140} fontSize={7.5} fill={TX} fontWeight="bold">PROFIT LEVEL</text>
    <Row label="Ticks"        val="508313"     oy={154}/>
    <Row label="Price"        val="3496.445"   oy={170}/>
    <text x={lx} y={py+183} fontSize={7.5} fill={TX} fontWeight="bold">STOP LEVEL</text>
    <Row label="Ticks"        val="73243"      oy={197} hi={true}/>
    <Row label="Price"        val="2914.889"   oy={213}/>
    {/* Bottom bar */}
    <line x1={px} y1={py+223} x2={px+pw} y2={py+223} stroke="rgba(255,255,255,0.08)" strokeWidth={1}/>
    <text x={lx} y={py+237} fontSize={8} fill={TX}>Template ▾</text>
    <rect x={px+pw-80} y={py+227} width={36} height={13} rx={2} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1}/>
    <text x={px+pw-62} y={py+237} fontSize={7.5} textAnchor="middle" fill={TX}>Cancel</text>
    <rect x={px+pw-41} y={py+227} width={28} height={13} rx={2} fill="#374151" stroke="rgba(255,255,255,0.2)" strokeWidth={1}/>
    <text x={px+pw-27} y={py+237} fontSize={7.5} textAnchor="middle" fill="#e5e7eb">Ok</text>
    {/* Arrow + label */}
    <path d="M 418,172 Q 365,182 252,204" fill="none" stroke={P} strokeWidth={2.5} markerEnd="url(#ls1Ar)"/>
    <text x={445} y={158} textAnchor="middle" fontSize={9} fontWeight="bold" fill={P}>Stop Level Ticks</text>
    <text x={445} y={172} textAnchor="middle" fontSize={9} fill={LN}>73243</text>
    <text x={445} y={194} textAnchor="middle" fontSize={8} fill={TX}>÷ 100 (Gold)</text>
    <text x={445} y={207} textAnchor="middle" fontSize={9} fontWeight="bold" fill={G}>= 732.43 pips</text>
  </D>
}

function LotSizeFormula() {
  return (
    <div className="flex flex-col items-center gap-3 py-3">
      <div className="w-full px-5 py-4 rounded-2xl text-center" style={{ background:`${G}12`, border:`1px solid ${G}44` }}>
        <p className="text-xs mb-2" style={{ color:TX }}>The Formula</p>
        <p className="text-xl font-black" style={{ color:'var(--t-text-main)' }}>LOT SIZE =</p>
        <div className="flex flex-col items-center my-1">
          <span className="text-base font-bold" style={{ color:G }}>RISK (USD)</span>
          <div className="w-40 h-0.5 my-1" style={{ background:'var(--t-text-main)' }}/>
          <span className="text-base font-bold" style={{ color:P }}>SL (PIPS) × 10</span>
        </div>
      </div>
      <div className="w-full px-5 py-3 rounded-2xl text-center" style={{ background:`${G}10`, border:`1px solid ${G}33` }}>
        <p className="text-xs mb-1" style={{ color:TX }}>Example — XAUUSD, risk 200 USD, SL = 732.43 pips</p>
        <p className="font-mono text-sm" style={{ color:'var(--t-text-main)' }}>
          200 ÷ (732.43 × 10) = <strong style={{ color:G }}>0.02</strong>
        </p>
        <p className="text-xs mt-1" style={{ color:TX }}>Always round <strong>down</strong> to protect your risk</p>
      </div>
    </div>
  )
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Slide   = { heading:string; body:string; bodyNode?:ReactNode; visual?:ReactNode }
type Lesson  = { id:string; title:string; videoUrl:string; slides:Slide[] }
type Course  = { id:string; title:string; description:string; thumbnail:string; category:'technical'|'psychology'|'risk'; lessons:Lesson[] }

// ── Course data ───────────────────────────────────────────────────────────────
const COURSES: Course[] = [
  {
    id:'market-direction', title:'The Key To Market Direction',
    description:'BOS and MSS — the two signals that define where the market is going.',
    thumbnail:'', category:'technical',
    lessons:[
      { id:'md-bos', title:'Break of Structure (BOS)', videoUrl:'',
        slides:[{ heading:'Market Structure — BOS', visual:<BosChart/>,
          body:'**UP TREND** → focus on **High**: we break the last High with the candle body → market continues up.\n**DOWN TREND** → focus on **Low**: we break the last Low with the candle body → market continues down.' }] },
      { id:'md-mss', title:'Market Structure Shift (MSS)', videoUrl:'',
        slides:[{ heading:'Market Structure — MSS', visual:<MssChart/>,
          body:'MSS = the market **changes direction**.\n**UP TREND** → focus on **Protective Low**: breaking it signals a reversal down.\n**DOWN TREND** → focus on **Protective High**: breaking it signals a reversal up.' }] },
    ],
  },
  {
    id:'pda', title:'Premium and Discount Arrays (PDA)',
    description:'FVG, BISI, SIBI, Order Block — identify and use the zones where price reacts.',
    thumbnail:'', category:'technical',
    lessons:[
      { id:'pda-fvg', title:'Fair Value Gaps — Introduction', videoUrl:'',
        slides:[{ heading:'Fair Value Gaps (FVG)', visual:<FvgIntroChart/>,
          body:'FVG = an **imbalance or inefficiency between 3 consecutive candles**.\nThe middle candle (2) moves so fast it leaves a gap between candle 1\'s wick and candle 3\'s wick.\nPrice tends to return to this area to fill the inefficiency.' }] },
      { id:'pda-bisi', title:'FVG — BISI & SIBI', videoUrl:'',
        slides:[{ heading:'Bullish vs Bearish FVG', visual:<BisiSibiChart/>,
          body:'',
          bodyNode:<div className="flex flex-col gap-1">
            <p className="text-sm leading-relaxed" style={{color:'var(--t-text-muted)'}}><strong style={{color:'var(--t-text-main)'}}>BISI</strong> (Buy-side Imbalance / Sell Side Inefficiency): 2nd candle is <strong style={{color:'#16a34a'}}>green</strong> → bullish FVG.</p>
            <p className="text-sm leading-relaxed" style={{color:'var(--t-text-muted)'}}><strong style={{color:'var(--t-text-main)'}}>SIBI</strong> (Sell-side Imbalance / Buy Side Inefficiency): 2nd candle is <strong style={{color:'#ec4899'}}>red</strong> → bearish FVG.</p>
          </div> }] },
      { id:'pda-tip1', title:'FVG — Tip 1: Protective Level Filter', videoUrl:'',
        slides:[{ heading:'Which FVG will price react to?', visual:<FvgTip1Chart/>,
          body:'**Tip 1:** In an up trend, once we have a **Protective Low**, eliminate every FVG that sits **below** it.\nSame logic in down trend: eliminate FVGs **above** the Protective High.\nOnly keep the valid zones on the correct side.' }] },
      { id:'pda-tip2', title:'FVG — Tip 2: HTF → LTF', videoUrl:'',
        slides:[{ heading:'Draw zones from Higher to Lower Timeframe', visual:<FvgTip2Chart/>,
          body:'**Tip 2:** Always start on the **Higher TimeFrame** (4H, 1H) to find the key FVG.\nThen zoom into the **Lower TimeFrame** (30min, 15min) to refine the exact reaction area.\nNever draw FVGs on the entry TF first.' }] },
      { id:'pda-tip3', title:'FVG — Tip 3: Switch TF to Eliminate', videoUrl:'',
        slides:[{ heading:'Reduce to one zone across all TFs', visual:<FvgTip3Chart/>,
          body:'**Tip 3:** Switch between TFs to eliminate FVGs already filled in another TF.\nIf you have many zones on 30min, go to 4H — redundant zones disappear.\n**NB:** The market will ultimately return to **1 zone across all timeframes**.' }] },
      { id:'pda-ob', title:'Order Block (OB)', videoUrl:'',
        slides:[{ heading:'Order Block — Definition', visual:<ObChart/>,
          body:'OB = **last opposing candle before a sharp price move** (with FVG after it).\n\nTo validate an OB:\n• Same trend still in play\n• Clear strong move after the OB\n• FVGs present after the displacement\n• Price hasn\'t returned to it yet (used once only)' }] },
    ],
  },
  {
    id:'price-moves', title:'How Price Really Moves',
    description:'Liquidity, ERL, IRL, the Liquidity Trap and how to target the right level.',
    thumbnail:'', category:'technical',
    lessons:[
      { id:'pm-liq', title:'Liquidity — ERL & IRL', videoUrl:'',
        slides:[{ heading:'ERL ↔ IRL', visual:<ErlIrlChart/>,
          body:'The market moves from **External Range Liquidity (ERL)** — the swing highs/lows — to **Internal Range Liquidity (IRL)** — the FVG/OB inside the range — and vice versa.\nThis cycle repeats on every timeframe.' }] },
      { id:'pm-trap', title:'The Liquidity Trap', videoUrl:'',
        slides:[
          { heading:'The Liquidity Trap', visual:<LiqTrapChart/>,
            body:'In a range, the market will **sweep both sides of liquidity** before continuing the trend.\nNot necessarily the lower one first.\nWait for the correction into a **PDA**, then target at least the high of the range (UP TREND).' },
        ] },
      { id:'pm-target', title:'The Liquidity Target', videoUrl:'',
        slides:[{ heading:'The Liquidity Target', visual:<LiqTargetChart/>,
          body:'After many **HH/HL** moves, price sweeps into a **PDA** (e.g. 1H SIBI). Once the entry model forms inside the OB, enter the trade.\nSet **TP just before the Previous Last Low (PLL)** — the origin of the whole staircase.\n**NB: Trade must be at least 2RR.**' }] },
    ],
  },
  {
    id:'timeframes', title:'How To Use TimeFrames',
    description:'Which TF for trend, zone, liquidity sweep and entry — step by step.',
    thumbnail:'', category:'technical',
    lessons:[
      { id:'tf-bd', title:'The TimeFrames Breakdown', videoUrl:'',
        slides:[{ heading:'The TimeFrames', visual:<TimeframesVisual/>,
          body:'After identifying the trend and direction on the higher TF, drop down to find the zone.\nOnce liquidity is swept within that zone, drop again to look for the entry model.\nAll steps happen top-down — never skip a level.' }] },
    ],
  },
  {
    id:'news', title:'News are part of the game',
    description:'High impact events — NFP, CPI, FOMC — and how to handle them.',
    thumbnail:'', category:'technical',
    lessons:[
      { id:'news-hi', title:'High Impact News', videoUrl:'',
        slides:[{ heading:'High Impact News', visual:<NewsVisual/>,
          body:'News days are **exactly when you should take a rest day**.\n\n🟢 **NFP** — Non-Farm Payrolls (1st Friday of each month)\n🟢 **CPI** — Consumer Price Index (monthly inflation data)\n🟢 **FOMC** — Federal Open Market Committee (rate decisions)\n\nThese create unpredictable volatility. Sit out. Protect capital.' }] },
    ],
  },
  {
    id:'lot-size', title:'How to Calculate Your Lot Size',
    description:'Step-by-step: read SL pips from TradingView ticks → apply the formula.',
    thumbnail:'', category:'risk',
    lessons:[
      { id:'ls-pips', title:'Step 1 — Read Your SL Pips', videoUrl:'',
        slides:[{ heading:'First: calculate your SL Pips', visual:<LotSizeStep1/>,
          body:'1. Draw your stop loss on the chart.\n2. **Right-click the position** → open the Long/Short position tool.\n3. Look at **STOP LEVEL → Ticks**.\n\nExample: Ticks = **73243**\n• Gold (XAUUSD): ÷ 100 → **732.43 pips**\n• Forex: ÷ 10\n• Indices: leave as-is' }] },
      { id:'ls-formula', title:'Step 2 — The Lot Size Formula', videoUrl:'',
        slides:[{ heading:'The Lot Size Formula', visual:<LotSizeFormula/>,
          body:'**LOT SIZE = RISK (USD) ÷ (SL (PIPS) × 10)**\n\nExample — XAUUSD, risk 200 USD, SL = 732.43 pips:\n200 ÷ (732.43 × 10) = 0.02732 → **Your lot: 0.02**\n\nAlways **round down** — never round up on risk.' }] },
    ],
  },
]

// ── Storage ───────────────────────────────────────────────────────────────────
const KEY = 'courses-completed-v1'
const loadDone = (): Set<string> => { try { return new Set(JSON.parse(localStorage.getItem(KEY)||'[]')) } catch { return new Set() } }
const saveDone = (s: Set<string>) => localStorage.setItem(KEY, JSON.stringify([...s]))

// ── Body text renderer ────────────────────────────────────────────────────────
function BodyText({ text }: { text:string }) {
  return (
    <div className="flex flex-col gap-1">
      {text.split('\n').map((line,i) => (
        <p key={i} className="text-sm leading-relaxed" style={{ color:'var(--t-text-muted)' }}>
          {line.split(/\*\*(.*?)\*\*/g).map((p,j) =>
            j%2===1 ? <strong key={j} style={{ color:'var(--t-text-main)' }}>{p}</strong> : p
          )}
        </p>
      ))}
    </div>
  )
}

const CAT_META = {
  technical:  { label:'📈 Technical',       color:'#3b82f6' },
  psychology: { label:'🧠 Psychology',      color:'#8b5cf6' },
  risk:       { label:'🛡️ Risk Management', color:'#f59e0b' },
}

// ── Card ──────────────────────────────────────────────────────────────────────
function CourseCard({ course, done, onClick }: { course:Course; done:Set<string>; onClick:()=>void }) {
  const total = course.lessons.length
  const pct   = total ? Math.round(course.lessons.filter(l=>done.has(l.id)).length/total*100) : 0
  const cat   = CAT_META[course.category]
  return (
    <button onClick={onClick} className="text-left rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{ background:'var(--t-card-bg)', border:'1px solid var(--t-border-soft)' }}>
      <div className="w-full aspect-video flex flex-col items-center justify-center px-4 text-center"
        style={{ background:`linear-gradient(135deg, ${cat.color}18, ${cat.color}08)` }}>
        <span className="text-2xl font-black mb-1" style={{ color:cat.color, opacity:0.6 }}>{cat.label.split(' ')[0]}</span>
        <p className="text-sm font-bold leading-snug" style={{ color:'var(--t-text-main)' }}>{course.title}</p>
      </div>
      <div className="p-4">
        <p className="text-xs mb-3 leading-relaxed" style={{ color:'var(--t-text-muted)' }}>{course.description}</p>
        <div className="h-6 rounded-full overflow-hidden relative" style={{ background:'var(--t-item-bg)' }}>
          <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background:pct===100?'#16a34a':'#22c55e' }}/>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{pct}%</span>
        </div>
      </div>
    </button>
  )
}

// ── Detail ────────────────────────────────────────────────────────────────────
function CourseDetail({ course, done, onToggle, onBack }: { course:Course; done:Set<string>; onToggle:(id:string)=>void; onBack:()=>void }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initIdx = Math.min(Number(searchParams.get('lesson') ?? 0), course.lessons.length - 1)
  const [idx, setIdx] = useState(isNaN(initIdx) ? 0 : initIdx)
  const goTo = (i: number) => { setIdx(i); router.replace(`?course=${encodeURIComponent(course.id)}&lesson=${i}`, { scroll: false }) }
  const lesson = course.lessons[idx]
  const vid    = lesson.videoUrl.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)?.[1]
  const total  = course.lessons.length
  const pct    = total ? Math.round(course.lessons.filter(l=>done.has(l.id)).length/total*100) : 0

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="self-start px-3 py-1.5 rounded-xl text-sm font-semibold"
        style={{ background:'var(--t-item-bg)', color:'var(--t-text-muted)' }}>← Back</button>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0 rounded-2xl p-4" style={{ background:'var(--t-card-bg)', border:'1px solid var(--t-border-soft)' }}>
          <p className="font-bold text-sm mb-2" style={{ color:'var(--t-text-main)' }}>{course.title}</p>
          <div className="h-5 rounded-full overflow-hidden relative mb-4" style={{ background:'var(--t-item-bg)' }}>
            <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background:'#22c55e' }}/>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{pct}%</span>
          </div>
          {course.lessons.map((l,i) => (
            <button key={l.id} onClick={()=>goTo(i)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm mb-1 transition-all"
              style={{ background:idx===i?`${G}15`:'transparent', border:`1px solid ${idx===i?G+'44':'transparent'}`, color:idx===i?'var(--t-text-main)':'var(--t-text-muted)' }}>
              <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background:done.has(l.id)?G:'var(--t-item-bg)', color:done.has(l.id)?'#fff':'var(--t-text-soft)' }}>
                {done.has(l.id)?'✓':i+1}
              </span>
              <span className="leading-snug flex-1">{l.title}</span>
            </button>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 rounded-2xl overflow-hidden" style={{ background:'var(--t-card-bg)', border:'1px solid var(--t-border-soft)' }}>
          <div className="flex items-center justify-between p-4 pb-3" style={{ borderBottom:'1px solid var(--t-border-soft)' }}>
            <p className="font-bold text-sm" style={{ color:'var(--t-text-main)' }}>{lesson.title}</p>
            <button onClick={()=>onToggle(lesson.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              style={{ background:done.has(lesson.id)?G:'var(--t-item-bg)', color:done.has(lesson.id)?'#fff':'var(--t-text-soft)' }}>✓</button>
          </div>
          {vid && <div className="w-full aspect-video bg-black"><iframe src={`https://www.youtube.com/embed/${vid}?rel=0`} className="w-full h-full" allowFullScreen/></div>}
          <div className="p-4 flex flex-col gap-6">
            {lesson.slides.map((s,i) => (
              <div key={i} className="flex flex-col gap-2">
                <p className="font-bold text-sm" style={{ color:'var(--t-text-main)' }}>{s.heading}</p>
                {s.visual}
                <div className="pl-3" style={{ borderLeft:`3px solid ${G}` }}>
                  {s.bodyNode ?? <BodyText text={s.body}/>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CoursesTab() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [done, setDone] = useState<Set<string>>(new Set())
  const [sel, setSel]   = useState<Course|null>(null)
  useEffect(()=>{ setDone(loadDone()) },[])
  useEffect(()=>{
    const cid = searchParams.get('course')
    if (cid) { const c = COURSES.find(x=>x.id===cid); if (c) setSel(c) }
  },[])
  const toggle = (id:string) => setDone(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); saveDone(n); return n })
  const openCourse = (c: Course) => { setSel(c); router.replace(`?course=${encodeURIComponent(c.id)}&lesson=0`, { scroll: false }) }
  const goBack = () => { setSel(null); router.replace('?', { scroll: false }) }
  if (sel) return <CourseDetail course={sel} done={done} onToggle={toggle} onBack={goBack}/>
  return (
    <div className="flex flex-col gap-8">
      {(['technical','risk'] as const).map(cat=>{
        const courses = COURSES.filter(c=>c.category===cat)
        if (!courses.length) return null
        const meta = CAT_META[cat]
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold" style={{ color:meta.color }}>{meta.label}</span>
              <div className="flex-1 h-px" style={{ background:meta.color+'33' }}/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(c=><CourseCard key={c.id} course={c} done={done} onClick={()=>openCourse(c)}/>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}


