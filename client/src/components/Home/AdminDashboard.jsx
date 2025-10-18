import "./Admin.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

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
      <NavBar user={admin} location="adminDashboard" />
      <h2>Registered Users:</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Dashboard</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>
                  <button onClick={() => viewUserDashboard(user)}>
                    View Dashboard
                  </button>
                </td>
                <td>
                  <button onClick={() => toggleLock(user)}>
                    {user.locked ? "Unlock" : "Lock"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default AdminDashboard;
