// src/components/EditorModal.js
import React, { useState, useEffect } from 'react';
import './EditorModal.css';
import { updateUserAnimeFollow, deleteUserAnimeFollow } from '../../../../services/api';

import EditorModalHeader from './EditorModalHeader';
import EditorModalForm from './EditorModalForm';
import EditorModalFooter from './EditorModalFooter';

const EditorModal = ({ anime, isOpen, onClose, onSave, onDelete, initialData }) => {
  
  const isEditMode = !!initialData && initialData.is_following;

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
     status: 'plan_to_watch',
     score: 0,
     progress: 0,
     startDate: getTodayDate(),
     finishDate: '',
     rewatches: 0,
     notes: '',
     private: false,
     isFavorite: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        status: initialData.watch_status || 'plan_to_watch',
        score: initialData.score || 0,
        progress: initialData.episode_progress || 0,
        startDate: initialData.start_date || getTodayDate(),
        finishDate: initialData.finish_date || '',
        rewatches: initialData.total_rewatch || 0,
        notes: initialData.user_note || '',
        private: initialData.private || false,
        isFavorite: initialData.isFavorite || false
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const toggleFavorite = () => {
    setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const handleSaveClick = async () => {
      if (isEditMode) {
      const updatePayload = {
        episode_progress: parseInt(formData.progress) || 0,
        watch_status: formData.status,
        isFavorite: formData.isFavorite,
        user_note: formData.notes
      };

      try {
        await updateUserAnimeFollow(anime.id, updatePayload);
        onSave(updatePayload, true);
      } catch (error) {
        console.error("Failed to update anime status:", error);
        alert("Có lỗi xảy ra khi cập nhật!");
      }

    } else {
      const apiPayload = {
        notify_email: true,
        episode_progress: parseInt(formData.progress) || 0,
        watch_status: formData.status,
        isFavorite: formData.isFavorite,
        start_date: formData.startDate || new Date().toISOString().split('T')[0],
        finish_date: formData.finishDate || null,
        total_rewatch: parseInt(formData.rewatches) || 0,
        user_note: formData.notes
      };

      onSave(apiPayload, false);
    }
  };

  const handleDeleteClick = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${anime.title?.romaji || anime.title?.english || 'anime này'}" khỏi danh sách?`)) {
      return;
    }

    try {
      await deleteUserAnimeFollow(anime.id);
      if (onDelete) {
        onDelete(anime.id); 
      }
      onClose();
    } catch (error) {
      console.error("Failed to delete anime:", error);
      alert("Có lỗi xảy ra khi xóa anime!");
    }
  };

  return (
    <div className="editor-modal-overlay" onClick={onClose}>
      <div className="editor-modal-content" onClick={e => e.stopPropagation()}>
        
        <EditorModalHeader 
          anime={anime}
          onClose={onClose}
          onSave={handleSaveClick}
          isFavorite={formData.isFavorite}
          toggleFavorite={toggleFavorite}
        />

        <div className="editor-modal-body">
          <EditorModalForm 
            formData={formData}
            handleChange={handleChange}
            isEditMode={isEditMode}
          />
          
          {isEditMode && <EditorModalFooter onDelete={handleDeleteClick} />}
        </div>
      
      </div>
    </div>
  );
};

export default EditorModal;