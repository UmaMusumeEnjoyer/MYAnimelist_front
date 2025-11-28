// src/components/EditorModal.js
import React, { useState, useEffect } from 'react';
import './EditorModal.css';

// Thêm prop initialData vào đây
const EditorModal = ({ anime, isOpen, onClose, onSave, onDelete, initialData }) => {
  
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

  // =================================================================
  // [MỚI] USE EFFECT: Cập nhật Form khi Modal mở hoặc Data thay đổi
  // =================================================================
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // TRƯỜNG HỢP 1: Đã có dữ liệu từ API (User đang theo dõi anime này)
        // Map dữ liệu từ API (snake_case) vào State (camelCase)
        setFormData({
          status: initialData.watch_status || 'plan_to_watch',
          score: initialData.score || 0, // (Nếu API sau này có trả về score)
          progress: initialData.episode_progress || 0,
          startDate: initialData.start_date || '', // Nếu null thì để rỗng hoặc getTodayDate() tùy logic
          finishDate: initialData.finish_date || '',
          rewatches: initialData.total_rewatch || 0,
          notes: initialData.user_note || '',
          private: initialData.private || false,
          isFavorite: initialData.isFavorite || false
        });
      } else {
        // TRƯỜNG HỢP 2: Chưa có dữ liệu (Tạo mới)
        // Mặc định set status là 'watching' vì người dùng bấm nút Watching để mở modal
        setFormData({
          status: 'watching', 
          score: 0,
          progress: 0,
          startDate: getTodayDate(),
          finishDate: '',
          rewatches: 0,
          notes: '',
          private: false,
          isFavorite: false
        });
      }
    }
  }, [isOpen, initialData]); // Chạy lại khi Modal mở hoặc initialData thay đổi

  if (!isOpen) return null;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const toggleFavorite = () => {
    setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const handleSaveClick = () => {
    const apiPayload = {
      notify_email: true, 
      episode_progress: parseInt(formData.progress) || 0,
      watch_status: formData.status, // Giữ nguyên value từ option (đã là snake_case)
      isFavorite: formData.isFavorite,
      start_date: formData.startDate || new Date().toISOString().split('T')[0],
      finish_date: formData.finishDate || null,
      total_rewatch: parseInt(formData.rewatches) || 0,
      user_note: formData.notes
    };

    onSave(apiPayload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
            <button className="btn-close" onClick={onClose}>×</button>
            <div className="header-info">
                <img src={anime.cover_image} alt="thumb" className="modal-thumb" />
                <span className="modal-anime-title">{anime.name_romaji}</span>
            </div>
            <div className="header-actions">
                 <button 
                    className={`btn-icon ${formData.isFavorite ? 'active' : ''}`} 
                    onClick={toggleFavorite}
                 >
                    ♥
                 </button>
                 
                 <button className="btn-save" onClick={handleSaveClick}>Save</button>
            </div>
        </div>

        <div className="modal-body">
            <div className="form-split-layout">
                <div className="form-left-col">
                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            {/* Value ở đây nên để snake_case để khớp với API */}
                            <option value="plan_to_watch">Plan to watch</option>
                            <option value="watching">Watching</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                            <option value="on_hold">On Hold</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Score</label>
                        <input type="number" name="score" value={formData.score} onChange={handleChange} min="0" max="10" />
                    </div>
                    <div className="form-group">
                        <label>Episode Progress</label>
                        <input type="number" name="progress" value={formData.progress} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Finish Date</label>
                        <input type="date" name="finishDate" value={formData.finishDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Total Rewatches</label>
                        <input type="number" name="rewatches" value={formData.rewatches} onChange={handleChange} />
                    </div>
                    <div className="form-group full-width">
                        <label>Notes</label>
                        <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange}></textarea>
                    </div>
                </div>

                <div className="form-right-col">
                    <div className="form-group">
                        <label>Custom Lists</label>
                        <div className="custom-list-placeholder">No custom anime lists</div>
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input type="checkbox" name="private" checked={formData.private} onChange={handleChange} />
                            Private
                        </label>
                    </div>
                </div>
            </div>

            <div className="modal-footer">
                <button className="btn-delete" onClick={onDelete}>Delete</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditorModal;