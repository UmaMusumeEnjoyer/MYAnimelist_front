import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Import Child Components
import Sidebar from './components/Sidebar';
import AddAnimeModal from './components/AddAnimeModal';
import ListHeader from './components/ListHeader';
import UserAnimeGroup from './components/UserAnimeGroup';
import EditListModal from './components/EditListModal';
import UserSearchModal from './components/UserSearchModal'; // [NEW] Component tìm user

import { 
  getCustomListItems, 
  getAnimeById, 
  addAnimeToCustomList, 
  deleteCustomList,
  getListMembers,   
  removeAnimeFromCustomList,
  removeMemberFromList 
} from '../../services/api'; 
import './AnimeListPage.css';

const AnimeListPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); 
  const currentUsername = localStorage.getItem("username");
  
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
  
  // --- MEMBER & PERMISSION STATE ---
  const [members, setMembers] = useState([]); // [NEW] Lưu danh sách member thô từ API

  // --- MODAL STATES ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // [NEW] Modal User Search States
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalRoleType, setModalRoleType] = useState('viewer'); // 'editor' | 'viewer'

  // --- DELETE LOGIC STATES ---
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedAnimeIds, setSelectedAnimeIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // =================================================================
  // 1. DATA FETCHING
  // =================================================================

  // [UPDATED] Hàm vừa lấy member cho Sidebar, vừa check quyền Owner cho trang
  const fetchMembersData = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getListMembers(id);
      const memberList = res.data.members || [];
      
      // Update State cho Sidebar render
      setMembers(memberList);

      // Check quyền user hiện tại
      if (currentUsername) {
        const currentUserData = memberList.find(m => m.username === currentUsername);
        if (currentUserData) {
          localStorage.setItem("permission_level", currentUserData.permission_level);
          setListInfo(prev => ({ ...prev, is_owner: currentUserData.is_owner }));
        } else {
          localStorage.removeItem("permission_level");
          setListInfo(prev => ({ ...prev, is_owner: false }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch list members:", error);
    }
  }, [id, currentUsername]);

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
        
        // Group anime by User
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

  // --- List Management ---
  const handleEditListClick = () => {
    if (localStorage.getItem("permission_level") !== "owner") {
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

  // --- Anime Management ---
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
      const title = anime.title_romaji || anime.title_english || "";
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // --- [NEW] User Modal Handlers ---
  const handleOpenAddEditor = () => {
    // Tùy chọn: check quyền Owner trước khi mở
    // if (!listInfo.is_owner) return alert("Only Owner can add Editors");
    setModalRoleType('editor');
    setShowUserModal(true);
  };

  const handleOpenAddViewer = () => {
    setModalRoleType('viewer');
    setShowUserModal(true);
  };

  const handleUserAdded = () => {
    // Refresh danh sách member sau khi add thành công
    fetchMembersData();
  };
  
  const handleRemoveMember = async (username) => {
    // Xác nhận trước khi xóa
    const confirmDelete = window.confirm(`Are you sure you want to remove @${username} from this list?`);
    if (!confirmDelete) return;

    try {
      await removeMemberFromList(id, username);
      // Refresh danh sách sau khi xóa thành công
      fetchMembersData();
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member. Please try again.");
    }
  };

  // =================================================================
  // 3. RENDER
  // =================================================================
  return (
    <div className="page-container">
      <div className="main-layout">
        <main className="content-area">
          
          <ListHeader listInfo={listInfo} />

          {/* Sticky Search Bar */}
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
              Object.keys(groupedAnime).map((user) => {
                const userAnimeList = filterAnime(groupedAnime[user]);
                if (userAnimeList.length === 0) return null;

                return (
                  <UserAnimeGroup 
                    key={user}
                    user={user}
                    animeList={userAnimeList}
                    isCurrentUser={user === currentUsername}
                    deleteMode={deleteMode}
                    selectedAnimeIds={selectedAnimeIds}
                    isDeleting={isDeleting}
                    onOpenAddModal={() => setShowAddModal(true)}
                    onToggleDeleteMode={toggleDeleteMode}
                    onConfirmDelete={handleConfirmDelete}
                    onSelectAnime={handleSelectAnime}
                  />
                );
              })
            ) : (
              <div className="empty-state">
                <p>This list is empty.</p>
                <button 
                  className="btn btn-primary" 
                  style={{marginTop: '16px'}}
                  onClick={() => setShowAddModal(true)}
                >
                  Add Anime Now
                </button>
              </div>
            )}
          </div>
        </main>

        {/* SIDEBAR AREA */}
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
              ) : (
                <button className="btn btn-primary btn-icon">
                   <span className="material-symbols-outlined">share</span>
                   Share List
                </button>
              )}
          </div>
          
          {/* Sidebar nhận members và handlers mở modal */}
          <Sidebar 
            members={members} 
            onAddEditor={handleOpenAddEditor}
            onAddViewer={handleOpenAddViewer}
          />
        </div>
      </div>
      
      {/* ADD ANIME MODAL */}
      <AddAnimeModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAddAnime={handleAddAnime} 
      />

      {/* EDIT LIST INFO MODAL */}
      <EditListModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        listId={id}
        initialData={listInfo}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* [NEW] USER SEARCH MODAL */}
      <UserSearchModal 
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        listId={id}
        roleType={modalRoleType}
        currentMembers={members}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default AnimeListPage;