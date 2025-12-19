import { useEffect, useState } from 'react';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  if (!user) {
    return (
      <div style={{ padding: '16px' }}>
        <h2>Profile</h2>
        <p>No user data found</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <h2>Profile</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
}
