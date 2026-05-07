import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

function Sidebar({ user, lists, selectedList, onSelectList, onListCreated, onListDeleted, onLogout, onOpenSettings }) {
  const { theme } = useTheme();
  const [newListName, setNewListName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [hoveredListId, setHoveredListId] = useState(null);
  const installPromptRef = useRef(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      installPromptRef.current = e;
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    try {
      const response = await api.post('/lists', { name: newListName.trim() });
      onListCreated(response.data);
      setNewListName('');
      setIsAdding(false);
      setError('');
    } catch (err) {
      setError('Failed to create list');
    }
  };

  const handleDeleteList = async (e, listId) => {
    e.stopPropagation();
    try {
      await api.delete(`/lists/${listId}`);
      onListDeleted(listId);
    } catch (err) {
      setError('Failed to delete list');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCreateList();
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewListName('');
    }
  };

  return (
    <aside style={{ ...styles.sidebar, backgroundColor: theme.sidebarBg, borderRight: `1px solid ${theme.sidebarBorder}` }}>

      {/* Header */}
      <div style={{ ...styles.header, borderBottom: `1px solid ${theme.sidebarBorder}` }}>
        <div style={{ ...styles.avatar, backgroundColor: theme.accent }}>
          {user?.email?.[0].toUpperCase()}
        </div>
        <span style={{ ...styles.email, color: theme.text }}>{user?.email}</span>
        <button style={{ ...styles.logoutBtn, color: theme.accent }} onClick={onLogout}>
          Sign out
        </button>
      </div>

      {/* Lists */}
      <nav style={styles.nav}>
        {lists.map((list) => (
          <div
            key={list.id}
            style={{
              ...styles.listItem,
              ...(selectedList?.id === list.id
                ? { backgroundColor: theme.sidebarActiveItem }
                : {}),
            }}
            onClick={() => onSelectList(list)}
            onMouseEnter={() => setHoveredListId(list.id)}
            onMouseLeave={() => setHoveredListId(null)}
          >
            <span style={styles.listDot(list.color)} />
            <span style={{ ...styles.listName, color: theme.text }}>{list.name}</span>
            <button
              style={{
                ...styles.deleteBtn,
                opacity: hoveredListId === list.id ? 1 : 0,
                color: theme.textMuted,
              }}
              onClick={(e) => handleDeleteList(e, list.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </nav>

      {/* Add New List */}
      <div style={{ ...styles.addSection, borderTop: `1px solid ${theme.sidebarBorder}` }}>
        {isAdding ? (
          <div style={styles.addForm}>
            <input
              style={{ ...styles.addInput, borderColor: theme.accent, color: theme.text, backgroundColor: theme.panelBg }}
              type="text"
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div style={styles.addActions}>
              <button style={{ ...styles.addConfirmBtn, backgroundColor: theme.accent }} onClick={handleCreateList}>
                Add
              </button>
              <button
                style={{ ...styles.addCancelBtn, color: theme.textSecondary, borderColor: theme.inputBorder }}
                onClick={() => { setIsAdding(false); setNewListName(''); }}
              >
                Cancel
              </button>
            </div>
            {error && <p style={styles.error}>{error}</p>}
          </div>
        ) : (
          <>
            {showInstallBtn && (
              <button
                style={{ ...styles.installBtn, color: theme.accent, borderColor: theme.accent }}
                onClick={async () => {
                  const prompt = installPromptRef.current;
                  if (!prompt) return;
                  prompt.prompt();
                  await prompt.userChoice;
                  installPromptRef.current = null;
                  setShowInstallBtn(false);
                }}
              >
                ↓ Install App
              </button>
            )}
            <div style={styles.bottomRow}>
              <button
                style={{ ...styles.newListBtn, color: theme.accent, borderColor: theme.accent }}
                onClick={() => setIsAdding(true)}
              >
                + New list
              </button>
              <button
                style={{ ...styles.settingsBtn, color: theme.textMuted }}
                onClick={onOpenSettings}
                title="Appearance"
              >
                ⚙
              </button>
            </div>
          </>
        )}
      </div>

    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  header: {
    padding: '20px 16px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    flexShrink: 0,
  },
  email: {
    fontSize: '13px',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    fontSize: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    flexShrink: 0,
  },
  nav: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    cursor: 'pointer',
    borderRadius: '4px',
    margin: '0 8px',
  },
  listDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color || 'blue',
    flexShrink: 0,
  }),
  listName: {
    flex: 1,
    fontSize: '14px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '11px',
    padding: '2px 4px',
    transition: 'opacity 0.15s',
  },
  addSection: {
    padding: '12px',
  },
  addForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  addInput: {
    padding: '8px 10px',
    border: '1px solid',
    borderRadius: '6px',
    fontSize: '13px',
    outline: 'none',
  },
  addActions: {
    display: 'flex',
    gap: '8px',
  },
  addConfirmBtn: {
    flex: 1,
    padding: '7px',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  addCancelBtn: {
    flex: 1,
    padding: '7px',
    backgroundColor: 'transparent',
    border: '1px solid',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  installBtn: {
    display: 'block',
    width: '100%',
    padding: '9px',
    marginBottom: '8px',
    backgroundColor: 'transparent',
    border: '1px solid',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  newListBtn: {
    flex: 1,
    padding: '9px',
    backgroundColor: 'transparent',
    border: '1px dashed',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  settingsBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    lineHeight: 1,
    flexShrink: 0,
  },
  error: {
    color: '#d32f2f',
    fontSize: '12px',
    margin: 0,
  },
};

export default Sidebar;
