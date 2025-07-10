// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import { FiUser, FiSearch, FiEdit2, FiTrash2, FiX, FiPlus} from "react-icons/fi";

const API_URL = "http://localhost:5000/users";

function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
      setSelectedUser(null);
      setIsEditing(false);
      setFormData({ first_name: "", last_name: "", email: "", age: "" });
    } catch (error) {
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUser = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      setSelectedUser(data);
      setShowModal(true);
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create user");
      }
      await fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const startEditUser = (user) => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
    });
    setSelectedUser(user);
    setIsEditing(true);
    setShowModal(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/update/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update user");
      }
      await fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete user");
      }
      await fetchUsers();
      setShowModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="app-container">
      <h2 className="app-title">
        <FiUser /> User Management System
      </h2>

      <div className="main-grid">
        {/* Form Section */}
        <div className="form-container">
          <h3>{isEditing ? "Edit User" : "Add New User"}</h3>
          <form onSubmit={isEditing ? updateUser : createUser} className="user-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                name="age"
                type="date"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="button-group">
              <button type="submit" className="btn btn-primary">
                <FiPlus /> {isEditing ? "Update" : "Create"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ first_name: "", last_name: "", email: "", age: "" });
                    setSelectedUser(null);
                  }}
                  className="btn btn-secondary"
                >
                  <FiX /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Users List Section */}
        <div className="users-section">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
          </div>

          {users.length === 0 ? (
            <div className="empty-state">
              <FiUser />
              <p>No users found. Add your first user!</p>
            </div>
          ) : (
            <div className="user-list">
              {users
                .filter((user) =>
                  `${user.first_name} ${user.last_name}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <div key={user.id} className="user-card">
                    <h4>{user.first_name} {user.last_name}</h4>
                    <div className="card-buttons">
                      <button 
                        onClick={() => fetchUser(user.id)} 
                        className="btn btn-success btn-sm"
                      >
                        <FiUser /> View
                      </button>
                      <button 
                        onClick={() => startEditUser(user)} 
                        className="btn btn-warning btn-sm"
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)} 
                        className="btn btn-danger btn-sm"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>User Details</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="btn btn-close"
              >
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <div className="detail-label">Name:</div>
                <div>{selectedUser.first_name} {selectedUser.last_name}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">Email:</div>
                <div>{selectedUser.email}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">Date of Birth:</div>
                <div>{selectedUser.age}</div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => {
                  startEditUser(selectedUser);
                }} 
                className="btn btn-warning"
              >
                <FiEdit2 /> Edit
              </button>
              <button 
                onClick={() => deleteUser(selectedUser.id)} 
                className="btn btn-danger"
              >
                <FiTrash2 /> Delete
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className="btn btn-secondary"
              >
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;