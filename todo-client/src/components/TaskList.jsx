import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import TaskItem from './TaskItem';
import AddTaskBar from './AddTaskBar';
import TaskDetail from './TaskDetail';

function TaskList({ selectedList }) {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    setSelectedTask(null);
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
    setSelectedTask((prev) => (prev?.id === updatedTask.id ? updatedTask : prev));
  };

  const handleTaskDeleted = (deletedId) => {
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
    setSelectedTask((prev) => (prev?.id === deletedId ? null : prev));
  };

  const incompleteTasks = tasks.filter((t) => !t.is_completed);
  const completedTasks = tasks.filter((t) => t.is_completed);

  return (
    <div style={{ ...styles.wrapper, backgroundColor: theme.listBg }}>

      {/* Left pane — task list */}
      <div style={styles.listPane}>

        <div style={{ ...styles.header, borderBottom: `1px solid ${theme.divider}` }}>
          <h2 style={{ ...styles.title, color: theme.text }}>{selectedList.name}</h2>
          <span style={{ ...styles.count, color: theme.textMuted }}>
            {incompleteTasks.length} remaining
          </span>
        </div>

        <div style={styles.taskArea}>
          {loading ? (
            <p style={{ ...styles.message, color: theme.textMuted }}>Loading tasks...</p>
          ) : (
            <>
              {incompleteTasks.length === 0 && completedTasks.length === 0 && (
                <p style={{ ...styles.message, color: theme.textMuted }}>No tasks yet. Add one below.</p>
              )}

              {incompleteTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isSelected={selectedTask?.id === task.id}
                  onTaskUpdated={handleTaskUpdated}
                  onTaskDeleted={handleTaskDeleted}
                  onTaskSelected={setSelectedTask}
                />
              ))}

              {completedTasks.length > 0 && (
                <div style={{ ...styles.completedSection, borderTop: `1px solid ${theme.divider}` }}>
                  <p style={{ ...styles.completedLabel, color: theme.textMuted }}>
                    Completed ({completedTasks.length})
                  </p>
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      isSelected={selectedTask?.id === task.id}
                      onTaskUpdated={handleTaskUpdated}
                      onTaskDeleted={handleTaskDeleted}
                      onTaskSelected={setSelectedTask}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <AddTaskBar
          listId={selectedList.id}
          onTaskCreated={handleTaskCreated}
        />
      </div>

      {/* Right pane — detail panel, slides in */}
      <div style={{
        ...styles.detailPane,
        width: selectedTask ? '320px' : '0',
        minWidth: selectedTask ? '320px' : '0',
        borderLeft: `1px solid ${theme.divider}`,
        backgroundColor: theme.panelBg,
      }}>
        {selectedTask && (
          <TaskDetail
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onTaskUpdated={handleTaskUpdated}
          />
        )}
      </div>

    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    overflow: 'hidden',
  },
  listPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  detailPane: {
    transition: 'width 0.25s ease, min-width 0.25s ease',
    overflow: 'hidden',
    flexShrink: 0,
  },
  header: {
    padding: '32px 32px 16px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
  },
  count: {
    fontSize: '13px',
  },
  taskArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 32px',
  },
  message: {
    fontSize: '14px',
    marginTop: '24px',
    textAlign: 'center',
  },
  completedSection: {
    marginTop: '24px',
    paddingTop: '16px',
  },
  completedLabel: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
  },
};

export default TaskList;
