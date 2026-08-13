import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Software, Workflow } from '@/data/types';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

// ── RadialMenu overlay (interactive, full-screen) ──────────────────────────

const INNER_R = 56;
const OUTER_R = 140;
const ACTIVE_OUTER_R = 152;
const LABEL_R = (INNER_R + OUTER_R) / 2;

export interface RadialMenuFeature {
  title: string;
  desc: string;
}

export interface RadialMenuSectionStrings {
  badge: string;
  title: string;
  subtitle: string;
  /** Exactly four entries, matching the four feature icons. */
  features: RadialMenuFeature[];
  tryButton: string;
  tryHint: string;
  pageOne: string;
  pageTwo: string;
  scrollHint: string;
  /** Center label of the live overlay when only one page exists. */
  escHint: string;
}

interface MenuItem {
  slot: number;
  name: string;
  color?: string;
  type: 'software' | 'workflow';
  targetId: string;
}

type AnimPhase = 'idle' | 'out' | 'switch' | 'in';

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function sectorPath(
  cx: number,
  cy: number,
  startDeg: number,
  endDeg: number,
  outerR = OUTER_R,
) {
  const oStart = polar(cx, cy, outerR, startDeg);
  const oEnd = polar(cx, cy, outerR, endDeg);
  const iEnd = polar(cx, cy, INNER_R, endDeg);
  const iStart = polar(cx, cy, INNER_R, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y}`,
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${iStart.x} ${iStart.y}`,
    'Z',
  ].join(' ');
}

function isTouchpadWheel(e: WheelEvent): boolean {
  if (e.deltaY !== Math.floor(e.deltaY)) return true;
  const wd = (e as WheelEvent & { wheelDeltaY?: number }).wheelDeltaY;
  if (typeof wd === 'number' && wd !== 0 && wd % 120 !== 0) return true;
  if (e.deltaMode === 0 && Math.abs(e.deltaY) > 0 && Math.abs(e.deltaY) < 50) return true;
  return false;
}

const styleTokens = {
  sectorFill: (isActive: boolean, itemColor?: string) =>
    itemColor
      ? itemColor + (isActive ? '45' : '25')
      : isActive
        ? 'rgba(139,92,246,0.42)'
        : 'rgba(21,21,28,0.82)',
  sectorStroke: (isActive: boolean) =>
    isActive ? 'rgba(167,139,250,0.9)' : 'rgba(148,163,184,0.25)',
  sectorStrokeWidth: (isActive: boolean) => (isActive ? 2 : 1.5),
  centerFill: 'rgba(21,21,28,0.55)',
  centerStroke: 'rgba(148,163,184,0.2)',
  textFill: (isActive: boolean) => (isActive ? '#fff' : '#cbd5e1'),
  emptyMarkFill: 'rgba(148,163,184,0.4)',
};

