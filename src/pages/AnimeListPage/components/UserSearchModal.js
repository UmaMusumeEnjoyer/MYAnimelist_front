import React, { useState, useEffect } from 'react';
import { searchUsers, addMemberToList, updateMemberPermission } from '../../../services/api'; 
import './UserSearchModal.css';

// Hook để delay gọi API khi gõ phím (500ms)
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const UserSearchModal = ({ isOpen, onClose, listId, roleType, onUserAdded, currentMembers = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState([]); // Track user đang được xử lý (xoay vòng)

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isEditorMode = roleType === 'editor'; // Xác định đang mở modal để add Editor hay Viewer

  // =================================================================
  // 1. SEARCH LOGIC
  // =================================================================
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await searchUsers(debouncedSearchTerm);
        // API trả về: { query: "...", count: X, results: [...] }
        if (res.data && Array.isArray(res.data.results)) {
          setResults(res.data.results);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search API failed:", error); 
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchTerm]);

  // Reset khi đóng modal
  const handleClose = () => {
    setSearchTerm('');
    setResults([]);
    onClose();
  };

  // =================================================================
  // 2. ACTION HANDLER (ADD / UPDATE PERMISSION)
  // =================================================================
  const handleAddUser = async (user) => {
    setProcessingIds(prev => [...prev, user.username]);
    
    // Kiểm tra xem user này đã có trong list chưa
    const existingMember = currentMembers.find(m => m.username === user.username);
    
    // Bảo vệ: Không bao giờ được tác động đến Owner
    if (existingMember && existingMember.is_owner) {
      alert("Cannot change permissions of the List Owner.");
      setProcessingIds(prev => prev.filter(id => id !== user.username));
      return;
    }

    try {
      if (isEditorMode) {
        // ---------------------------------------------
        // CASE A: MODE ADD EDITOR
        // ---------------------------------------------
        if (existingMember) {
          // TH1: Đã là thành viên (Viewer) -> Thăng cấp (Promote)
          await updateMemberPermission(listId, {
            username: user.username,
            can_edit: true
          });
        } else {
          // TH2: Chưa là thành viên -> Thêm mới làm Editor
          await addMemberToList(listId, {
            username: user.username,
            can_edit: true
          });
        }
      } else {
        // ---------------------------------------------
        // CASE B: MODE ADD VIEWER
        // ---------------------------------------------
        if (existingMember) {
          if (existingMember.can_edit) {
            // TH3: Đang là Editor -> Truất quyền (Demote) xuống Viewer
            await updateMemberPermission(listId, {
              username: user.username,
              can_edit: false
            });
          } else {
            // TH4: Đã là Viewer -> Không làm gì cả
            alert(`${user.username} is already a viewer.`);
            setProcessingIds(prev => prev.filter(id => id !== user.username));
            return; 
          }
        } else {
          // TH5: Chưa là thành viên -> Thêm mới làm Viewer
          await addMemberToList(listId, {
            username: user.username,
            permission_level: 'view'
          });
        }
      }

      // Refresh list ở component cha
      if (onUserAdded) onUserAdded(); 
      
    } catch (error) {
      console.error(error);
      alert(`Failed to process action for ${user.username}.`);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== user.username));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="user-modal-overlay" onClick={handleClose}>
      <div className="user-modal-content" onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="user-modal-header">
          <div className="modal-search-wrapper">
            <span className="material-symbols-outlined search-icon" 
                  style={{position: 'absolute', left: '12px', color: '#64748b'}}>
              search
            </span>
            <input 
              className="user-search-input"
              placeholder={`Search user to add as ${roleType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* BODY */}
        <div className="user-modal-body">
          {loading && <div className="modal-loading">Searching users...</div>}

          {!loading && results.length === 0 && !searchTerm && (
            <div className="modal-helper-text">
              Type a username to invite them as a 
              <strong style={{color: isEditorMode ? '#e85d75' : '#3db4f2'}}> {roleType}</strong>.
            </div>
          )}

          {!loading && results.length === 0 && searchTerm && (
            <div className="modal-helper-text">No users found.</div>
          )}

          <div className="user-grid">
            {results.map((user) => {
              const isProcessing = processingIds.includes(user.username);
              const avatarUrl = "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg"; // Placeholder avatar
              
              // Kiểm tra trạng thái hiện tại của user tìm được
              const existingMember = currentMembers.find(m => m.username === user.username);
              const isOwner = existingMember?.is_owner;

              // =============================================
              // LOGIC HIỂN THỊ NÚT (Dynamic Button)
              // =============================================
              let btnText = "Invite";
              let btnIcon = "person_add";
              let isDisabled = isProcessing || isOwner; 
              let btnClass = isEditorMode ? 'editor' : 'viewer'; // Class màu cơ bản

              if (existingMember) {
                if (isEditorMode) {
                   // --- Mode: Add Editor ---
                   if (existingMember.can_edit) {
                     // Đã là Editor/Owner -> Disabled
                     btnText = "Joined";
                     btnIcon = "check";
                     isDisabled = true;
                   } else {
                     // Đang là Viewer -> Cho phép Promote
                     btnText = "Promote";
                     btnIcon = "arrow_upward";
                   }
                } else {
                   // --- Mode: Add Viewer ---
                   if (existingMember.can_edit) {
                     // Đang là Editor -> Cho phép Demote
                     btnText = "Demote";
                     btnIcon = "arrow_downward";
                   } else {
                     // Đã là Viewer -> Disabled
                     btnText = "Joined";
                     btnIcon = "check";
                     isDisabled = true;
                   }
                }
              }

              return (
                <div key={user.id} className="user-card-item">
                  <div className="user-card-info">
                    <img src={avatarUrl} alt={user.username} className="user-card-avatar" />
                    <div>
                      <p className="user-card-name">
                        {user.username}
                        {user.email_verified && (
                          <span className="material-symbols-outlined" 
                            style={{fontSize: '14px', color: '#3db4f2', marginLeft: '4px', verticalAlign: 'middle'}}
                            title="Verified Email">
                            verified
                          </span>
                        )}
                      </p>
                      
                      <p className="user-card-handle">
                        {existingMember ? (
                           <span style={{color: '#94a3b8', fontStyle: 'italic'}}>
                             Currently: {isOwner ? 'Owner' : (existingMember.can_edit ? 'Editor' : 'Viewer')}
                           </span>
                        ) : (
                           <>Assign: <span style={{color: isEditorMode ? '#e85d75' : '#3db4f2', fontWeight: 'bold'}}>
                             {isEditorMode ? 'Editor' : 'Viewer'}
                           </span></>
                        )}
                      </p>
                    </div>
                  </div>

                  <button 
                    className={`btn-invite ${btnClass}`} 
                    onClick={() => handleAddUser(user)}
                    disabled={isDisabled}
                    title={isOwner ? "Cannot modify Owner" : ""}
                  >
                    {isProcessing ? (
                      <span className="material-symbols-outlined spin-icon" style={{fontSize: '18px'}}>sync</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>{btnIcon}</span>
                        {btnText}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;