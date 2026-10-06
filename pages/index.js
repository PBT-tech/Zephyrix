import React, { useState, useEffect } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>ZEPHYRIX - Task Automation</h1>
      <p>Dashboard is loading...</p>
    </div>
  );
}
