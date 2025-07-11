import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, []);

  if (!user) return <p>Loading user info...</p>;

  return (
    <div className="dashboard">
      <h2>Welcome, {user.first_name}!</h2>
      <p>Email: {user.email}</p>
      <p>Nickname: {user.nickname}</p>
    </div>
  );
}
