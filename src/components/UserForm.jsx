import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = ({ user, onClose, onUserCreated, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    address: {
      street: '',
      city: ''
    },
    company: {
      name: ''
    },
    website: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || `USER-${user.id}`, 
        address: {
          street: user.address?.street || '',
          city: user.address?.city || ''
        },
        company: {
          name: user.company?.name || ''
        },
        website: user.website || ''
      });
    } else {
      setFormData((prev) => ({ ...prev, username: `USER-${Date.now()}` })); 
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
   
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Name is required and must be at least 3 characters long.';
    }
    
   
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = 'A valid email is required.';
    }

  
    const phonePattern = /^\d{10}$/; 
    if (!formData.phone || !phonePattern.test(formData.phone)) {
      newErrors.phone = 'Phone number is required and must be 10 digits.';
    }

  
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username is required and must be at least 3 characters long.';
    }

    
    if (!formData.address.street) {
      newErrors.street = 'Street is required.';
    }
    if (!formData.address.city) {
      newErrors.city = 'City is required.';
    }

 
    if (formData.company.name && formData.company.name.length < 3) {
      newErrors.company = 'Company name must be at least 3 characters long if provided.';
    }

   
    if (formData.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website)) {
      newErrors.website = 'Website must be a valid URL if provided.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '' 
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value
      }
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      street: '',
      city: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; 
    }

    try {
      let response;
      if (user) {
       
        response = await axios.put(`https://jsonplaceholder.typicode.com/users/${user.id}`, {
          ...formData,
          id: user.id 
        });
        onUserUpdated(response.data);
      } else {

        response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
        onUserCreated(response.data);
      }
      onClose(); 
    } catch (error) {
      console.error('Error during form submission:', error.response ? error.response.data : error.message);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>{user ? 'Edit User' : 'Create New User'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Name"
          onChange={handleChange}
          required
        />
        {errors.name && <p className="error">{errors.name}</p>}
        
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}
        
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          placeholder="Phone"
          onChange={handleChange}
          required
        />
        {errors.phone && <p className="error">{errors.phone}</p>}
        
        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="Username"
          readOnly
        />
        {errors.username && <p className="error">{errors.username}</p>}
        
        <input
          type="text"
          name="street"
          value={formData.address.street}
          placeholder="Street"
          onChange={handleAddressChange}
          required
        />
        {errors.street && <p className="error">{errors.street}</p>}
        
        <input
          type="text"
          name="city"
          value={formData.address.city}
          placeholder="City"
          onChange={handleAddressChange}
          required
        />
        {errors.city && <p className="error">{errors.city}</p>}
        
        <input
          type="text"
          name="company"
          value={formData.company.name}
          placeholder="Company Name (Optional)"
          onChange={handleChange}
        />
        {errors.company && <p className="error">{errors.company}</p>}
        
        <input
          type="url"
          name="website"
          value={formData.website}
          placeholder="Website (Optional)"
          onChange={handleChange}
        />
        {errors.website && <p className="error">{errors.website}</p>}
        
        <button type="submit">{user ? 'Update User' : 'Create User'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default UserForm;
