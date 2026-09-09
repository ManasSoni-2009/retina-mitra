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
  Info
} from 'lucide-react';
import { VisualEvidence, LesionCandidate } from '@/types/screening';

interface CanvasImageViewerProps {
  evidence: VisualEvidence;
  selectedLesionId?: string | null;
  onSelectLesion?: (lesion: LesionCandidate | null) => void;
}

export const CanvasImageViewer: React.FC<CanvasImageViewerProps> = ({
  evidence,
}) => {
  const [activeLayer, setActiveLayer] = useState<'original' | 'enhanced' | 'structures' | 'evidence' | 'attention' | 'combined'>('original');
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const tabs = [
    { id: 'original', label: 'Original', icon: Eye, desc: 'Unprocessed 45° color fundus photograph intake' },
    { id: 'enhanced', label: 'Enhanced', icon: Zap, desc: 'Green-channel CLAHE contrast & illumination enhancement' },
    { id: 'structures', label: 'Retinal Structures', icon: Layers, desc: 'Morphological microvascular tree & caliber segmentation' },
    { id: 'evidence', label: 'Evidence', icon: Target, desc: 'Segmented pathological lesions (microaneurysms, hemorrhages, exudates)' },
    { id: 'attention', label: 'AI Attention', icon: Flame, desc: 'Grad-CAM backward-hook spatial activation heatmap' },
    { id: 'combined', label: 'Combined', icon: Crosshair, desc: 'Multimodal overlay: fundus anatomy + Grad-CAM + lesion contours' },
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

  const activeTabInfo = tabs.find((t) => t.id === activeLayer)!;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1.0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`rounded-3xl overflow-hidden shadow-2xl transition-all border border-slate-200 bg-gradient-to-b from-[#0B1728] via-[#10213E] to-[#0A1420] ${
      isFullscreen ? 'fixed inset-4 z-50 flex flex-col backdrop-blur-3xl ring-2 ring-[#2563EB]' : ''
    }`}>
      
      {/* Top Frosted Toolbar with Gradient Pill Buttons */}
      <div className="bg-gradient-to-r from-[#0B1728]/95 via-[#10213E]/90 to-[#0B1728]/95 px-4 py-3.5 border-b border-[#3C5880]/40 flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl">
        
        {/* The 6 Explicit Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeLayer === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveLayer(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2563EB] via-[#E3D7C1] to-[#C4B498] text-[#0B1728] shadow-lg shadow-[#2563EB]/25 scale-103 font-black'
                    : 'bg-white/10 hover:bg-white/20 text-[#FFFFFF]/80 hover:text-[#FFFFFF] border border-white/10 backdrop-blur-md'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Viewport Zoom & Reset Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-[#0B1728]/80 px-2 py-1 rounded-xl border border-[#3C5880]/50 backdrop-blur-md">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.25, 3.0))}
              title="Zoom In"
              className="p-1 rounded text-[#FFFFFF]/80 hover:text-[#FFFFFF] hover:bg-white/15 transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-[#2563EB] font-black">{(zoom * 100).toFixed(0)}%</span>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.25, 1.0))}
              title="Zoom Out"
              className="p-1 rounded text-[#FFFFFF]/80 hover:text-[#FFFFFF] hover:bg-white/15 transition"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              title="Reset Zoom & Pan"
              className="p-1 rounded text-[#FFFFFF]/60 hover:text-[#FFFFFF] hover:bg-white/15 transition ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Viewer'}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFFFFF] border border-white/20 transition backdrop-blur-md"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#2563EB]" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Retinal Viewport Stage */}
      <div
        className={`relative overflow-hidden bg-gradient-to-b from-[#081018] to-[#0B1728] flex items-center justify-center p-3 select-none ${
          isFullscreen ? 'flex-1' : 'aspect-square max-h-[540px]'
        } ${zoom > 1.0 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative transition-transform duration-75 ease-out max-w-full max-h-full flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <img
            key={activeLayer}
            src={getActiveImageSrc()}
            alt={activeTabInfo.label}
            className="w-full h-auto object-contain rounded-2xl max-h-[500px] shadow-2xl transition-opacity duration-200"
          />
        </div>
      </div>

      {/* Bottom Information Subtitle Bar with Frosted Fill */}
      <div className="bg-gradient-to-r from-[#10213E]/95 via-[#0B1728]/90 to-[#10213E]/95 px-4 py-2.5 border-t border-[#3C5880]/40 flex items-center justify-between text-xs text-[#FFFFFF]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 truncate">
          <Info className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
          <span className="font-black text-[#FFFFFF]">{activeTabInfo.label}:</span>
          <span className="truncate font-medium">{activeTabInfo.desc}</span>
        </div>
        <span className="hidden sm:inline-block font-mono text-[10px] text-[#2563EB] uppercase tracking-wider font-bold">
          Resolution: 1024×1024 • 45° Field
        </span>
      </div>

    </div>
  );
};
