import { useState } from 'react';
import api from '../api/axios';

function Sidebar({ user, lists, selectedList, onSelectList, onListCreated, onListDeleted, onLogout }) {
  const [newListName, setNewListName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [hoveredListId, setHoveredListId] = useState(null);

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
    // Stop the click from also selecting the list
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
    <aside style={styles.sidebar}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatar}>
          {user?.email?.[0].toUpperCase()}
        </div>
        <span style={styles.email}>{user?.email}</span>
        <button style={styles.logoutBtn} onClick={onLogout}>
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
              ...(selectedList?.id === list.id ? styles.listItemActive : {}),
            }}
            onClick={() => onSelectList(list)}
            onMouseEnter={() => setHoveredListId(list.id)}
            onMouseLeave={() => setHoveredListId(null)}
          >
            <span style={styles.listDot(list.color)} />
            <span style={styles.listName}>{list.name}</span>
            <button
              style={{
                ...styles.deleteBtn,
                opacity: hoveredListId === list.id ? 1 : 0,
              }}
              onClick={(e) => handleDeleteList(e, list.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </nav>

      {/* Add New List */}
      <div style={styles.addSection}>
        {isAdding ? (
          <div style={styles.addForm}>
            <input
              style={styles.addInput}
              type="text"
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div style={styles.addActions}>
              <button style={styles.addConfirmBtn} onClick={handleCreateList}>
                Add
              </button>
              <button
                style={styles.addCancelBtn}
                onClick={() => {
                  setIsAdding(false);
                  setNewListName('');
                }}
              >
                Cancel
              </button>
            </div>
            {error && <p style={styles.error}>{error}</p>}
          </div>
        ) : (
          <button style={styles.newListBtn} onClick={() => setIsAdding(true)}>
            + New list
          </button>
        )}
      </div>

    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: '#eff6fc',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #dce6f0',
    height: '100vh',
  },
  header: {
    padding: '20px 16px 16px',
    borderBottom: '1px solid #dce6f0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#2564cf',
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
    color: '#333',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    fontSize: '12px',
    color: '#2564cf',
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
    position: 'relative',
  },
  listItemActive: {
    backgroundColor: '#dce6f7',
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
    color: '#1a1a1a',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '11px',
    padding: '2px 4px',
    transition: 'opacity 0.15s',
  },
  addSection: {
    padding: '12px',
    borderTop: '1px solid #dce6f0',
  },
  addForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  addInput: {
    padding: '8px 10px',
    border: '1px solid #2564cf',
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
    backgroundColor: '#2564cf',
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
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  newListBtn: {
    width: '100%',
    padding: '9px',
    backgroundColor: 'transparent',
    color: '#2564cf',
    border: '1px dashed #2564cf',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  error: {
    color: '#d32f2f',
    fontSize: '12px',
    margin: 0,
  },
};

export default Sidebar;