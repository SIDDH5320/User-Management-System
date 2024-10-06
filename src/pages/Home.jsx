import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserCreated = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setIsFormOpen(false);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setIsFormOpen(false);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openForm = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  return (
    <div>
      <h1>User Management</h1>
      <button onClick={openForm} className="btn add-user">Add User</button>

      {isFormOpen && (
        <div className="modal">
          <UserForm
            user={selectedUser}
            onClose={closeForm}
            onUserCreated={handleUserCreated}
            onUserUpdated={handleUserUpdated}
          />
        </div>
      )}

      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Home;