function RadialMenuOverlay({
  software,
  workflows,
  strings,
  open,
  onOpenChange,
}: {
  software: Software[];
  workflows: Workflow[];
  strings: RadialMenuSectionStrings;
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}) {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [page, setPage] = useState(0);
  const [animPhase, setAnimPhase] = useState<AnimPhase>('idle');
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const openTimeRef = useRef(0);
  const wheelDirRef = useRef(1);
  const wheelAccumRef = useRef(0);
  const wheelCooldownRef = useRef(false);
  const wheelIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sectors = 6;

  const allMenuItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [];
    const favoriteSoftware = software
      .filter((s) => s.launchCount > 100)
      .sort((a, b) => b.launchCount - a.launchCount);
    const favoriteWorkflows = workflows.filter((w) => w.isFavorite);

    favoriteSoftware.slice(0, 6).forEach((app, idx) => {
      items.push({ slot: idx, name: app.name, color: app.color, type: 'software', targetId: app.id });
    });
    if (items.length < 6) {
      favoriteWorkflows.slice(0, 6 - items.length).forEach((wf, idx) => {
        items.push({ slot: items.length + idx, name: wf.name, color: wf.color, type: 'workflow', targetId: wf.id });
      });
    }

    const moreSoftware = favoriteSoftware.slice(6);
    const moreWorkflows = favoriteWorkflows.slice(Math.max(0, 6 - favoriteSoftware.length));
    const page2: MenuItem[] = [];
    moreSoftware.slice(0, 6).forEach((app, idx) => {
      page2.push({ slot: sectors + idx, name: app.name, color: app.color, type: 'software', targetId: app.id });
    });
    if (page2.length < 6) {
      moreWorkflows.slice(0, 6 - page2.length).forEach((wf, idx) => {
        page2.push({ slot: sectors + page2.length + idx, name: wf.name, color: wf.color, type: 'workflow', targetId: wf.id });
      });
    }
    return [...items, ...page2];
  }, [software, workflows]);

  const totalPages = useMemo(() => {
    const maxSlot = allMenuItems.reduce((max, it) => Math.max(max, it.slot), -1);
    return Math.max(1, Math.ceil((maxSlot + 1) / sectors));
  }, [allMenuItems]);

  const currentItems = useMemo(() =>
    allMenuItems
      .filter((it) => Math.floor(it.slot / sectors) === page)
      .map((it) => ({ ...it, slot: it.slot % sectors })),
  [allMenuItems, page]);

  const itemBySlot = useMemo(() => {
    const map = new Map<number, MenuItem>();
    currentItems.forEach((it) => map.set(it.slot, it));
    return map;
  }, [currentItems]);

  const closeMenu = useCallback((closeMethod?: string) => {
    const duration = openTimeRef.current ? Date.now() - openTimeRef.current : 0;
    track('radial_menu_close', { close_method: closeMethod ?? 'unknown', duration_ms: duration });
    onOpenChange(false);
    setMounted(false);
    setActiveSlot(null);
    wheelAccumRef.current = 0;
    wheelCooldownRef.current = false;
    if (wheelIdleTimerRef.current) clearTimeout(wheelIdleTimerRef.current);
    if (wheelCooldownTimerRef.current) clearTimeout(wheelCooldownTimerRef.current);
  }, [onOpenChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (open) {
      setCursorPos(lastMousePosRef.current);
      setActiveSlot(null);
      setPage(0);
      setAnimPhase('idle');
      wheelAccumRef.current = 0;
      wheelCooldownRef.current = false;
      openTimeRef.current = Date.now();
      track('radial_menu_open', { trigger: 'button' });
      setTimeout(() => setMounted(true), 50);
    } else {
      setMounted(false);
    }
  }, [open]);

  const animPhaseRef = useRef(animPhase);
  animPhaseRef.current = animPhase;
  const totalPagesRef = useRef(totalPages);
  totalPagesRef.current = totalPages;

  useEffect(() => {
    if (!open) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (totalPagesRef.current <= 1) return;
      const touchpad = isTouchpadWheel(e);
      if (!touchpad) {
        if (animPhaseRef.current !== 'idle') return;
        wheelDirRef.current = e.deltaY > 0 ? 1 : -1;
        wheelAccumRef.current = 0;
        setAnimPhase('out');
        return;
      }
      if (wheelCooldownRef.current) return;
      wheelAccumRef.current += e.deltaY;
      if (wheelIdleTimerRef.current) { clearTimeout(wheelIdleTimerRef.current); wheelIdleTimerRef.current = null; }
      if (Math.abs(wheelAccumRef.current) >= 60) {
        wheelDirRef.current = wheelAccumRef.current > 0 ? 1 : -1;
        wheelAccumRef.current = 0;
        wheelCooldownRef.current = true;
        if (wheelCooldownTimerRef.current) clearTimeout(wheelCooldownTimerRef.current);
        wheelCooldownTimerRef.current = setTimeout(() => { wheelCooldownRef.current = false; wheelAccumRef.current = 0; }, 800);
        setAnimPhase('out');
        return;
      }
      wheelIdleTimerRef.current = setTimeout(() => { wheelAccumRef.current = 0; }, 150);
    };
    window.addEventListener('wheel', handler, { passive: false, capture: true } as AddEventListenerOptions);
    return () => window.removeEventListener('wheel', handler, { passive: false, capture: true } as EventListenerOptions);
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) { e.preventDefault(); closeMenu('esc'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closeMenu]);

  // Overlay is fixed inset-0, so any click outside the radial sectors
  // hits the overlay's own onClick handler — no separate listener needed.

  useEffect(() => {
    if (animPhase === 'out') {
      const fromPage = page;
      const dir = wheelDirRef.current;
      const t = setTimeout(() => {
        setPage((p) => {
          const len = totalPages || 1;
          const newPage = (p + dir + len) % len;
          track('radial_menu_page_switch', { from_page: fromPage, to_page: newPage, direction: dir > 0 ? 'next' : 'prev' });
          return newPage;
        });
        setAnimPhase('switch');
      }, 220);
      return () => clearTimeout(t);
    }
    if (animPhase === 'switch') {
      const t = setTimeout(() => setAnimPhase('in'), 40);
      return () => clearTimeout(t);
    }
    if (animPhase === 'in') {
      const t = setTimeout(() => setAnimPhase('idle'), 300);
      return () => clearTimeout(t);
    }
  }, [animPhase, totalPages, page]);

  const sectorAngle = 360 / sectors;
  const centerAngleOf = (slot: number) => slot * sectorAngle - 90;

  const slotAt = useCallback((clientX: number, clientY: number): number | null => {
    const dx = clientX - cursorPos.x;
    const dy = clientY - cursorPos.y;
    const dist = Math.hypot(dx, dy);
    if (dist < INNER_R || dist > OUTER_R) return null;
    const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    let rel = deg - (-90 - sectorAngle / 2);
    rel = ((rel % 360) + 360) % 360;
    return Math.floor(rel / sectorAngle) % sectors;
  }, [cursorPos, sectorAngle, sectors]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setActiveSlot(slotAt(e.clientX, e.clientY));
  }, [slotAt]);

  const onClick = useCallback(() => {
    if (activeSlot === null) { closeMenu('click_outside'); return; }
    const item = itemBySlot.get(activeSlot);
    if (item) {
      track('radial_menu_launch', {
        slot_index: activeSlot, item_name: item.name,
        item_type: item.type, target_id: item.targetId, page_index: page,
      });
    }
    closeMenu('slot_click');
  }, [activeSlot, itemBySlot, closeMenu, page]);

  if (!open) return null;

  const { x: cx, y: cy } = cursorPos;
  const isAnimating = animPhase !== 'idle';
  const animRotate = animPhase === 'out' ? wheelDirRef.current * sectorAngle : animPhase === 'switch' ? -wheelDirRef.current * sectorAngle : 0;
  const animOpacity = animPhase === 'out' || animPhase === 'switch' ? 0.12 : 1;
  const animScale = animPhase === 'out' || animPhase === 'switch' ? 0.9 : 1;
  const pageLabel = totalPages > 1 ? (page === 0 ? strings.pageOne : strings.pageTwo) : strings.escHint;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100]"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onMouseMove={onMouseMove}
      onClick={onClick}
    >
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: mounted ? `rotate(${animRotate}deg) scale(${animScale})` : `rotate(${animRotate}deg) scale(0.82)`,
            opacity: mounted ? animOpacity : 0,
            transition: isAnimating
              ? 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease-in-out'
              : 'transform 160ms cubic-bezier(0.22, 1, 0.36, 1), opacity 140ms ease-out',
          }}
        >
          {Array.from({ length: sectors }).map((_, slot) => {
            const center = centerAngleOf(slot);
            const start = center - sectorAngle / 2;
            const end = center + sectorAngle / 2;
            const isActive = activeSlot === slot;
            const item = itemBySlot.get(slot);
            const labelR = isActive ? LABEL_R + 6 : LABEL_R;
            const labelPos = polar(cx, cy, labelR, center);
            return (
              <g key={slot}>
                <path
                  d={sectorPath(cx, cy, start, end, isActive ? ACTIVE_OUTER_R : OUTER_R)}
                  fill={styleTokens.sectorFill(isActive, item?.color)}
                  stroke={styleTokens.sectorStroke(isActive)}
                  strokeWidth={styleTokens.sectorStrokeWidth(isActive)}
                  style={{ transition: 'fill 90ms ease-out' }}
                />
                {item ? (
                  <g style={{ opacity: 1 }}>
                    <circle cx={labelPos.x} cy={labelPos.y - 6} r={isActive ? 19 : 16} fill={(item.color || '#8b5cf6') + '40'} style={{ pointerEvents: 'none' }} />
                    <text x={labelPos.x} y={labelPos.y + 18} textAnchor="middle" dominantBaseline="central" fontSize={isActive ? 12 : 11} fontWeight={isActive ? 600 : 400} fill={styleTokens.textFill(isActive)} style={{ pointerEvents: 'none' }}>
                      {item.name.length > 7 ? item.name.slice(0, 6) + '…' : item.name}
                    </text>
                  </g>
                ) : (
                  <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="central" fontSize={20} fill={styleTokens.emptyMarkFill} style={{ pointerEvents: 'none' }}>+</text>
                )}
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={INNER_R - 2} fill={styleTokens.centerFill} stroke={styleTokens.centerStroke} strokeWidth={1} />
          {(() => {
            const activeItem = activeSlot !== null ? itemBySlot.get(activeSlot) : undefined;
            if (activeItem) {
              const len = activeItem.name.length;
              const fontSize = len <= 10 ? 11 : len <= 20 ? 10 : 9;
              return (
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={fontSize} fontWeight={600} fill="#fff" style={{ pointerEvents: 'none' }}>
                  {activeItem.name.length > 12 ? activeItem.name.slice(0, 10) + '…' : activeItem.name}
                </text>
              );
            }
            return (
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={11} fill="rgba(148,163,184,0.7)" style={{ pointerEvents: 'none' }}>{pageLabel}</text>
            );
          })()}
        </g>
      </svg>
    </div>
  );
}

// ── RadialMenuSection (promotional section with preview) ────────────────────

const PREVIEW_SIZE = 280;
const PREVIEW_INNER = 50;
const PREVIEW_OUTER = 120;
const PREVIEW_LABEL_R = (PREVIEW_INNER + PREVIEW_OUTER) / 2;

function polarP(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  const cx = PREVIEW_SIZE / 2;
  const cy = PREVIEW_SIZE / 2;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function sectorPathP(startDeg: number, endDeg: number, outerR = PREVIEW_OUTER) {
  const oStart = polarP(outerR, startDeg);
  const oEnd = polarP(outerR, endDeg);
  const iEnd = polarP(PREVIEW_INNER, endDeg);
  const iStart = polarP(PREVIEW_INNER, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y}`,
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${PREVIEW_INNER} ${PREVIEW_INNER} 0 ${largeArc} 0 ${iStart.x} ${iStart.y}`,
    'Z',
  ].join(' ');
}

interface PreviewItem {
  slot: number;
  name: string;
  color: string;
  type: 'software' | 'workflow';
}

export default function RadialMenuSection({
  software,
  workflows,
  strings,
}: {
  software: Software[];
  workflows: Workflow[];
  strings: RadialMenuSectionStrings;
}) {
  const [demoOpen, setDemoOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState<0 | 1>(0);
  const [animPhase, setAnimPhase] = useState<'idle' | 'out' | 'switch' | 'in'>('idle');
  const wheelDirRef = useRef(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const wheelAccumRef = useRef(0);
  const wheelCooldownRef = useRef(false);
  const wheelIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectors = 6;

  const previewItems = useMemo(() => {
    const favoriteSoftware = software.filter((s) => s.launchCount > 100).sort((a, b) => b.launchCount - a.launchCount);
    const favoriteWorkflows = workflows.filter((w) => w.isFavorite);

    const page0: PreviewItem[] = [];
    favoriteSoftware.slice(0, 6).forEach((app, idx) => {
      page0.push({ slot: idx, name: app.name, color: app.color, type: 'software' });
    });
    if (page0.length < 6) {
      favoriteWorkflows.slice(0, 6 - page0.length).forEach((wf, idx) => {
        page0.push({ slot: page0.length + idx, name: wf.name, color: wf.color, type: 'workflow' });
      });
    }

    const page1: PreviewItem[] = [];
    const moreSoftware = favoriteSoftware.slice(6);
    const moreWorkflows = favoriteWorkflows.slice(Math.max(0, 6 - favoriteSoftware.length));
    moreSoftware.slice(0, 6).forEach((app, idx) => {
      page1.push({ slot: idx, name: app.name, color: app.color, type: 'software' });
    });
    if (page1.length < 6) {
      moreWorkflows.slice(0, 6 - page1.length).forEach((wf, idx) => {
        page1.push({ slot: page1.length + idx, name: wf.name, color: wf.color, type: 'workflow' });
      });
    }
    return [page0, page1];
  }, [software, workflows]);

  const itemBySlot = useMemo(() => {
    const items = previewItems[previewPage] ?? [];
    const map = new Map<number, PreviewItem>();
    items.forEach((it) => map.set(it.slot, it));
    return map;
  }, [previewItems, previewPage]);

  const totalPages = previewItems.filter((p) => p.length > 0).length;
  const sectorAngle = 360 / sectors;
  const cx = PREVIEW_SIZE / 2;
  const cy = PREVIEW_SIZE / 2;

  const previewStyle = {
    sectorFill: (_isActive: boolean, itemColor?: string) =>
      itemColor ? itemColor + '25' : 'rgba(21,21,28,0.82)',
    sectorStroke: () => 'rgba(148,163,184,0.25)',
    sectorStrokeWidth: () => 1.5,
    centerFill: 'rgba(21,21,28,0.55)',
    centerStroke: 'rgba(148,163,184,0.2)',
    textFill: () => '#cbd5e1',
    emptyMarkFill: 'rgba(148,163,184,0.4)',
  };

  useEffect(() => {
    if (animPhase === 'out') {
      const t = setTimeout(() => {
        setPreviewPage((p) => {
          const len = Math.max(1, totalPages);
          return ((p + wheelDirRef.current) % len + len) % len as 0 | 1;
        });
        setAnimPhase('switch');
      }, 220);
      return () => clearTimeout(t);
    }
    if (animPhase === 'switch') {
      const t = setTimeout(() => setAnimPhase('in'), 40);
      return () => clearTimeout(t);
    }
    if (animPhase === 'in') {
      const t = setTimeout(() => setAnimPhase('idle'), 300);
      return () => clearTimeout(t);
    }
  }, [animPhase, totalPages]);

  const animPhaseRef = useRef(animPhase);
  animPhaseRef.current = animPhase;
  const totalPagesRef = useRef(totalPages);
  totalPagesRef.current = totalPages;

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (totalPagesRef.current <= 1) return;
      const touchpad = isTouchpadWheel(e);
      if (!touchpad) {
        if (animPhaseRef.current !== 'idle') return;
        wheelDirRef.current = e.deltaY > 0 ? 1 : -1;
        wheelAccumRef.current = 0;
        setAnimPhase('out');
        return;
      }
      if (wheelCooldownRef.current) return;
      wheelAccumRef.current += e.deltaY;
      if (wheelIdleTimerRef.current) { clearTimeout(wheelIdleTimerRef.current); wheelIdleTimerRef.current = null; }
      if (Math.abs(wheelAccumRef.current) >= 60) {
        wheelDirRef.current = wheelAccumRef.current > 0 ? 1 : -1;
        wheelAccumRef.current = 0;
        wheelCooldownRef.current = true;
        if (wheelCooldownTimerRef.current) clearTimeout(wheelCooldownTimerRef.current);
        wheelCooldownTimerRef.current = setTimeout(() => { wheelCooldownRef.current = false; wheelAccumRef.current = 0; }, 800);
        setAnimPhase('out');
        return;
      }
      wheelIdleTimerRef.current = setTimeout(() => { wheelAccumRef.current = 0; }, 150);
    };
    el.addEventListener('wheel', handler, { passive: false } as AddEventListenerOptions);
    return () => el.removeEventListener('wheel', handler, { passive: false } as EventListenerOptions);
  }, []);

  const isAnimating = animPhase !== 'idle';
  const animRotate = animPhase === 'out' ? wheelDirRef.current * sectorAngle : animPhase === 'switch' ? -wheelDirRef.current * sectorAngle : 0;
  const animOpacity = animPhase === 'out' || animPhase === 'switch' ? 0.12 : 1;
  const animScale = animPhase === 'out' || animPhase === 'switch' ? 0.9 : 1;

  const featureVisuals = [
    { icon: 'M11 4a7 7 0 1 0 14 0 7 7 0 0 0-14 0', color: '#ec4899' },
    { icon: 'M12 6v6l4 2', color: '#f59e0b' },
    { icon: 'M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z', color: '#7c3aed' },
    { icon: 'M3 7h18M3 12h18M3 17h18', color: '#00d4aa' },
  ];
  const features = featureVisuals.map((visual, idx) => ({
    ...visual,
    title: strings.features[idx]?.title ?? '',
    desc: strings.features[idx]?.desc ?? '',
  }));

  return (
    <section id="radial-menu" className="px-4 py-24 sm:px-6" data-analytics-section="radial_menu">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
            {strings.badge}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {strings.title}
          </h2>
          <p className="mt-4 leading-relaxed text-gray-400">
            {strings.subtitle}
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: feature list */}
          <div className="space-y-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 rounded-xl border border-slate-800/60 bg-slate-900/40 p-5 transition-all hover:border-slate-700/80"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: f.color + '20', color: f.color }}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-100">{f.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                track('radial_demo_try_click');
                setDemoOpen(true);
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-medium text-white shadow-[0_0_20px_-5px_rgba(0,212,170,0.5)] transition-all hover:bg-brand-dark"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
              {strings.tryButton}
            </button>
            <p className="text-center text-xs text-slate-600">
              {strings.tryHint}
            </p>
          </div>

          {/* Right: SVG preview */}
          <div
            ref={previewRef}
            className="relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40"
          >
            {/* Page tabs */}
            <div
              className="mb-4 flex items-center gap-1 rounded-lg p-1"
              style={{ backgroundColor: 'rgba(30,41,59,0.6)' }}
            >
              <button
                onClick={() => {
                  if (animPhase === 'idle' && previewPage !== 0) {
                    track('radial_preview_page_switch', { from: previewPage, to: 0 });
                    wheelDirRef.current = -1;
                    setAnimPhase('out');
                  }
                }}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  previewPage === 0 ? 'bg-brand/20 text-brand' : 'text-slate-400 hover:text-slate-300'
                )}
              >
                {strings.pageOne}
              </button>
              <button
                onClick={() => {
                  if (animPhase === 'idle' && previewPage !== 1 && totalPages > 1) {
                    track('radial_preview_page_switch', { from: previewPage, to: 1 });
                    wheelDirRef.current = 1;
                    setAnimPhase('out');
                  }
                }}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  previewPage === 1 ? 'bg-brand/20 text-brand' : 'text-slate-400 hover:text-slate-300'
                )}
              >
                {strings.pageTwo}
              </button>
            </div>

            {/* SVG preview ring */}
            <svg width={PREVIEW_SIZE} height={PREVIEW_SIZE} className="overflow-visible">
              <g
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: `rotate(${animRotate}deg) scale(${animScale})`,
                  opacity: animOpacity,
                  transition: isAnimating
                    ? 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease-in-out'
                    : 'transform 160ms cubic-bezier(0.22, 1, 0.36, 1), opacity 140ms ease-out',
                }}
              >
                {Array.from({ length: sectors }).map((_, slot) => {
                  const center = slot * sectorAngle - 90;
                  const start = center - sectorAngle / 2;
                  const end = center + sectorAngle / 2;
                  const item = itemBySlot.get(slot);
                  const labelPos = polarP(PREVIEW_LABEL_R, center);
                  return (
                    <g key={slot}>
                      <path
                        d={sectorPathP(start, end)}
                        fill={previewStyle.sectorFill(false, item?.color)}
                        stroke={previewStyle.sectorStroke()}
                        strokeWidth={previewStyle.sectorStrokeWidth()}
                      />
                      {item ? (
                        <g>
                          <circle cx={labelPos.x} cy={labelPos.y - 6} r={14} fill={(item.color || '#8b5cf6') + '40'} />
                          <text
                            x={labelPos.x} y={labelPos.y + 14}
                            textAnchor="middle" dominantBaseline="central"
                            fontSize={10} fill={previewStyle.textFill()}
                            style={{ pointerEvents: 'none' }}
                          >
                            {item.name.length > 6 ? item.name.slice(0, 5) + '…' : item.name}
                          </text>
                        </g>
                      ) : (
                        <text
                          x={labelPos.x} y={labelPos.y}
                          textAnchor="middle" dominantBaseline="central"
                          fontSize={18} fill={previewStyle.emptyMarkFill}
                        >+</text>
                      )}
                    </g>
                  );
                })}
                <circle cx={cx} cy={cy} r={PREVIEW_INNER - 2} fill={previewStyle.centerFill} stroke={previewStyle.centerStroke} strokeWidth={1} />
                <text
                  x={cx} y={cy}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={11} fontWeight={600}
                  fill="rgba(148,163,184,0.7)"
                >
                  {previewPage === 0 ? strings.pageOne : strings.pageTwo}
                </text>
              </g>
            </svg>

            <p className="mt-4 text-xs text-slate-500">{strings.scrollHint}</p>
          </div>
        </div>
      </div>

      {/* Interactive demo overlay */}
      {demoOpen && (
        <RadialMenuOverlay
          software={software}
          workflows={workflows}
          strings={strings}
          open={demoOpen}
          onOpenChange={setDemoOpen}
        />
      )}
    </section>
  );
}
