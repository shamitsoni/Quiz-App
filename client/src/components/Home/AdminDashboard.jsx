import { useState } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  fetch(`${SERVER_URL}/api/admin/users`)
    .then((res) => res.json())
    .then((data) => setUsers(data));

  return (
    <>
      <h1>Welcome, Admin.</h1>
      <h2>Registered Users:</h2>
      {users.map((user) => {
        return <div key={user.id}>{user.username}</div>;
      })}
    </>
  );
}

export default AdminDashboard;
