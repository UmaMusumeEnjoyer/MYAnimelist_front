import React, { useState } from 'react';
import './RequestModal.css';

const RequestModal = ({ isOpen, onClose, onSubmit, title, placeholder, isLoading }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(message);
    setMessage(''); // Clear message sau khi submit
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content request-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="modal-body">
          <p className="input-label">Message (Optional):</p>
          <textarea 
            className="request-message-input"
            rows="4"
            placeholder={placeholder || "Why do you want to join/edit this list?"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;