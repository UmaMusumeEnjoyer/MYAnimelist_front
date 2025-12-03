// src/pages/AnimeListPage/AnimeListPage.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Import Child Components
import Sidebar from './components/Sidebar';
import AddAnimeModal from './components/AddAnimeModal';
import ListHeader from './components/ListHeader';
import UserAnimeGroup from './components/UserAnimeGroup';
import EditListModal from './components/EditListModal';
import UserSearchModal from './components/UserSearchModal';
import RequestModal from './components/RequestModal';
import RequestList from './components/RequestList';

import { 
  getCustomListItems, 
  getAnimeById, 
  addAnimeToCustomList, 
  deleteCustomList,
  getListMembers,   
  removeAnimeFromCustomList,
  removeMemberFromList,
  requestJoinList,
  requestEditList,
  getListRequests,
  // Import API phản hồi request
  respondToJoinRequest,
  respondToEditRequest
} from '../../services/api'; 
import './AnimeListPage.css';

const AnimeListPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); 
  const currentUsername = localStorage.getItem("username");
  
  const [currentPermission, setCurrentPermission] = useState(localStorage.getItem("permission_level"));

  const canEdit = currentPermission === "owner" || currentPermission === "edit";
  const isViewer = currentPermission === "view" || currentPermission === "viewer";

  // --- LIST INFO STATE ---
  const [listInfo, setListInfo] = useState(location.state?.listData || {
    list_name: "Loading...",
    description: "",
    is_private: false,
    color: "#3db4f2", 
    is_owner: false
  });

  // --- CONTENT STATE ---
  const [groupedAnime, setGroupedAnime] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- MEMBER & REQUEST STATE ---
  const [members, setMembers] = useState([]); 
  const [pendingRequests, setPendingRequests] = useState([]);

  // --- MODAL STATES ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalRoleType, setModalRoleType] = useState('viewer'); 
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('join');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // --- DELETE LOGIC STATES ---
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedAnimeIds, setSelectedAnimeIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const allAnimeInList = useMemo(() => {
    return Object.values(groupedAnime).flat();
  }, [groupedAnime]);

  // =================================================================
  // 1. DATA FETCHING
  // =================================================================

  const fetchMembersData = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getListMembers(id);
      const memberList = res.data.members || [];
      setMembers(memberList);

      if (currentUsername) {
        const currentUserData = memberList.find(m => m.username === currentUsername);
        if (currentUserData) {
          localStorage.setItem("permission_level", currentUserData.permission_level);
          setCurrentPermission(currentUserData.permission_level);
          setListInfo(prev => ({ ...prev, is_owner: currentUserData.is_owner }));
        } else {
          localStorage.removeItem("permission_level");
          setCurrentPermission(null);
          setListInfo(prev => ({ ...prev, is_owner: false }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch list members:", error);
    }
  }, [id, currentUsername]);

  const fetchRequestsData = useCallback(() => {
    if (listInfo.is_owner && id) {
      getListRequests(id)
        .then(res => {
          setPendingRequests(res.data.requests || []);
        })
        .catch(err => console.error("Failed to fetch requests", err));
    }
  }, [listInfo.is_owner, id]);

  useEffect(() => {
    fetchRequestsData();
  }, [fetchRequestsData]);

  const fetchListDetails = useCallback(() => {
    if (!id) return;
    setDeleteMode(false);
    setSelectedAnimeIds([]);

    getCustomListItems(id)
      .then(async (res) => {
        const data = res.data;
        setListInfo(prev => ({
          ...prev, 
          list_name: data.list_name || prev.list_name,
          description: data.description !== undefined ? data.description : prev.description,
          is_private: data.is_private !== undefined ? data.is_private : prev.is_private,
          color: data.color || prev.color 
        }));

        const items = data.anime_items || [];
        const detailedPromises = items.map((item) => 
          getAnimeById(item.anilist_id)
            .then((animeRes) => ({
                ...animeRes.data,
                _added_by: item.added_by,
                _added_date: item.added_date,
                _note: item.note,
                _anilist_id: item.anilist_id 
              }))
            .catch((err) => null)
        );

        const detailedAnimeList = await Promise.all(detailedPromises);
        
        const groups = {};
        detailedAnimeList.forEach((anime) => {
          if (anime) {
            const user = anime._added_by || "Unknown";
            if (!groups[user]) groups[user] = [];
            groups[user].push(anime);
          }
        });
        setGroupedAnime(groups);
      })
      .catch((err) => console.error("Error fetching list data:", err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchListDetails();     
    fetchMembersData(); 
  }, [fetchListDetails, fetchMembersData]);

  // =================================================================
  // 2. HANDLERS
  // =================================================================
  
  // [UPDATE] Đã sửa action thành 'approve'
  const handleAcceptRequest = async (request) => {
    if (!window.confirm(`Accept request from @${request.username}?`)) return;

    try {
      if (request.request_type === 'join') {
        // [Cite: api.js respondToJoinRequest]
        await respondToJoinRequest(id, request.request_id, 'approve'); // <-- 'approve'
        alert(`User @${request.username} has joined the list.`);
      } 
      else if (request.request_type === 'edit_permission' || request.request_type === 'edit') {
        // [Cite: api.js respondToEditRequest]
        await respondToEditRequest(id, request.request_id, 'approve'); // <-- 'approve'
        alert(`User @${request.username} is now an Editor.`);
      }

      fetchRequestsData(); 
      fetchMembersData();  
    } catch (error) {
      console.error("Accept failed:", error);
      alert("Failed to accept request. Please try again.");
    }
  };

  const handleRejectRequest = async (request) => {
    if (!window.confirm(`Reject request from @${request.username}?`)) return;

    try {
      if (request.request_type === 'join') {
        // [Cite: api.js respondToJoinRequest]
        await respondToJoinRequest(id, request.request_id, 'reject');
      } 
      else if (request.request_type === 'edit_permission' || request.request_type === 'edit') {
        // [Cite: api.js respondToEditRequest]
        await respondToEditRequest(id, request.request_id, 'reject');
      }

      fetchRequestsData(); 
    } catch (error) {
      console.error("Reject failed:", error);
      alert("Failed to reject request.");
    }
  };

  const handleEditListClick = () => {
    if (currentPermission !== "owner") {
      alert("You do not have permission to edit this list.");
      return;
    }
    setShowEditModal(true);
  };

  const handleUpdateSuccess = (updatedData) => {
    setListInfo(prev => ({ ...prev, ...updatedData }));
  };

  const handleDeleteList = async () => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        await deleteCustomList(id);
        navigate(-1); 
      } catch (error) {
        alert("An error occurred while deleting the list.");
      }
    }
  };

  const handleOpenJoinRequest = () => {
    setRequestType('join');
    setShowRequestModal(true);
  };

  const handleOpenEditRequest = () => {
    setRequestType('edit');
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (message) => {
    setIsSubmittingRequest(true);
    try {
      if (requestType === 'join') {
        await requestJoinList(id, message);
        alert("Your join request has been sent successfully!");
      } else if (requestType === 'edit') {
        await requestEditList(id, message);
        alert("Your edit access request has been sent successfully!");
      }
      setShowRequestModal(false);
    } catch (error) {
      console.error("Failed to send request:", error);
      const errorMsg = error.response?.data?.message || "Failed to send request.";
      alert(errorMsg);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleAddAnime = async (anime) => {
    try {
      const payload = {
        anilist_id: anime.anilist_id || anime.media?.id || anime.id,
        note: ""
      };
      await addAnimeToCustomList(id, payload);
      fetchListDetails();
    } catch (error) {
      console.error("Failed to add anime:", error);
      throw error; 
    }
  };

  const toggleDeleteMode = () => {
    if (deleteMode) setSelectedAnimeIds([]);
    setDeleteMode(!deleteMode);
  };

  const handleSelectAnime = (anilistId) => {
    if (!deleteMode) return;
    setSelectedAnimeIds(prev => 
      prev.includes(anilistId) ? prev.filter(id => id !== anilistId) : [...prev, anilistId]
    );
  };

  const handleConfirmDelete = async () => {
    if (selectedAnimeIds.length === 0) return;
    setIsDeleting(true);
    try {
      await Promise.all(selectedAnimeIds.map(aid => removeAnimeFromCustomList(id, aid)));
      fetchListDetails();
    } catch (error) {
      alert("Some items could not be removed.");
    } finally {
      setIsDeleting(false);
      setDeleteMode(false);
      setSelectedAnimeIds([]);
    }
  };

  const filterAnime = (list) => {
    if (!searchTerm) return list;
    return list.filter(anime => {
      const title = anime.name_romaji || anime.title_english || "";
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const handleOpenAddEditor = () => {
    setModalRoleType('editor');
    setShowUserModal(true);
  };

  const handleOpenAddViewer = () => {
    setModalRoleType('viewer');
    setShowUserModal(true);
  };

  const handleUserAdded = () => {
    fetchMembersData();
  };
  
  const handleRemoveMember = async (username) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove @${username} from this list?`);
    if (!confirmDelete) return;

    try {
      await removeMemberFromList(id, username);
      fetchMembersData();
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member. Please try again.");
    }
  };

  const currentUserHasItems = groupedAnime[currentUsername] && groupedAnime[currentUsername].length > 0;

  // =================================================================
  // 3. RENDER
  // =================================================================
  return (
    <div className="page-container">
      <div className="main-layout">
        <main className="content-area">
          <ListHeader listInfo={listInfo} listId={id}/>

          <div className="filter-bar-sticky">
             <div className="search-wrapper">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search in this list..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="anime-lists-container">
            {loading ? (
              <div className="loading-state">Loading anime details...</div>
            ) : Object.keys(groupedAnime).length > 0 ? (
              <>
                 {canEdit && !currentUserHasItems && (
                  <div className="user-group-section" style={{marginBottom: '30px'}}>
                    <div className="user-group-header">
                      <div className="user-group-title">
                        <span className="material-symbols-outlined">person</span>
                        <h3>Added by {currentUsername}</h3>
                      </div>
                    </div>
                    <div style={{
                        padding: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        border: '1px dashed rgba(255, 255, 255, 0.1)'
                    }}>
                        <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '0.95rem' }}>
                           You haven't added any anime to this list yet.
                        </p>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => setShowAddModal(true)}
                        >
                          <span className="material-symbols-outlined" style={{marginRight:'5px'}}>add</span>
                          Add Anime Now
                        </button>
                    </div>
                  </div>
                )}
                
                {Object.keys(groupedAnime)
                  .sort((a, b) => {
                      if (a === currentUsername) return -1;
                      if (b === currentUsername) return 1;
                      return 0; 
                  })
                  .map((user) => {
                    const userAnimeList = filterAnime(groupedAnime[user]);
                    if (userAnimeList.length === 0) return null;

                    return (
                      <UserAnimeGroup 
                        key={user}
                        user={user}
                        animeList={userAnimeList}
                        isCurrentUser={user === currentUsername}
                        canEdit={canEdit} 
                        deleteMode={deleteMode}
                        selectedAnimeIds={selectedAnimeIds}
                        isDeleting={isDeleting}
                        onOpenAddModal={() => setShowAddModal(true)}
                        onToggleDeleteMode={toggleDeleteMode}
                        onConfirmDelete={handleConfirmDelete}
                        onSelectAnime={handleSelectAnime}
                      />
                    );
                })}
              </>
            ) : (
              <div className="empty-state">
                <p>This list is empty.</p>
                {canEdit && (
                  <button 
                    className="btn btn-primary" 
                    style={{marginTop: '16px'}}
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Anime Now
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        <div className="sidebar-area">
          <div className="action-buttons sidebar-actions">
              {listInfo.is_owner ? (
                <>
                  <button className="btn btn-secondary" onClick={handleEditListClick}>
                     Edit List Details
                  </button>
                  <button className="btn btn-danger" onClick={handleDeleteList}>
                     Delete List
                  </button>
                </>
              ) : isViewer ? (
                <button 
                  className="btn btn-primary btn-icon" 
                  onClick={handleOpenEditRequest}
                >
                   <span className="material-symbols-outlined">edit_note</span>
                   Request Edit Access
                </button>
              ) : !currentPermission && (
                <button 
                  className="btn btn-primary btn-icon" 
                  onClick={handleOpenJoinRequest}
                  style={{ backgroundColor: 'var(--accent-green)' }}
                >
                   <span className="material-symbols-outlined">person_add</span>
                   Join Request
                </button>
              )}
          </div>
          
          <Sidebar 
            members={members} 
            onAddEditor={handleOpenAddEditor}
            onAddViewer={handleOpenAddViewer}
            onRemoveMember={handleRemoveMember}
          />

          {listInfo.is_owner && (
            <RequestList 
              requests={pendingRequests} 
              onAccept={handleAcceptRequest} 
              onReject={handleRejectRequest} 
              currentMembers={members}
            />
          )}

        </div>
      </div>
      
      <AddAnimeModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAddAnime={handleAddAnime} 
        currentList={allAnimeInList} 
      />

      <EditListModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        listId={id}
        initialData={listInfo}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <UserSearchModal 
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        listId={id}
        roleType={modalRoleType}
        currentMembers={members}
        onUserAdded={handleUserAdded}
      />

      <RequestModal 
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleSubmitRequest}
        title={requestType === 'join' ? "Join Request" : "Edit Access Request"}
        placeholder={
          requestType === 'join' 
            ? "Hello, I would like to join this list as a contributor..." 
            : "Please describe why you need edit permission..."
        }
        isLoading={isSubmittingRequest}
      />
    </div>
  );
};

export default AnimeListPage;