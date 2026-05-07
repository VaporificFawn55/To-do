import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import SettingsModal from '../components/SettingsModal';
import api from '../api/axios';

function Home() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [, setLoadingLists] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await api.get('/lists');
        setLists(response.data);
        if (response.data.length > 0) {
          setSelectedList(response.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch lists:', err);
      } finally {
        setLoadingLists(false);
      }
    };

    fetchLists();
  }, []);

  const handleSelectList = (list) => setSelectedList(list);

  const handleListCreated = (newList) => {
    setLists((prev) => [...prev, newList]);
    setSelectedList(newList);
  };

  const handleListDeleted = (deletedId) => {
    const updated = lists.filter((l) => l.id !== deletedId);
    setLists(updated);
    if (selectedList?.id === deletedId) {
      setSelectedList(updated.length > 0 ? updated[0] : null);
    }
  };

  return (
    <div style={{ ...styles.container, backgroundColor: theme.mainBg }}>
      <Sidebar
        user={user}
        lists={lists}
        selectedList={selectedList}
        onSelectList={handleSelectList}
        onListCreated={handleListCreated}
        onListDeleted={handleListDeleted}
        onLogout={logout}
        onOpenSettings={() => setShowSettings(true)}
      />

      <main style={styles.main}>
        {selectedList ? (
          <TaskList selectedList={selectedList} />
        ) : (
          <div style={styles.empty}>
            <p style={{ ...styles.emptyText, color: theme.textMuted }}>
              Create a list to get started
            </p>
          </div>
        )}
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  empty: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: '15px',
  },
};

export default Home;
