import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const THEMES = {
  default: {
    id: 'default',
    name: 'Default',
    accent: '#2564cf',
    sidebarBg: '#eff6fc',
    sidebarBorder: '#dce6f0',
    sidebarActiveItem: '#dce6f7',
    mainBg: '#f3f3f3',
    listBg: '#f9f9f9',
    panelBg: '#ffffff',
    divider: '#e5e5e5',
    text: '#1a1a1a',
    textMuted: '#999999',
    textSecondary: '#555555',
    inputBorder: '#dddddd',
    taskHover: '#f0f0f0',
    taskSelected: '#e8f0fd',
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    accent: '#4f94ef',
    sidebarBg: '#1e2130',
    sidebarBorder: '#2d3148',
    sidebarActiveItem: '#2a3a5a',
    mainBg: '#131520',
    listBg: '#181b28',
    panelBg: '#1e2130',
    divider: '#2d3148',
    text: '#e8eaf6',
    textMuted: '#6b7280',
    textSecondary: '#9ca3af',
    inputBorder: '#3d4268',
    taskHover: '#252840',
    taskSelected: '#2a3a5a',
  },
  warm: {
    id: 'warm',
    name: 'Warm',
    accent: '#c0392b',
    sidebarBg: '#fdf0e8',
    sidebarBorder: '#e8d5c4',
    sidebarActiveItem: '#f5d5c0',
    mainBg: '#faf5f0',
    listBg: '#fdf8f5',
    panelBg: '#fffaf7',
    divider: '#e8d5c4',
    text: '#2c1a0e',
    textMuted: '#9e7e6a',
    textSecondary: '#7a5a44',
    inputBorder: '#dac5b0',
    taskHover: '#f5ede6',
    taskSelected: '#f5d5c0',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    accent: '#2d7a4f',
    sidebarBg: '#edf5ef',
    sidebarBorder: '#c8dece',
    sidebarActiveItem: '#c5e0cb',
    mainBg: '#f4f9f5',
    listBg: '#f8fcf9',
    panelBg: '#ffffff',
    divider: '#d4e9da',
    text: '#1a2e1f',
    textMuted: '#7a9e82',
    textSecondary: '#4a7a56',
    inputBorder: '#b8d8c0',
    taskHover: '#e8f5ec',
    taskSelected: '#c5e0cb',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    accent: '#9b59b6',
    sidebarBg: '#1a1025',
    sidebarBorder: '#2d1f45',
    sidebarActiveItem: '#3a2858',
    mainBg: '#0f0a1a',
    listBg: '#130e20',
    panelBg: '#1a1025',
    divider: '#2d1f45',
    text: '#e8e0f0',
    textMuted: '#7a6b8a',
    textSecondary: '#a090b8',
    inputBorder: '#3d2f5a',
    taskHover: '#231540',
    taskSelected: '#3a2858',
  },
};

export const FONTS = {
  system: {
    id: 'system',
    name: 'System',
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  serif: {
    id: 'serif',
    name: 'Serif',
    family: "Georgia, 'Times New Roman', serif",
  },
  mono: {
    id: 'mono',
    name: 'Mono',
    family: "'SF Mono', 'Fira Code', 'Courier New', monospace",
  },
  rounded: {
    id: 'rounded',
    name: 'Rounded',
    family: "'Trebuchet MS', Verdana, system-ui, sans-serif",
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { user } = useAuth();

  const [themeId, setThemeId] = useState('default');
  const [fontId, setFontId] = useState('system');

  // Load preferences whenever the logged-in user changes
  useEffect(() => {
    if (!user) return;
    try {
      const saved = localStorage.getItem(`preferences_${user.id}`);
      if (saved) {
        const { themeId: t, fontId: f } = JSON.parse(saved);
        if (t && THEMES[t]) setThemeId(t);
        if (f && FONTS[f]) setFontId(f);
      }
    } catch {}
  }, [user?.id]);

  // Persist whenever preferences change
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(
        `preferences_${user.id}`,
        JSON.stringify({ themeId, fontId })
      );
    } catch {}
  }, [themeId, fontId, user?.id]);

  const theme = THEMES[themeId] ?? THEMES.default;
  const font = FONTS[fontId] ?? FONTS.system;

  return (
    <ThemeContext.Provider value={{ theme, font, themeId, fontId, setThemeId, setFontId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
