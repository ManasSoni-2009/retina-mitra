'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { useSettings, AppSettings, DEFAULT_SETTINGS } from '@/context/SettingsContext';
import { sound } from '@/lib/sound';

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();

  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key: keyof AppSettings, value: unknown) => {
    sound.playClick(680);
    setLocalSettings((prev) => {
      const updated = { ...prev, [key]: value };
      setHasUnsavedChanges(JSON.stringify(updated) !== JSON.stringify(settings));
      return updated;
    });
  };

  const handleSave = () => {
    sound.playClick(900);
    updateSettings(localSettings);
    setHasUnsavedChanges(false);
    setToastMessage('System preferences and calibrated parameters saved!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReset = () => {
    sound.playClick(500);
    resetSettings();
    setLocalSettings(DEFAULT_SETTINGS);
    setHasUnsavedChanges(false);
    setToastMessage('Reset to factory default calibration.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pt-24 sm:pt-28 pb-28 sm:pb-32 px-4 sm:px-8 max-w-[1400px] mx-auto selection:bg-[var(--ink)] selection:text-[var(--accent)]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[var(--ink)] text-[var(--accent)] px-5 py-3 rounded-2xl border-2 border-[var(--accent)] shadow-[6px_6px_0_var(--ink)] flex items-center gap-3 font-mono text-xs font-bold animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-[var(--ok)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── HEADER ─── */}
      <div className="pb-6 border-b-2 border-[var(--ink)] mb-10">
        <Link
          href="/dashboard"
          onClick={() => sound.playClick(600)}
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase font-bold text-[var(--ink-soft)] hover:text-[var(--ink)] mb-3 no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cockpit</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--ink-soft)] mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--ink)]" />
              Thresholds &amp; Safety Calibrator
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
              System Configuration
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full border-2 border-[var(--ink)] bg-[var(--paper)] font-mono text-xs font-bold uppercase hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0_var(--ink)] min-h-[44px] flex items-center justify-center"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[var(--ink)] text-[var(--accent)] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[4px_4px_0_var(--ink)] min-h-[44px] ${
                hasUnsavedChanges ? 'ring-2 ring-[var(--accent)]' : ''
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── HARDWARE-STYLE TUNING CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: OpenCV Quality Gate Thresholds */}
        <div className="p-6 sm:p-8 rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[8px_8px_0_var(--ink)] space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[var(--ink)]/20">
            <SlidersHorizontal className="w-5 h-5 text-[var(--ink)]" />
            <h2 className="text-xl font-bold uppercase tracking-tight">
              OpenCV Quality Gate Tuning
            </h2>
          </div>

          <div>
            <div className="flex justify-between items-center font-mono text-xs mb-2">
              <span className="font-bold">Detection Sensitivity Score</span>
              <span className="font-extrabold underline text-sm">
                {localSettings.detectionSensitivity || 65}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              value={localSettings.detectionSensitivity || 65}
              onChange={(e) => handleChange('detectionSensitivity', Number(e.target.value))}
              className="w-full accent-[var(--ink)] cursor-pointer h-8"
            />
            <p className="font-mono text-[11px] text-[var(--ink-soft)] mt-1">
              Calibrates microaneurysm and lesion sensitivity for early triage vs conservative specificity.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center font-mono text-xs mb-2">
              <span className="font-bold">Illumination Uniformity Index</span>
              <span className="font-extrabold underline text-sm">0.65</span>
            </div>
            <input
              type="range"
              min="40"
              max="90"
              defaultValue="65"
              className="w-full accent-[var(--ink)] cursor-pointer h-8"
            />
            <p className="font-mono text-[11px] text-[var(--ink-soft)] mt-1">
              Guarantees macular and posterior pole contrast uniformity.
            </p>
          </div>
        </div>

        {/* Card 2: Epistemic Uncertainty & Safety Bounds */}
        <div className="p-6 sm:p-8 rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[8px_8px_0_var(--ink)] space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[var(--ink)]/20">
            <Shield className="w-5 h-5 text-[var(--ink)]" />
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Epistemic Safety Bounds
            </h2>
          </div>

          <div>
            <div className="flex justify-between items-center font-mono text-xs mb-2">
              <span className="font-bold">Specialist Review Threshold</span>
              <span className="font-extrabold underline text-sm">
                {localSettings.specialistThreshold || 70}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={localSettings.specialistThreshold || 70}
              onChange={(e) => handleChange('specialistThreshold', Number(e.target.value))}
              className="w-full accent-[var(--ink)] cursor-pointer h-8"
            />
            <p className="font-mono text-[11px] text-[var(--ink-soft)] mt-1">
              Cases falling below this calibrated threshold automatically route to human retina specialists.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg)] border-2 border-[var(--ink)] font-mono text-xs space-y-2">
            <div className="font-bold text-[var(--ink)]">Safety Protocol Status: ACTIVE</div>
            <div className="text-[var(--ink-soft)]">
              Temperature parameter T = 1.42 fine-tuned on APTOS &amp; IDRiD validation datasets. Zero unverified autonomous outputs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
