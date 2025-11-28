// src/components/EditorModal.js
import React, { useState } from 'react';
import './EditorModal.css';

const EditorModal = ({ anime, isOpen, onClose, onSave, onDelete }) => {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  // 1. Thêm isFavorite vào state mặc định
  const [formData, setFormData] = useState({
    status: 'Plan to watch',
    score: 0,
    progress: 0,
    startDate: getTodayDate(),
    finishDate: '',
    rewatches: 0,
    notes: '',
    private: false,
    isFavorite: false // Mặc định là false
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  // 2. Logic toggle trái tim
  const toggleFavorite = () => {
    setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  // 3. Chuẩn bị dữ liệu chuẩn API và gọi onSave
  const handleSaveClick = () => {
    // Mapping dữ liệu sang format API yêu cầu
    const apiPayload = {
      notify_email: true, // Mặc định true hoặc lấy từ settings
      episode_progress: parseInt(formData.progress) || 0,
      // Chuyển "Plan to watch" -> "plan_to_watch" (snake_case lowercase)
      watch_status: formData.status.toLowerCase().replace(/\s+/g, '_'), 
      isFavorite: formData.isFavorite,
      // Date input trả về rỗng '' nếu không chọn, API thường cần null
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
                 {/* Nút Trái tim:
                    - Thêm class 'active' nếu isFavorite = true
                    - Gọi hàm toggleFavorite khi click 
                 */}
                 <button 
                    className={`btn-icon ${formData.isFavorite ? 'active' : ''}`} 
                    onClick={toggleFavorite}
                 >
                    ♥
                 </button>
                 
                 <button className="btn-save" onClick={handleSaveClick}>Save</button>
            </div>
        </div>

        {/* ... (Phần modal-body giữ nguyên như cũ) ... */}
        <div className="modal-body">
            {/* ... code form giữ nguyên ... */}
            <div className="form-split-layout">
                <div className="form-left-col">
                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
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