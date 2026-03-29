"use client";

import { useEffect, useRef, useCallback } from "react";

const JAUM = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ";
const MOUM = "ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ";
const ALL_JAMO = JAUM + MOUM;

const CELL_SIZE = 30;          // 촘촘한 배치
const WAVE_DURATION = 1200;    // ms — 파동 지속 시간
const WAVE_INTERVAL = 2400;    // ms — 파동 발생 간격
const WAVE_SPEED = 0.9;        // 파동 퍼지는 속도 (px/ms 스케일)
const BASE_ALPHA = 0.12;       // 정적 상태 기본 투명도
const PEAK_ALPHA = 0.55;       // 파동 피크 투명도

interface Cell {
  x: number;
  y: number;
  distFromCenter: number; // 중심으로부터 거리
  distNorm: number;       // 정규화 거리 (0~1)
  char: string;
}

export function MosaicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Cell[]>([]);
  const dimRef = useRef({ w: 0, h: 0 });
  const animRef = useRef(0);
  const waveStartRef = useRef<number | null>(null); // 현재 파동 시작 시각
  const fontSizeRef = useRef(0);

  // 셀 생성 — 마운트·리사이즈 시에만 실행
  const buildCells = useCallback((w: number, h: number): Cell[] => {
    const cx = w / 2;
    const cy = h / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);
    const cells: Cell[] = [];

    for (let row = 0; row * CELL_SIZE < h + CELL_SIZE; row++) {
      for (let col = 0; col * CELL_SIZE < w + CELL_SIZE; col++) {
        const x = col * CELL_SIZE + CELL_SIZE / 2;
        const y = row * CELL_SIZE + CELL_SIZE / 2;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        cells.push({
          x, y,
          distFromCenter: dist,
          distNorm: dist / maxDist,
          char: ALL_JAMO[Math.floor(Math.random() * ALL_JAMO.length)],
        });
      }
    }
    return cells;
  }, []);

  // 단일 프레임 그리기
  const draw = useCallback((ctx: CanvasRenderingContext2D, waveProgress: number | null) => {
    const { w, h } = dimRef.current;
    const cells = cellsRef.current;
    if (!cells.length) return;

    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontSizeRef.current}px monospace`;

    for (const cell of cells) {
      let alpha = BASE_ALPHA * (1 - cell.distNorm * 0.5);

      if (waveProgress !== null) {
        // 파동 전면 위치 (중심에서 퍼져나가는 거리)
        const waveFront = waveProgress * (dimRef.current.w * WAVE_SPEED);
        const distToFront = Math.abs(cell.distFromCenter - waveFront);
        const waveWidth = CELL_SIZE * 5; // 파동 폭

        if (distToFront < waveWidth) {
          // 파동이 지나가는 셀: 가우시안 형태로 밝아짐
          const t = 1 - distToFront / waveWidth;
          const boost = t * t * (PEAK_ALPHA - BASE_ALPHA);
          alpha = Math.min(alpha + boost, PEAK_ALPHA);
        }
      }

      // 색상: 파동 강도에 따라 accent 계열로 shift
      const lift = Math.max(0, alpha - BASE_ALPHA) / (PEAK_ALPHA - BASE_ALPHA);
      const r = Math.round(160 + lift * 72); // → 232 (accent orange)
      const g = Math.round(155 - lift * 21); // → 134
      const b = Math.round(160 - lift * 102); // → 58

      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fillText(cell.char, cell.x, cell.y);
    }
  }, []);

  // 파동 애니메이션 루프 — 파동 중에만 rAF 실행
  const runWave = useCallback((ctx: CanvasRenderingContext2D) => {
    const start = performance.now();
    waveStartRef.current = start;

    // 파동 시작 시 글자 랜덤 교체
    cellsRef.current = cellsRef.current.map((cell) => ({
      ...cell,
      char: ALL_JAMO[Math.floor(Math.random() * ALL_JAMO.length)],
    }));

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / WAVE_DURATION, 1);

      draw(ctx, progress);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        // 파동 종료 — 정적 프레임 한 번 그리고 rAF 중단
        draw(ctx, null);
        waveStartRef.current = null;
      }
    };

    animRef.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      dimRef.current = { w: rect.width, h: rect.height };
      fontSizeRef.current = CELL_SIZE * 0.52;
      cellsRef.current = buildCells(rect.width, rect.height);
      draw(ctx, null); // 정적 초기 렌더
    };
    resize();
    window.addEventListener("resize", resize);

    // 주기적으로 파동 발생
    const interval = setInterval(() => {
      cancelAnimationFrame(animRef.current);
      runWave(ctx);
    }, WAVE_INTERVAL);

    // 첫 파동 약간 딜레이 후 시작
    const firstWave = setTimeout(() => runWave(ctx), 800);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(interval);
      clearTimeout(firstWave);
      window.removeEventListener("resize", resize);
    };
  }, [buildCells, draw, runWave]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 h-full w-full"
    />
  );
}
