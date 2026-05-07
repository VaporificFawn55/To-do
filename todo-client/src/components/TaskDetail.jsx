import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

function TaskDetail({ task, onClose, onTaskUpdated }) {
  const { theme } = useTheme();
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || '');
  const [dueDate, setDueDate] = useState(
    task.due_date ? task.due_date.slice(0, 10) : ''
  );
  const [saving, setSaving] = useState(false);

  // Sync local state when a different task is selected
  useEffect(() => {
    setTitle(task.title);
    setNotes(task.notes || '');
    setDueDate(task.due_date ? task.due_date.slice(0, 10) : '');
  }, [task.id]);

  const save = async (fields) => {
    setSaving(true);
    try {
      const response = await api.patch(`/tasks/${task.id}`, fields);
      onTaskUpdated(response.data);
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleTitleBlur = () => {
    const trimmed = title.trim();
    if (!trimmed) { setTitle(task.title); return; }
    if (trimmed !== task.title) save({ title: trimmed });
  };

  const handleNotesBlur = () => {
    const trimmed = notes.trim();
    if (trimmed !== (task.notes || '')) save({ notes: trimmed });
  };

  const handleDueDateChange = (e) => {
    const val = e.target.value;
    setDueDate(val);
    save({ due_date: val || null });
  };

  const handleClearDueDate = () => {
    setDueDate('');
    save({ due_date: null });
  };

  const handleToggleComplete = () => {
    save({ is_completed: !task.is_completed });
  };

  return (
    <div style={{ ...styles.panel, backgroundColor: theme.panelBg }}>

      {/* Header */}
      <div style={styles.header}>
        <span style={{ ...styles.savingLabel, color: theme.textMuted }}>
          {saving ? 'Saving…' : ''}
        </span>
        <button
          style={{ ...styles.closeBtn, color: theme.textMuted }}
          onClick={onClose}
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Title row */}
      <div style={styles.titleRow}>
        <button
          style={{
            ...styles.checkbox,
            ...(task.is_completed
              ? { backgroundColor: theme.accent, borderColor: theme.accent }
              : { borderColor: theme.inputBorder }),
          }}
          onClick={handleToggleComplete}
          title={task.is_completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.is_completed && <span style={styles.checkmark}>✓</span>}
        </button>
        <input
          style={{
            ...styles.titleInput,
            color: theme.text,
            ...(task.is_completed ? { textDecoration: 'line-through', color: theme.textMuted } : {}),
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
        />
      </div>

      <div style={{ ...styles.divider, backgroundColor: theme.divider }} />

      {/* Due date */}
      <div style={styles.section}>
        <div style={{ ...styles.sectionLabel, color: theme.textMuted }}>Due date</div>
        <div style={styles.dateRow}>
          <input
            style={{ ...styles.dateInput, borderColor: theme.inputBorder, color: theme.text, backgroundColor: theme.panelBg }}
            type="date"
            value={dueDate}
            onChange={handleDueDateChange}
          />
          {dueDate && (
            <button style={{ ...styles.clearBtn, color: theme.accent }} onClick={handleClearDueDate}>
              Remove
            </button>
          )}
        </div>
      </div>

      <div style={{ ...styles.divider, backgroundColor: theme.divider }} />

      {/* Notes */}
      <div style={styles.section}>
        <div style={{ ...styles.sectionLabel, color: theme.textMuted }}>Notes</div>
        <textarea
          style={{ ...styles.notesTextarea, borderColor: theme.inputBorder, color: theme.text, backgroundColor: theme.panelBg }}
          placeholder="Add a note…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
        />
      </div>

    </div>
  );
}

const styles = {
  panel: {
    width: '320px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px 8px',
  },
  savingLabel: {
    fontSize: '11px',
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
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '4px 16px 16px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4px',
    transition: 'all 0.15s',
  },
  checkmark: {
    color: '#fff',
    fontSize: '11px',
    lineHeight: 1,
  },
  titleInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: 'transparent',
    resize: 'none',
    lineHeight: '1.4',
    padding: 0,
  },
  divider: {
    height: '1px',
    margin: '0 16px',
  },
  section: {
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dateInput: {
    flex: 1,
    padding: '6px 10px',
    border: '1px solid',
    borderRadius: '6px',
    fontSize: '13px',
    outline: 'none',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '0',
    flexShrink: 0,
  },
  notesTextarea: {
    width: '100%',
    minHeight: '120px',
    border: '1px solid',
    borderRadius: '6px',
    padding: '8px 10px',
    fontSize: '13px',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    boxSizing: 'border-box',
  },
};

export default TaskDetail;
