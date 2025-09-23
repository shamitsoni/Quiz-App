import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${SERVER_URL}/api/admin/users`, {
      headers: {
        "x-user-id": user.id,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const viewUserDashboard = (user) => {
    console.log(user.id);
    navigate(`/admin/user/${user.id}`);
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
          </div>
        );
      })}
    </>
  );
}

export default AdminDashboard;
