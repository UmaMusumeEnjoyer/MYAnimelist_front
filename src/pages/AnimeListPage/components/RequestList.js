import React, { useState, useMemo } from 'react';
import './RequestList.css';

// [UPDATE] Nhận thêm prop currentMembers từ AnimeListPage
const RequestList = ({ requests = [], onAccept, onReject, currentMembers = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Phân loại request
  const { joinRequests, editRequests } = useMemo(() => {
    const join = [];
    const edit = [];
    
    requests.forEach(req => {
      // API status phải là 'pending' mới hiển thị
      if (req.status !== 'pending') return;

      if (req.request_type === 'join') {
        join.push(req);
      } else if (req.request_type === 'edit_permission' || req.request_type === 'edit') {
        // [Cite: api.js requestEditList sử dụng type 'edit_permission']
        edit.push(req);
      }
    });

    return { joinRequests: join, editRequests: edit };
  }, [requests]);

  const totalCount = joinRequests.length + editRequests.length;

  // Nếu không có request nào thì ẩn luôn component
  if (totalCount === 0) return null;

  // [LOGIC MỚI] Kiểm tra điều kiện để hiển thị nút Accept
  const checkShowAccept = (req) => {
    // Tìm user trong danh sách thành viên hiện tại
    const existingMember = currentMembers.find(m => m.username === req.username);

    // LOGIC 1: Join Request
    // Nếu người dùng xin quyền join mà đang có username trong list (owner/editor/viewer) -> Ẩn Accept
    if (req.request_type === 'join') {
      if (existingMember) return false;
    }

    // LOGIC 2: Edit Request
    // Nếu người dùng xin quyền edit mà đang là owner hoặc editor -> Ẩn Accept
    if (req.request_type === 'edit_permission' || req.request_type === 'edit') {
      if (existingMember) {
        // Kiểm tra quyền hạn: owner hoặc editor
        const isEditorOrOwner = 
          existingMember.is_owner || 
          existingMember.permission_level === 'edit' || 
          existingMember.can_edit;
        
        if (isEditorOrOwner) return false;
      }
    }

    // Mặc định cho phép hiển thị
    return true;
  };

  const renderRequestItem = (req) => {
    const shouldShowAccept = checkShowAccept(req);

    return (
      <div key={req.request_id} className="request-item">
        <div className="req-user-row">
          <span className="req-username">@{req.username}</span>
          <span className="req-time">
            {new Date(req.requested_at).toLocaleDateString()}
          </span>
        </div>
        
        {req.message && <div className="req-msg">"{req.message}"</div>}
        
        <div className="req-actions">
          {/* [UPDATE] Chỉ hiển thị nút Accept nếu thoả mãn logic */}
          {shouldShowAccept && (
            <button 
              className="btn-req-action btn-accept"
              onClick={(e) => {
                e.stopPropagation();
                onAccept(req);
              }}
            >
              <span className="material-symbols-outlined" style={{fontSize: '16px'}}>check</span>
              Accept
            </button>
          )}
          
          {/* Nút Reject luôn hiển thị */}
          <button 
            className="btn-req-action btn-reject"
            onClick={(e) => {
              e.stopPropagation();
              onReject(req);
            }}
          >
            <span className="material-symbols-outlined" style={{fontSize: '16px'}}>close</span>
            Reject
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`request-list-container ${totalCount > 0 ? 'has-pending' : ''}`}>
      {/* Header Summary - Click để đóng mở */}
      <div className="request-summary" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="summary-title">
          <span className="material-symbols-outlined" style={{color: '#facc15'}}>notifications_active</span>
          Pending Requests
          <span className="badge-count">{totalCount}</span>
        </div>
        <span className={`material-symbols-outlined toggle-icon ${isExpanded ? 'expanded' : ''}`}>
          expand_more
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="request-content">
          {/* SECTION: JOIN REQUESTS */}
          {joinRequests.length > 0 && (
            <div className="req-group">
              <div className="req-section-title">
                <span className="material-symbols-outlined" style={{fontSize: '16px'}}>person_add</span>
                Join Requests
              </div>
              {joinRequests.map(renderRequestItem)}
            </div>
          )}

          {/* SECTION: EDIT REQUESTS */}
          {editRequests.length > 0 && (
            <div className="req-group">
              <div className="req-section-title">
                <span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit_note</span>
                Edit Access Requests
              </div>
              {editRequests.map(renderRequestItem)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestList;