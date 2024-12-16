import React from 'react';
import './Modal.css'; // You can import the modal-specific styles here

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className='modal'>
      <div onClick={onClose} className="overlay"></div>
      <div className='custom-modal-content'>
        <h4 style={{paddingTop: '10px'}}>{title}</h4>
        <div className='close-button'
          onClick={onClose} >X</div>
        {children}
      </div>
    </div>
  );
};

export default Modal;