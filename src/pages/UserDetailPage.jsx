import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../components/UserDetailPage.css';

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-detail">
      <h2>{user.name}</h2>
      <p><span>Email:</span> {user.email}</p>
      <p><span>Phone:</span> {user.phone}</p>
      <p><span>Address:</span> {user.address.street}, {user.address.city}</p>
      <p><span>Company:</span> {user.company.name}</p>
      <p><span>Website:</span> {user.website}</p>
    </div>
  );
};

export default UserDetailPage;
