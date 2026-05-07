import { useState, useEffect } from 'react';
import api from '../api/axios';
import TaskItem from './TaskItem';
import AddTaskBar from './AddTaskBar';

function TaskList({ selectedList }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks whenever the selected list changes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/tasks?list_id=${selectedList.id}`);
        setTasks(response.data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedList.id]);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleTaskDeleted = (deletedId) => {
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
  };

  // Split tasks into incomplete and completed
  const incompleteTasks = tasks.filter((t) => !t.is_completed);
  const completedTasks = tasks.filter((t) => t.is_completed);

  return (
    <div style={styles.container}>

      {/* List Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>{selectedList.name}</h2>
        <span style={styles.count}>
          {incompleteTasks.length} remaining
        </span>
      </div>

      {/* Task Area */}
      <div style={styles.taskArea}>
        {loading ? (
          <p style={styles.message}>Loading tasks...</p>
        ) : (
          <>
            {/* Incomplete Tasks */}
            {incompleteTasks.length === 0 && completedTasks.length === 0 && (
              <p style={styles.message}>No tasks yet. Add one below.</p>
            )}

            {incompleteTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            ))}

            {/* Completed Section */}
            {completedTasks.length > 0 && (
              <div style={styles.completedSection}>
                <p style={styles.completedLabel}>
                  Completed ({completedTasks.length})
                </p>
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Task Bar */}
      <AddTaskBar
        listId={selectedList.id}
        onTaskCreated={handleTaskCreated}
      />

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: '32px 32px 16px',
    borderBottom: '1px solid #e5e5e5',
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  count: {
    fontSize: '13px',
    color: '#999',
  },
  taskArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 32px',
  },
  message: {
    color: '#aaa',
    fontSize: '14px',
    marginTop: '24px',
    textAlign: 'center',
  },
  completedSection: {
    marginTop: '24px',
    borderTop: '1px solid #e5e5e5',
    paddingTop: '16px',
  },
  completedLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
  },
};

export default TaskList;