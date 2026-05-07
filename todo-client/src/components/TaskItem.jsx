import { useState } from 'react';
import { format } from 'date-fns';
import api from '../api/axios';

function TaskItem({ task, onTaskUpdated, onTaskDeleted }) {
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
    const date = new Date(dateStr);
    return format(date, 'MMM d, yyyy');
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

  return (
    <div
      style={{
        ...styles.container,
        ...(isHovered ? styles.containerHovered : {}),
        ...(isDeleting ? { opacity: 0.4 } : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox */}
      <button
        style={{
          ...styles.checkbox,
          ...(task.is_completed ? styles.checkboxChecked : {}),
        }}
        onClick={handleToggleComplete}
      >
        {task.is_completed && <span style={styles.checkmark}>✓</span>}
      </button>

      {/* Task Info */}
      <div style={styles.info}>
        <span
          style={{
            ...styles.title,
            ...(task.is_completed ? styles.titleCompleted : {}),
          }}
        >
          {task.title}
        </span>

        {/* Notes preview */}
        {task.notes && (
          <span style={styles.notes}>{task.notes}</span>
        )}

        {/* Due date */}
        {task.due_date && (
          <span
            style={{
              ...styles.dueDate,
              ...(isOverdue(task.due_date) ? styles.dueDateOverdue : {}),
              ...(isDueToday(task.due_date) ? styles.dueDateToday : {}),
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
        style={{
          ...styles.deleteBtn,
          opacity: isHovered ? 1 : 0,
        }}
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
    cursor: 'default',
  },
  containerHovered: {
    backgroundColor: '#f0f0f0',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #bbb',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2px',
    transition: 'all 0.15s',
  },
  checkboxChecked: {
    backgroundColor: '#2564cf',
    borderColor: '#2564cf',
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
    color: '#1a1a1a',
    lineHeight: '1.4',
  },
  titleCompleted: {
    textDecoration: 'line-through',
    color: '#aaa',
  },
  notes: {
    fontSize: '12px',
    color: '#888',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dueDate: {
    fontSize: '12px',
    color: '#888',
  },
  dueDateOverdue: {
    color: '#d32f2f',
  },
  dueDateToday: {
    color: '#2564cf',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '11px',
    padding: '2px 4px',
    transition: 'opacity 0.15s',
    flexShrink: 0,
  },
};

export default TaskItem;