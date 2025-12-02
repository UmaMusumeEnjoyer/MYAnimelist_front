import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Import Child Components
import Sidebar from './components/Sidebar';
import AddAnimeModal from './components/AddAnimeModal';
import ListHeader from './components/ListHeader';
import UserAnimeGroup from './components/UserAnimeGroup';
import EditListModal from './components/EditListModal';

import { collaborators } from '../../data/mockDataSearchPage';
import { 
  getCustomListItems, 
  getAnimeById, 
  addAnimeToCustomList, 
  deleteCustomList,
  getListMembers,   
  removeAnimeFromCustomList 
} from '../../services/api'; 
import './AnimeListPage.css';

const AnimeListPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); 
  const currentUsername = localStorage.getItem("username");
  
  // --- STATE ---
  const [listInfo, setListInfo] = useState(location.state?.listData || {
    list_name: "Loading...",
    description: "",
    is_private: false,
    color: "#3db4f2", 
    is_owner: false
  });

  const [groupedAnime, setGroupedAnime] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Delete Logic States
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedAnimeIds, setSelectedAnimeIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- 1. PERMISSIONS & DATA FETCHING ---
  const fetchUserPermissions = useCallback(async () => {
    if (!id || !currentUsername) return;
    try {
      const res = await getListMembers(id);
      const { members } = res.data; 
      const currentUserData = members.find(m => m.username === currentUsername);

      if (currentUserData) {
        localStorage.setItem("permission_level", currentUserData.permission_level);
        setListInfo(prev => ({ ...prev, is_owner: currentUserData.is_owner }));
      } else {
        localStorage.removeItem("permission_level");
        setListInfo(prev => ({ ...prev, is_owner: false }));
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
    fetchUserPermissions(); 
  }, [fetchListDetails, fetchUserPermissions]);

  // --- 2. HANDLERS ---
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

  // Delete Item Handlers
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

  // --- RENDER ---
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
          <Sidebar data={collaborators} />
        </div>
      </div>
      
      <AddAnimeModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAddAnime={handleAddAnime} 
      />

      <EditListModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        listId={id}
        initialData={listInfo}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default AnimeListPage;