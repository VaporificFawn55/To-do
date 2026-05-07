import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import api from '../api/axios';

function Home() {
  const { user, logout } = useAuth();
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loadingLists, setLoadingLists] = useState(true);

  // Fetch all lists when the page loads
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await api.get('/lists');
        setLists(response.data);

        // Auto select the first list if one exists
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

  const handleSelectList = (list) => {
    setSelectedList(list);
  };

  const handleListCreated = (newList) => {
    setLists((prev) => [...prev, newList]);
    setSelectedList(newList);
  };

  const handleListDeleted = (deletedId) => {
    const updated = lists.filter((l) => l.id !== deletedId);
    setLists(updated);

    // If the deleted list was selected, select the first remaining one
    if (selectedList?.id === deletedId) {
      setSelectedList(updated.length > 0 ? updated[0] : null);
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar
        user={user}
        lists={lists}
        selectedList={selectedList}
        onSelectList={handleSelectList}
        onListCreated={handleListCreated}
        onListDeleted={handleListDeleted}
        onLogout={logout}
      />

      <main style={styles.main}>
        {selectedList ? (
          <TaskList
            selectedList={selectedList}
          />
        ) : (
          <div style={styles.empty}>
            <p style={styles.emptyText}>Create a list to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f3f3f3',
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
    color: '#999',
    fontSize: '15px',
  },
};

export default Home;