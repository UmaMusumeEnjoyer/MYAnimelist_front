// src/components/EditorModalFooter.js
import React from 'react';

const EditorModalFooter = ({ onDelete }) => {
  return (
    <div className="modal-footer">
      <button className="btn-delete" onClick={onDelete}>Delete</button>
    </div>
  );
};

export default EditorModalFooter;