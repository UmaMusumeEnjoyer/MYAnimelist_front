// src/components/EditorModalFooter.js
import React from 'react';

const EditorModalFooter = ({ onDelete }) => {
  return (
    <div className="editor-modal-footer">
      <button className="editor-modal-btn-delete" onClick={onDelete}>Delete</button>
    </div>
  );
};

export default EditorModalFooter;