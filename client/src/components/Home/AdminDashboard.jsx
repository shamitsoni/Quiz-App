import { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function AdminDashboard({ admin }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${SERVER_URL}/api/admin/users`, {
      headers: {
        "x-user-id": admin.id,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const viewUserDashboard = (user) => {
    navigate(`/admin/user/${user.id}`);
  };

  const toggleLock = (user) => {
    const action = user.locked ? "unlock" : "lock";

    fetch(`${SERVER_URL}/api/admin/users/${user.id}/${action}`, {
      method: "POST",
      headers: {
        "x-user-id": admin.id,
      },
    })
      .then((res) => res.json())
      .then(() => {
        // Update the local state of user.locked to reflect instantly in frontend without page refresh
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id ? { ...u, locked: !user.locked } : u
          )
        );
      });
  };

  return (
    <>
      <h1>Welcome, Admin.</h1>
      <h2>Registered Users:</h2>
      {users.map((user) => {
        return (
          <div key={user.id} style={{ display: "flex", gap: "50px" }}>
            <div>{user.username}</div>
            <button onClick={() => viewUserDashboard(user)}>
              View Dashboard
            </button>
            <button onClick={() => toggleLock(user)}>
              {user.locked ? "Unlock" : "Lock"}
            </button>
          </div>
        );
      })}
    </>
  );
}

export default AdminDashboard;
