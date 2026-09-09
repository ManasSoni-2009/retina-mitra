'use client';

import React, { useState } from 'react';
import { Layers, Eye, Zap, Flame, Target, Sliders } from 'lucide-react';
import { VisualEvidence } from '@/types/screening';

interface ImageXaiViewerShellProps {
  evidence: VisualEvidence;
  qualityStatus: 'GRADABLE' | 'UNGRADABLE' | 'BORDERLINE';
}

export const ImageXaiViewerShell: React.FC<ImageXaiViewerShellProps> = ({ evidence, qualityStatus }) => {
  const [activeLayer, setActiveLayer] = useState<'raw' | 'enhanced' | 'vessels' | 'gradcam' | 'lesions'>('raw');
  const [opacity, setOpacity] = useState<number>(0.75);

  const layers = [
    { id: 'raw', label: 'Raw Fundus', icon: Eye },
    { id: 'enhanced', label: 'CLAHE Enhanced', icon: Zap },
    { id: 'vessels', label: 'Vessel Structure', icon: Layers },
    { id: 'gradcam', label: 'Grad-CAM Attention', icon: Flame },
    { id: 'lesions', label: 'Lesion Candidate Mask', icon: Target },
  ];

  return (
    <div className="bg-[#0B1728] border border-[#3C5880]/50 rounded-2xl overflow-hidden shadow-xl">
      {/* Toolbar */}
      <div className="bg-[#10213E] px-4 py-3 border-b border-[#3C5880]/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-[#F4F7FB]">Explainable AI Visual Layers:</span>
        </div>

        {/* Layer Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#384994] text-[#0B1728] shadow-sm'
                    : 'bg-[#0B1728] text-[#F4F7FB]/70 hover:bg-[#22304A] hover:text-[#F4F7FB] border border-[#3C5880]/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>

        {/* Opacity Slider for Overlay Layers */}
        {(activeLayer === 'gradcam' || activeLayer === 'lesions') && (
          <div className="flex items-center space-x-2 bg-[#0B1728] px-2.5 py-1 rounded-xl border border-[#3C5880]/50">
            <Sliders className="w-3.5 h-3.5 text-[#384994]" />
            <span className="text-[11px] text-[#F4F7FB]/70">Overlay Opacity:</span>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-20 accent-[#384994] cursor-pointer"
            />
            <span className="text-[11px] text-[#384994] font-mono font-bold">{(opacity * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* Main Image Stage */}
      <div className="relative aspect-square max-h-[500px] mx-auto bg-[#0B1728] flex items-center justify-center p-4">
        <img
          src={evidence.rawImageUrl}
          alt="Retinal Fundus Scan"
          className="w-full h-full object-contain rounded-xl"
        />

        {activeLayer === 'enhanced' && (
          <div className="absolute inset-0 m-4 flex items-center justify-center bg-[#059669]/20 mix-blend-color-dodge rounded-xl pointer-events-none">
            <span className="absolute top-6 left-6 px-2.5 py-1 bg-[#10213E] text-[#384994] border border-[#3C5880] text-xs rounded-lg font-mono font-bold">
              CLAHE Filter Applied (Green Channel Iso)
            </span>
          </div>
        )}

        {activeLayer === 'vessels' && (
          <div className="absolute inset-0 m-4 flex items-center justify-center border-2 border-dashed border-[#059669] rounded-xl pointer-events-none">
            <span className="absolute top-6 left-6 px-2.5 py-1 bg-[#10213E] text-[#059669] border border-[#3C5880] text-xs rounded-lg font-mono font-bold">
              Frangi Vesselness Tree Extracted
            </span>
          </div>
        )}

        {activeLayer === 'gradcam' && (
          <div
            className="absolute inset-0 m-4 rounded-xl bg-gradient-radial from-[#384994]/70 via-[#059669]/40 to-transparent pointer-events-none transition-opacity"
            style={{ opacity }}
          >
            <span className="absolute top-6 left-6 px-2.5 py-1 bg-[#10213E] text-[#384994] border border-[#3C5880] text-xs rounded-lg font-mono font-bold">
              Grad-CAM Attention Heatmap Layer
            </span>
          </div>
        )}

        {activeLayer === 'lesions' && (
          <div className="absolute inset-0 m-4 rounded-xl pointer-events-none" style={{ opacity }}>
            <span className="absolute top-6 left-6 px-2.5 py-1 bg-[#10213E] text-[#384994] border border-[#3C5880] text-xs rounded-lg font-mono font-bold">
              Structural Lesion Candidates ({(evidence.detectedLesions || []).length} Detected)
            </span>
            {(evidence.detectedLesions || []).map((lesion) => (
              <div
                key={lesion.id}
                className="absolute border-2 border-[#384994] bg-[#384994]/20 rounded animate-pulse"
                style={{
                  left: `${(lesion.bbox[0] / 600) * 100}%`,
                  top: `${(lesion.bbox[1] / 600) * 100}%`,
                  width: `${(lesion.bbox[2] / 600) * 100}%`,
                  height: `${(lesion.bbox[3] / 600) * 100}%`,
                }}
              >
                <span className="absolute -top-5 left-0 px-1 bg-[#10213E] text-[#384994] text-[10px] font-mono whitespace-nowrap rounded font-bold">
                  {lesion.type} ({(lesion.confidence * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Structural Indicators Footer */}
      <div className="bg-[#10213E] px-4 py-2.5 border-t border-[#3C5880]/40 flex items-center justify-between text-xs text-[#F4F7FB]/70">
        <div className="flex items-center space-x-4">
          <span className="font-medium">Optic Disc: {evidence.opticDiscLocated ? '✓ Located' : '✗ Unresolved'}</span>
          <span className="font-medium">Fovea/Macula: {evidence.foveaLocated ? '✓ Located' : '✗ Unresolved'}</span>
        </div>
        <span className="font-mono text-[#384994] font-bold">Scale: 45° Field of View</span>
      </div>
    </div>
  );
};
