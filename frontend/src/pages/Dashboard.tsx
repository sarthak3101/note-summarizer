import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
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
    <div className="dashboard max-w-2xl mx-auto mt-12 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.first_name}!</h2>
      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      <p className="mb-6"><strong>Nickname:</strong> {user.nickname}</p>

      <Link to="/summarize">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go to Summarizer
        </button>
      </Link>
    </div>
  );
}
