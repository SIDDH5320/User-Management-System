import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ userId, deleteUser, closeModal }) => (
  <div className="modal">
    <p>Are you sure you want to delete this user?</p>
    <button onClick={() => deleteUser(userId)}>Yes</button>
    <button onClick={closeModal}>No</button>
  </div>
);

export default ConfirmModal;
