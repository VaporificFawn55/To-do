import { useTheme, THEMES, FONTS } from '../context/ThemeContext';

function SettingsModal({ onClose }) {
  const { theme, themeId, fontId, setThemeId, setFontId } = useTheme();

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{ ...styles.modal, backgroundColor: theme.panelBg, color: theme.text }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ ...styles.modalHeader, borderBottom: `1px solid ${theme.divider}` }}>
          <h2 style={{ ...styles.modalTitle, color: theme.text }}>Appearance</h2>
          <button
            style={{ ...styles.closeBtn, color: theme.textMuted }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Theme section */}
        <div style={styles.section}>
          <div style={{ ...styles.sectionLabel, color: theme.textMuted }}>Theme</div>
          <div style={styles.themeGrid}>
            {Object.values(THEMES).map((t) => (
              <button
                key={t.id}
                style={{
                  ...styles.themeOption,
                  outline: themeId === t.id ? `2px solid ${theme.accent}` : '2px solid transparent',
                  outlineOffset: '2px',
                  backgroundColor: theme.panelBg,
                }}
                onClick={() => setThemeId(t.id)}
              >
                {/* Mini app preview */}
                <div style={{
                  ...styles.themePreview,
                  backgroundColor: t.listBg,
                  border: `1px solid ${t.sidebarBorder}`,
                }}>
                  <div style={{
                    width: '32%',
                    height: '100%',
                    backgroundColor: t.sidebarBg,
                    borderRight: `1px solid ${t.sidebarBorder}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    padding: '4px 3px',
                  }}>
                    <div style={{ height: '4px', borderRadius: '2px', backgroundColor: t.accent, width: '70%' }} />
                    <div style={{ height: '3px', borderRadius: '2px', backgroundColor: t.textMuted, opacity: 0.35, width: '90%' }} />
                    <div style={{ height: '3px', borderRadius: '2px', backgroundColor: t.textMuted, opacity: 0.35, width: '75%' }} />
                  </div>
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    padding: '5px 4px',
                  }}>
                    <div style={{ height: '4px', borderRadius: '2px', backgroundColor: t.text, opacity: 0.5, width: '55%' }} />
                    <div style={{ height: '3px', borderRadius: '2px', backgroundColor: t.textMuted, opacity: 0.3, width: '80%' }} />
                    <div style={{ height: '3px', borderRadius: '2px', backgroundColor: t.textMuted, opacity: 0.3, width: '65%' }} />
                  </div>
                </div>
                <span style={{ ...styles.themeLabel, color: theme.text }}>
                  {t.name}
                  {themeId === t.id && <span style={{ color: theme.accent }}> ✓</span>}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: theme.divider, margin: '0 20px' }} />

        {/* Font section */}
        <div style={styles.section}>
          <div style={{ ...styles.sectionLabel, color: theme.textMuted }}>Font</div>
          <div style={styles.fontGrid}>
            {Object.values(FONTS).map((f) => (
              <button
                key={f.id}
                style={{
                  ...styles.fontOption,
                  border: fontId === f.id
                    ? `2px solid ${theme.accent}`
                    : `2px solid ${theme.inputBorder}`,
                  backgroundColor: fontId === f.id ? theme.taskSelected : theme.panelBg,
                  color: theme.text,
                  fontFamily: f.family,
                }}
                onClick={() => setFontId(f.id)}
              >
                <span style={{ fontSize: '24px', lineHeight: 1, fontFamily: f.family }}>Aa</span>
                <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: f.family, marginTop: '4px' }}>
                  {f.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '480px',
    borderRadius: '12px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 20px 14px',
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: '4px',
    lineHeight: 1,
  },
  section: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  themeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px',
  },
  themeOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    padding: '6px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  themePreview: {
    width: '100%',
    height: '52px',
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
  },
  themeLabel: {
    fontSize: '11px',
    fontWeight: '500',
  },
  fontGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  },
  fontOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 8px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default SettingsModal;
