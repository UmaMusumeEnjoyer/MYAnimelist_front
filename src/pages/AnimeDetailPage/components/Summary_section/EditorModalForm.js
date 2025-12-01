// src/components/EditorModalForm.js
import React from 'react';

const EditorModalForm = ({ formData, handleChange, isEditMode }) => {
  return (
    <div className="editor-modal-form-split-layout">
      <div className="editor-modal-form-left-col">
        <div className="editor-modal-form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="plan_to_watch">Plan to watch</option>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>

        <div className="editor-modal-form-group">
          <label>Score</label>
          <input 
            type="number" 
            name="score" 
            value={formData.score} 
            onChange={handleChange} 
            min="0" max="10" 
            disabled={isEditMode} 
            className={isEditMode ? 'editor-modal-input-disabled' : ''}
          />
        </div>

        <div className="editor-modal-form-group">
          <label>Episode Progress</label>
          <input 
            type="number" 
            name="progress" 
            value={formData.progress} 
            onChange={handleChange} 
          />
        </div>

        <div className="editor-modal-form-group">
          <label>Start Date</label>
          <input 
            type="date" 
            name="startDate" 
            value={formData.startDate} 
            onChange={handleChange}
            disabled={isEditMode}
            className={isEditMode ? 'editor-modal-input-disabled' : ''}
          />
        </div>

        <div className="editor-modal-form-group">
          <label>Finish Date</label>
          <input 
            type="date" 
            name="finishDate" 
            value={formData.finishDate} 
            onChange={handleChange}
            disabled={isEditMode}
            className={isEditMode ? 'editor-modal-input-disabled' : ''}
          />
        </div>

        <div className="editor-modal-form-group">
          <label>Total Rewatches</label>
          <input 
            type="number" 
            name="rewatches" 
            value={formData.rewatches} 
            onChange={handleChange}
            disabled={isEditMode}
            className={isEditMode ? 'editor-modal-input-disabled' : ''}
          />
        </div>

        <div className="editor-modal-form-group full-width">
          <label>Notes</label>
          <textarea 
            name="notes" 
            rows="3" 
            value={formData.notes} 
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      <div className="editor-modal-form-right-col">
        <div className="editor-modal-form-group">
          <label>Custom Lists</label>
          <div className="editor-modal-list-placeholder">No custom anime lists</div>
        </div>
        <div className="editor-modal-form-group editor-modal-checkbox-group">
          <label style={{ opacity: isEditMode ? 0.5 : 1 }}>
            <input 
              type="checkbox" 
              name="private" 
              checked={formData.private} 
              onChange={handleChange}
              disabled={isEditMode}
            />
            Private
          </label>
        </div>
      </div>
    </div>
  );
};

export default EditorModalForm;