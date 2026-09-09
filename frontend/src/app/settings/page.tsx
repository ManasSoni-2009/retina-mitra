'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Monitor,
  SlidersHorizontal,
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useSettings, AppSettings, DEFAULT_SETTINGS } from '@/context/SettingsContext';

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();

  // Local draft state: Changes only apply globally when the user clicks 'Save Changes'
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Sync draft state when persistent settings are loaded or updated
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Handle local change in draft state ONLY (do not dispatch globally until Save Changes is clicked)
  const handleChange = (key: keyof AppSettings, value: any) => {
    setLocalSettings((prev) => {
      const updated = { ...prev, [key]: value };
      setHasUnsavedChanges(JSON.stringify(updated) !== JSON.stringify(settings));
      return updated;
    });
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setHasUnsavedChanges(false);
    setToastMessage('System preferences and parameters saved successfully!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings(DEFAULT_SETTINGS);
    setHasUnsavedChanges(false);
    setToastMessage('All settings reset to factory defaults.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getSensitivityLabel = (val: number) => {
    if (val < 40) return 'High Specificity (Conservative)';
    if (val <= 75) return 'Balanced (Recommended)';
    return 'High Sensitivity (Early Triage)';
  };

  return (
    <div className="min-h-full mesh-bg text-[#0F172A] dark:text-slate-100 p-6 sm:p-8 lg:p-10 space-y-8 transition-colors">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0B1728] text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1728] dark:text-white tracking-tight">
              System Preferences & Configuration
            </h1>
            {hasUnsavedChanges && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-black bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700 animate-pulse">
                <AlertCircle className="w-3 h-3" />
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage system theme, clinical parameters, and report export settings. Click &quot;Save Changes&quot; to apply.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="btn-oxford-secondary text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Reset all settings to factory default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className={`btn-sand-primary text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all ${
              hasUnsavedChanges ? 'ring-2 ring-[#2563EB] ring-offset-2' : ''
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </div>

      {/* 3 Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Interface & Accessibility */}
        <div className="glass-panel p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 flex items-center justify-center text-[#2563EB] dark:text-blue-400">
                <Monitor className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-[#0B1728] dark:text-white">
                Interface & Accessibility
              </h3>
            </div>

            {/* Theme Select */}
            <div>
              <label className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                THEME
              </label>
              <select
                value={localSettings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#10213E] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#2563EB] cursor-pointer shadow-2xs"
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
                <option value="System">System</option>
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                FONT SIZE
              </label>
              <select
                value={localSettings.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#10213E] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#2563EB] cursor-pointer shadow-2xs"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            {/* High Contrast Mode Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-[#0B1728] dark:text-white block">
                  High Contrast Mode
                </span>
                <span className="text-3xs text-slate-400 font-medium">
                  {localSettings.highContrast ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('highContrast', !localSettings.highContrast)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  localSettings.highContrast ? 'bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    localSettings.highContrast ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-3xs font-semibold text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Applies when Save Changes is clicked</span>
          </div>
        </div>

        {/* Card 2: Screening Parameters */}
        <div className="glass-panel p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-[#0B1728] dark:text-white">
                Screening Parameters
              </h3>
            </div>

            {/* Detection Sensitivity Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  DETECTION SENSITIVITY
                </label>
                <span className="text-2xs font-extrabold text-[#2563EB] dark:text-blue-400">
                  {getSensitivityLabel(localSettings.detectionSensitivity)}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={localSettings.detectionSensitivity}
                onChange={(e) => handleChange('detectionSensitivity', Number(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-3xs text-slate-400 font-medium mt-1">
                <span>10%</span>
                <span className="font-bold text-[#2563EB]">{localSettings.detectionSensitivity}%</span>
                <span>95%</span>
              </div>
            </div>

            {/* Auto-Generate Report Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-[#0B1728] dark:text-white block">
                  Auto-Generate Report
                </span>
                <span className="text-3xs text-slate-400 font-medium">
                  {localSettings.autoGenerateReport ? 'Automated triage slip' : 'Manual generation only'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('autoGenerateReport', !localSettings.autoGenerateReport)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  localSettings.autoGenerateReport ? 'bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    localSettings.autoGenerateReport ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-3xs font-semibold text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sensitivity threshold: {localSettings.detectionSensitivity}%</span>
          </div>
        </div>

        {/* Card 3: Clinical Preferences & Report Format */}
        <div className="glass-panel p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-[#0B1728] dark:text-white">
                Clinical Preferences
              </h3>
            </div>

            {/* Default Report Format */}
            <div>
              <label className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                DEFAULT REPORT FORMAT
              </label>
              <select
                value={localSettings.defaultReportFormat}
                onChange={(e) => handleChange('defaultReportFormat', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#10213E] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#2563EB] cursor-pointer shadow-2xs"
              >
                <option value="Detailed">Detailed (Full Clinical PDF)</option>
                <option value="Summary">Summary (Quick Triage Slip PDF)</option>
                <option value="Raw CSV">Raw CSV (Tabular Data Export)</option>
              </select>
            </div>

            {/* Retina Image Quality */}
            <div>
              <label className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                RETINA IMAGE QUALITY
              </label>
              <select
                value={localSettings.retinaImageQuality}
                onChange={(e) => handleChange('retinaImageQuality', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#10213E] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#2563EB] cursor-pointer shadow-2xs"
              >
                <option value="High">High (Lossless DICOM/PNG)</option>
                <option value="Standard">Standard (JPEG)</option>
              </select>
            </div>

            {/* Specialist Review Threshold Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  SPECIALIST REVIEW THRESHOLD {localSettings.specialistThreshold}%
                </label>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={localSettings.specialistThreshold}
                onChange={(e) => handleChange('specialistThreshold', Number(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-3xs text-slate-400 font-medium mt-1">
                <span>50%</span>
                <span className="font-bold text-[#2563EB]">{localSettings.specialistThreshold}% Safe Cutoff</span>
                <span>95%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-3xs font-semibold text-amber-600 dark:text-amber-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Cases below {localSettings.specialistThreshold}% trigger specialist review</span>
          </div>
        </div>

      </div>

    </div>
  );
}
