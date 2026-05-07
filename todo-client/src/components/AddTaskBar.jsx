import { useState } from 'react';
import api from '../api/axios';

function AddTaskBar({ listId, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/tasks', {
        list_id: listId,
        title: title.trim(),
        notes: notes.trim() || null,
        due_date: dueDate || null,
      });

      onTaskCreated(response.data);
      setTitle('');
      setDueDate('');
      setNotes('');
      setIsExpanded(false);
    } catch (err) {
      setError('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setTitle('');
      setDueDate('');
      setNotes('');
    }
  };

  return (
    <div style={styles.container}>
      {error && <p style={styles.error}>{error}</p>}

      {/* Expanded form — shows notes and due date fields */}
      {isExpanded && (
        <div style={styles.expandedFields}>
          <input
            style={styles.notesInput}
            type="text"
            placeholder="Add a note (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div style={styles.dateRow}>
            <label style={styles.dateLabel}>Due date</label>
            <input
              style={styles.dateInput}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Main input row */}
      <div style={styles.inputRow}>
        <span style={styles.plusIcon}>+</span>
        <input
          style={styles.input}
          type="text"
          placeholder="Add a task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
        />
        {isExpanded && (
          <button
            style={{
              ...styles.addBtn,
              ...(loading ? { opacity: 0.7 } : {}),
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '...' : 'Add'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    borderTop: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    padding: '12px 32px 20px',
  },
  expandedFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '10px',
  },
  notesInput: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '13px',
    outline: 'none',
    color: '#555',
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dateLabel: {
    fontSize: '13px',
    color: '#666',
    flexShrink: 0,
  },
  dateInput: {
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '13px',
    outline: 'none',
    color: '#333',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  plusIcon: {
    fontSize: '20px',
    color: '#2564cf',
    fontWeight: '300',
    lineHeight: 1,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#1a1a1a',
    backgroundColor: 'transparent',
  },
  addBtn: {
    padding: '7px 16px',
    backgroundColor: '#2564cf',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    flexShrink: 0,
  },
  error: {
    color: '#d32f2f',
    fontSize: '12px',
    marginBottom: '6px',
  },
};

export default AddTaskBar;