export interface ThemeConfig {
  id: string;
  name: string;
  bg: string;
  ink: string;
  paper: string;
  accent: string;
  inkSoft: string;
  inkMute: string;
  ok: string;
  orgA: string;
  orgB: string;
  orgGlowA: string;
  orgGlowB: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  default: {
    id: 'default',
    name: 'Cielo Blue',
    bg: '#8ED8FF',
    ink: '#0E0E0C',
    paper: '#EEF5FA',
    accent: '#8ED8FF',
    inkSoft: '#303A40',
    inkMute: '#7F8B92',
    ok: '#46C98B',
    orgA: '#22333A',
    orgB: '#0A1216',
    orgGlowA: '#BFE2EF',
    orgGlowB: '#8ED8FF',
  },
  canary: {
    id: 'canary',
    name: 'Acid Canary',
    bg: '#FFF48D',
    ink: '#0E0E0C',
    paper: '#FAF7EA',
    accent: '#FFF48D',
    inkSoft: '#3A3A30',
    inkMute: '#8F8F80',
    ok: '#46C98B',
    orgA: '#3A3A22',
    orgB: '#131309',
    orgGlowA: '#D8DFAE',
    orgGlowB: '#FFF48D',
  },
  menta: {
    id: 'menta',
    name: 'Menta Green',
    bg: '#A9E8AE',
    ink: '#0B130D',
    paper: '#EEF8EF',
    accent: '#A9E8AE',
    inkSoft: '#2F4032',
    inkMute: '#7F9484',
    ok: '#22C55E',
    orgA: '#243A28',
    orgB: '#0B130D',
    orgGlowA: '#CDEED0',
    orgGlowB: '#A9E8AE',
  },
  coral: {
    id: 'coral',
    name: 'Coral Salmon',
    bg: '#FFAFA3',
    ink: '#160B0A',
    paper: '#FAF0EC',
    accent: '#FFAFA3',
    inkSoft: '#40332F',
    inkMute: '#96837E',
    ok: '#46C98B',
    orgA: '#3A2522',
    orgB: '#160B0A',
    orgGlowA: '#F2CDC5',
    orgGlowB: '#FFAFA3',
  },
  retina: {
    id: 'retina',
    name: 'Retina Amber',
    bg: '#FFB347',
    ink: '#0E0C09',
    paper: '#FFF7EE',
    accent: '#FF9F1C',
    inkSoft: '#3D3528',
    inkMute: '#8C8270',
    ok: '#10B981',
    orgA: '#3D2F1B',
    orgB: '#140F08',
    orgGlowA: '#F7D6A8',
    orgGlowB: '#FFB347',
  },
};

export const THEME_KEYS = Object.keys(THEMES);

export function getStoredTheme(): string {
  if (typeof window === 'undefined') return 'default';
  return localStorage.getItem('rm-theme') || 'default';
}

export function applyTheme(themeId: string) {
  if (typeof document === 'undefined') return;
  const theme = THEMES[themeId] || THEMES.default;
  
  if (themeId === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', themeId);
  }

  // Update CSS variables dynamically
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.bg);
  root.style.setProperty('--ink', theme.ink);
  root.style.setProperty('--paper', theme.paper);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--ink-soft', theme.inkSoft);
  root.style.setProperty('--ink-mute', theme.inkMute);
  root.style.setProperty('--ok', theme.ok);
  root.style.setProperty('--org-a', theme.orgA);
  root.style.setProperty('--org-b', theme.orgB);
  root.style.setProperty('--org-glow-a', theme.orgGlowA);
  root.style.setProperty('--org-glow-b', theme.orgGlowB);

  // Meta theme-color update
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme.bg);
  }

  localStorage.setItem('rm-theme', themeId);
}
