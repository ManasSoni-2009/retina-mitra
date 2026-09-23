'use client';

import React, { useState } from 'react';
import {
  Eye,
  Zap,
  Layers,
  Flame,
  Target,
  Crosshair,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Info,
} from 'lucide-react';
import { VisualEvidence, LesionCandidate } from '@/types/screening';
import { sound } from '@/lib/sound';

interface CanvasImageViewerProps {
  evidence: VisualEvidence;
  selectedLesionId?: string | null;
  onSelectLesion?: (lesion: LesionCandidate | null) => void;
}

export const CanvasImageViewer: React.FC<CanvasImageViewerProps> = ({
  evidence,
}) => {
  const [activeLayer, setActiveLayer] = useState<
    'original' | 'enhanced' | 'structures' | 'evidence' | 'attention' | 'combined'
  >('original');
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const tabs = [
    { id: 'original', label: 'Original', icon: Eye, desc: 'Unprocessed 45° posterior pole fundus intake' },
    { id: 'enhanced', label: 'Enhanced CLAHE', icon: Zap, desc: 'Green-channel CLAHE contrast & illumination correction' },
    { id: 'structures', label: 'Vessel Caliber', icon: Layers, desc: 'Frangi vesselness tree & caliber segmentation' },
    { id: 'evidence', label: 'Lesion Mask', icon: Target, desc: 'Segmented microaneurysms, hemorrhages, and exudates' },
    { id: 'attention', label: 'Grad-CAM Attention', icon: Flame, desc: 'Backward-hook spatial activation gradient map' },
    { id: 'combined', label: 'Multimodal Combined', icon: Crosshair, desc: 'Overlay: fundus anatomy + Grad-CAM + lesion contours' },
  ] as const;

  const getActiveImageSrc = () => {
    switch (activeLayer) {
      case 'enhanced':
        return evidence.enhancedImageUrl || evidence.rawImageUrl;
      case 'structures':
        return evidence.vesselMapUrl || evidence.rawImageUrl;
      case 'evidence':
        return evidence.lesionOverlayUrl || evidence.rawImageUrl;
      case 'attention':
        return evidence.gradcamUrl || evidence.rawImageUrl;
      case 'combined':
        return evidence.combinedEvidenceUrl || evidence.rawImageUrl;
      case 'original':
      default:
        return evidence.rawImageUrl;
    }
  };

  const handleZoomIn = () => {
    sound.playClick(850);
    setZoom((prev) => Math.min(prev + 0.3, 3.5));
  };

  const handleZoomOut = () => {
    sound.playClick(650);
    setZoom((prev) => Math.max(prev - 0.3, 0.7));
  };

  const handleResetZoom = () => {
    sound.playClick(500);
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1.0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1.0) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Mobile Touch Pan Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1.0 && e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoom > 1.0 && e.touches.length === 1) {
      const touch = e.touches[0];
      setPan({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  const activeTabMeta = tabs.find((t) => t.id === activeLayer);

  return (
    <div
      className={`rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--ink)] text-white overflow-hidden shadow-[8px_8px_0_var(--ink)] transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl' : 'relative w-full'
      }`}
    >
      {/* ─── LAYER SELECTOR RIBBON (SWIPABLE ON MOBILE) ─── */}
      <div className="border-b border-white/20 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto no-scrollbar w-full sm:w-auto py-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeLayer === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playClick(720);
                  setActiveLayer(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--ink)] font-bold shadow-md'
                    : 'text-[#CFCFC4] hover:text-white hover:bg-white/10'
                }`}
                data-cursor-label="LAYER"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Zoom & Pan Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <div className="flex items-center border border-white/20 rounded-full bg-white/5 p-1 gap-1">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 rounded-full hover:bg-white/10 text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] w-10 text-center font-bold text-[var(--accent)]">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 rounded-full hover:bg-white/10 text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 rounded-full hover:bg-white/10 text-white"
              title="Reset view"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsFullscreen(!isFullscreen);
            }}
            className="p-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ─── ACTIVE LAYER SUBTITLE BANNER ─── */}
      <div className="px-6 py-2 bg-[var(--accent)]/10 border-b border-white/10 flex items-center justify-between text-xs font-mono text-[#CFCFC4]">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>{activeTabMeta?.desc}</span>
        </div>
        <span className="text-[var(--accent)] uppercase font-bold">Standard 45° Posterior Pole</span>
      </div>

      {/* ─── CANVAS DISPLAY PORT ─── */}
      <div
        className="relative w-full h-[320px] sm:h-[500px] lg:h-[580px] bg-[#07090D] flex items-center justify-center overflow-hidden cursor-crosshair select-none touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Retinal Image Frame */}
        <div
          className="relative max-w-full max-h-full transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'crosshair',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getActiveImageSrc()}
            alt={activeTabMeta?.label || 'Retinal scan'}
            className="max-h-[300px] sm:max-h-[480px] lg:max-h-[550px] w-auto object-contain rounded-2xl border border-white/10 shadow-2xl"
          />
        </div>

        {/* Optical HUD Crosshair Overlays */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25">
          <div className="w-72 h-72 rounded-full border border-dashed border-[var(--accent)]" />
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent" />
        </div>

        {/* Telemetry Corner Badges (Hidden on mobile to keep retinal view clear) */}
        <div className="hidden sm:block absolute bottom-4 left-4 font-mono text-[10px] text-[#8F8F80] bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
          DIMENSIONS: 2240 × 1488 · LATENCY: 18ms · COORD: 45° MACULAR POLE
        </div>
      </div>
    </div>
  );
};
