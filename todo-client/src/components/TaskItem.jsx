import { useState } from 'react';
import { format } from 'date-fns';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

function TaskItem({ task, onTaskUpdated, onTaskDeleted, onTaskSelected, isSelected }) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    try {
      const response = await api.patch(`/tasks/${task.id}`, {
        is_completed: !task.is_completed,
      });
      onTaskUpdated(response.data);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${task.id}`);
      onTaskDeleted(task.id);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setIsDeleting(false);
    }
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    return format(new Date(dateStr), 'MMM d, yyyy');
  };

  const isDueToday = (dateStr) => {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    const today = new Date();
    return (
      due.getFullYear() === today.getFullYear() &&
      due.getMonth() === today.getMonth() &&
      due.getDate() === today.getDate()
    );
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today && !task.is_completed;
  };

  let bgColor = 'transparent';
  if (isSelected) bgColor = theme.taskSelected;
  else if (isHovered) bgColor = theme.taskHover;

  return (
    <div
      style={{ ...styles.container, backgroundColor: bgColor, opacity: isDeleting ? 0.4 : 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onTaskSelected(task)}
    >
      {/* Checkbox */}
      <button
        style={{
          ...styles.checkbox,
          ...(task.is_completed
            ? { backgroundColor: theme.accent, borderColor: theme.accent }
            : { borderColor: theme.inputBorder }),
        }}
        onClick={(e) => { e.stopPropagation(); handleToggleComplete(); }}
      >
        {task.is_completed && <span style={styles.checkmark}>✓</span>}
      </button>

      {/* Task Info */}
      <div style={styles.info}>
        <span
          style={{
            ...styles.title,
            color: theme.text,
            ...(task.is_completed ? { textDecoration: 'line-through', color: theme.textMuted } : {}),
          }}
        >
          {task.title}
        </span>

        {task.notes && (
          <span style={{ ...styles.notes, color: theme.textMuted }}>{task.notes}</span>
        )}

        {task.due_date && (
          <span
            style={{
              ...styles.dueDate,
              color: isOverdue(task.due_date) ? '#d32f2f' : isDueToday(task.due_date) ? theme.accent : theme.textMuted,
            }}
          >
            📅 {formatDueDate(task.due_date)}
            {isOverdue(task.due_date) && ' · Overdue'}
            {isDueToday(task.due_date) && ' · Today'}
          </span>
        )}
      </div>

      {/* Delete Button */}
      <button
        style={{ ...styles.deleteBtn, color: theme.textMuted, opacity: isHovered ? 1 : 0 }}
        onClick={handleDelete}
      >
        ✕
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '4px',
    transition: 'background 0.1s',
    cursor: 'pointer',
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
    marginTop: '2px',
    transition: 'all 0.15s',
  },
  checkmark: {
    color: '#fff',
    fontSize: '11px',
    lineHeight: 1,
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  title: {
    fontSize: '14px',
    lineHeight: '1.4',
  },
  notes: {
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dueDate: {
    fontSize: '12px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '11px',
    padding: '2px 4px',
    transition: 'opacity 0.15s',
    flexShrink: 0,
  },
};

export default TaskItem;
