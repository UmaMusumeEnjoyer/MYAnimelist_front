import React, { useState, useEffect } from 'react';
import { updateCustomList } from '../../../services/api';
import './EditListModal.css';

const EditListModal = ({ isOpen, onClose, listId, initialData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    list_name: "",
    description: "",
    is_private: false,
    color: "#000000"
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        list_name: initialData.list_name || "",
        description: initialData.description || "",
        is_private: initialData.is_private || false,
        color: initialData.color || "#3db4f2"
      });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomList(listId, formData);
      onUpdateSuccess(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update list:", error);
      alert("An error occurred while updating the list.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-list-overlay" onClick={onClose}>
      <div className="edit-list-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="edit-list-title">Edit List Details</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>List Name</label>
            <input 
              type="text" 
              name="list_name" 
              value={formData.list_name} 
              onChange={handleInputChange} 
              placeholder="Enter list name..."
              required 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="Enter a description..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Theme Color</label>
              <div className="color-input-wrapper">
                <input 
                  type="color" 
                  name="color" 
                  value={formData.color} 
                  onChange={handleInputChange} 
                />
                <span className="color-value">{formData.color}</span>
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="is_private" 
                  checked={formData.is_private} 
                  onChange={handleInputChange} 
                />
                Private List
              </label>
            </div>
          </div>

          <div className="edit-list-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListModal;