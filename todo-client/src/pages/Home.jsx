import { useAuth } from '../context/AuthContext';

function Home() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '40px' }}>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

export default Home;