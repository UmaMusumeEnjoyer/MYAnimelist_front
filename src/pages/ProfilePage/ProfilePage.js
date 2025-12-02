// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileBanner from './components/ProfileBanner'; 
import ActivityHistory from './components/ActivityHistory';
import ActivityFeed from './components/ActivityFeed';
import AnimeCard from '../../components/AnimeCard';
import { getUserCustomLists, createCustomList, getUserAnimeList, getListsLikedByUser } from '../../services/api'; 

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const navigate = useNavigate();
  
  // --- LOGIC XÁC ĐỊNH USER ---
  const { username: routeUsername } = useParams(); 
  const loggedInUsername = localStorage.getItem('username'); 

  // Username mục tiêu để fetch data
  const targetUsername = routeUsername || loggedInUsername || "guest";
  
  // Kiểm tra xem có phải "Chính chủ" không
  const isOwnProfile = !routeUsername || (routeUsername === loggedInUsername);

  // Fake User Info
  const userDisplayName = targetUsername; 
  const userAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlZjpoc6BcEHSBXN83B8niRWSjcbNE-DArpg&s";
  const userBio = "UmaMusumeEnjoyer · he/him";
  
  const [customLists, setCustomLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(false);
  
  const [likedLists, setLikedLists] = useState([]);
  const [likedListsLoading, setLikedListsLoading] = useState(false);

  const [favoriteList, setFavoriteList] = useState([]);
  const [favLoading, setFavLoading] = useState(false);
  const [totalContributions, setTotalContributions] = useState(0);

  const [selectedDate, setSelectedDate] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListData, setNewListData] = useState({
    list_name: '', description: '', is_private: false, color: '#3db4f2'
  });
  const [creating, setCreating] = useState(false);

  const handleTabChange = (tabName) => setActiveTab(tabName);

  const handleDateSelect = (date) => {
    if (selectedDate === date) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  // Logic Fetch Custom List
  const fetchCustomLists = () => {
    if (!targetUsername) return;
    setListsLoading(true);
    getUserCustomLists(targetUsername)
      .then((res) => setCustomLists(res.data && res.data.lists ? res.data.lists : []))
      .catch((err) => console.error(err))
      .finally(() => setListsLoading(false));
  };

  // Logic Fetch Liked Lists
  const fetchLikedLists = async () => {
    if (!targetUsername) return;

    setLikedListsLoading(true);
    try {
      const payload = {
        username: targetUsername,
        limit: 20,
        offset: 0
      };
      
      const res = await getListsLikedByUser(payload);
      if (res.data && res.data.liked_lists) {
        setLikedLists(res.data.liked_lists);
      } else {
        setLikedLists([]);
      }
    } catch (error) {
      console.error("Failed to fetch liked lists:", error);
    } finally {
      setLikedListsLoading(false);
    }
  };

  // Logic Fetch Favorites
  useEffect(() => {
    if (activeTab === 'Favorites') {
      const fetchFavorites = async () => {
        if (!targetUsername) return;
        setFavLoading(true);
        try {
            const res = await getUserAnimeList(targetUsername);
            const data = res.data;
            const allAnime = [
              ...(data.watching || []), ...(data.completed || []),
              ...(data.on_hold || []), ...(data.dropped || []), ...(data.plan_to_watch || [])
            ];
            const filteredFavorites = allAnime.filter(anime => anime.isFavorite === true);
            setFavoriteList(filteredFavorites); 
        } catch (err) {
            console.error("Failed to fetch favorites:", err);
            setFavoriteList([]);
        } finally {
            setFavLoading(false);
        }
      };
      fetchFavorites();
    }
  }, [activeTab, targetUsername]);

  // Reset data
  useEffect(() => {
    if (activeTab === 'Anime List') {
      fetchCustomLists();
      if (isOwnProfile) {
        fetchLikedLists();
      }
    }
    setSelectedDate(null);
  }, [activeTab, targetUsername, isOwnProfile]);

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createCustomList(newListData);
      setShowCreateModal(false);
      setNewListData({ list_name: '', description: '', is_private: false, color: '#3db4f2' });
      fetchCustomLists();
    } catch (error) {
      alert("Error creating list.");
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewListData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Helper để render badge Private
  const PrivateBadge = () => (
    <span style={{
      fontSize: '10px',
      marginLeft: '8px',
      border: '1px solid var(--border-color)',
      padding: '2px 6px',
      borderRadius: '10px',
      color: 'var(--text-secondary)',
      verticalAlign: 'middle',
      fontWeight: 'normal'
    }}>
      Private
    </span>
  );

  return (
    <div className="profile-page">
      <div className="profile-layout">
        
        {/* === LEFT COLUMN: SIDEBAR === */}
        <div className="profile-sidebar">
          {/* ... Phần Sidebar giữ nguyên ... */}
          <div className="profile-avatar-wrapper">
            <img src={userAvatar} alt="Profile" className="profile-avatar" />
          </div>
          <div className="profile-names">
            <span className="profile-display-name">{userDisplayName}</span>
            <span className="profile-username">{targetUsername}</span>
          </div>
          <div className="profile-bio">{userBio}</div>
          {isOwnProfile && <button className="btn-edit-profile">Edit profile</button>}
          
          <div className="profile-stats">
            <span><a href="#followers" className="stat-highlight">7</a> followers</span>
            <span>·</span>
            <span><a href="#following" className="stat-highlight">10</a> following</span>
          </div>

          <div className="profile-meta">
            <div className="meta-item">
              <svg className="meta-icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 010-7.072v.001zm-4.95 4.95a2.5 2.5 0 100-3.536 2.5 2.5 0 000 3.536z"></path></svg>
              <span>Đà Nẵng, Việt Nam</span>
            </div>
            {/* ... Other meta items ... */}
          </div>
          <div className="separator"></div>
          <div className="section-title" style={{fontWeight: 600}}>Highlights</div>
          <div style={{marginTop: '8px'}}>
             <span style={{border: '1px solid var(--border-color)', borderRadius: '20px', padding: '2px 8px', fontSize: '12px', color: '#a371f7'}}>✦ PRO</span>
          </div>
        </div>

        {/* === RIGHT COLUMN: MAIN CONTENT === */}
        <div className="profile-content">
          <ProfileBanner activeTab={activeTab} onTabChange={handleTabChange} />

          {activeTab === 'Overview' && (
            <>
              {/* ... Phần Overview giữ nguyên ... */}
              <div className="activity-section-wrapper" style={{marginTop: 0}}>
                 <div className="section-header">
                    <div className="section-title">{totalContributions} contributions in the last year</div>
                 </div>
                 <ActivityHistory 
                    username={targetUsername} 
                    onTotalCountChange={setTotalContributions}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                 />
              </div>
              <div className="activity-section-wrapper">
                 <ActivityFeed username={targetUsername} filterDate={selectedDate} />
              </div>
            </>
          )}

          {activeTab === 'Anime List' && (
             <>
               {/* 1. My Custom Lists */}
               <div className="custom-lists-container">
                 <div className="section-header">
                   <h2 className="section-title" style={{fontSize: '20px', fontWeight: 600}}>
                     {isOwnProfile ? "My Custom Lists" : `${targetUsername}'s Lists`}
                   </h2>
                   {isOwnProfile && (
                     <button className="btn-edit-profile" style={{width: 'auto'}} onClick={() => setShowCreateModal(true)}>
                       New List
                     </button>
                   )}
                 </div>
                 
                 {listsLoading ? <div>Loading...</div> : (
                   <div className="custom-list-grid">
                      {customLists.map(list => (
                         <div key={list.list_id} className="custom-list-card" onClick={() => navigate(`/list/${list.list_id}`, { state: { listData: list } })}>
                            <h3 className="list-name">
                              {list.list_name}
                              {/* Hiển thị Private Badge */}
                              {list.is_private && <PrivateBadge />}
                            </h3>
                            <p className="list-desc">{list.description}</p>
                         </div>
                      ))}
                      {customLists.length === 0 && <div className="empty-text">No custom lists found.</div>}
                   </div>
                 )}
               </div>

               {/* 2. Liked Lists */}
               {isOwnProfile && (
                 <div className="custom-lists-container" style={{ marginTop: '40px' }}>
                   <div className="section-header">
                     <h2 className="section-title" style={{fontSize: '20px', fontWeight: 600}}>
                       Liked Lists
                     </h2>
                   </div>
                   
                   {likedListsLoading ? <div>Loading liked lists...</div> : (
                     <div className="custom-list-grid">
                        {likedLists.map(list => (
                           <div key={list.list_id} className="custom-list-card" onClick={() => navigate(`/list/${list.list_id}`, { state: { listData: list } })}>
                              <h3 className="list-name">
                                {list.list_name}
                                {/* Hiển thị Private Badge */}
                                {list.is_private && <PrivateBadge />}
                              </h3>
                              <p className="list-desc">{list.description}</p>
                              <div style={{marginTop: '8px', fontSize: '11px', color: 'var(--text-secondary)'}}>
                                 ❤️ {list.like_count}
                              </div>
                           </div>
                        ))}
                        {likedLists.length === 0 && <div className="empty-text">No liked lists yet.</div>}
                     </div>
                   )}
                 </div>
               )}
             </>
          )}

          {/* ... Phần Favorites giữ nguyên ... */}
          {activeTab === 'Favorites' && (
            <div className="favorites-container">
               <div className="section-header">
                 <h2 className="section-title" style={{fontSize: '20px', fontWeight: 600}}>Favorites</h2>
               </div>
               {/* ... */}
               {favLoading ? <div>Loading...</div> : (
                 <div className="anime-grid-6">
                    {favoriteList.map((anime) => (
                      <div key={anime.id || anime.anilist_id} className="grid-item">
                          <AnimeCard anime={anime} />
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Create List - Có thêm checkbox Private */}
      {showCreateModal && isOwnProfile && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
             <h3 style={{marginTop: 0, color: 'var(--text-main)'}}>Create New List</h3>
             <form onSubmit={handleSubmitCreate}>
                <div className="form-group">
                   <label style={{display: 'block', marginBottom: '5px', color: 'var(--text-main)'}}>List Name</label>
                   <input 
                      type="text" name="list_name" required
                      value={newListData.list_name} onChange={handleInputChange}
                      style={{width: '100%', padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px'}}
                   />
                </div>
                <div className="form-group" style={{marginTop: '10px'}}>
                   <label style={{display: 'block', marginBottom: '5px', color: 'var(--text-main)'}}>Description</label>
                   <textarea 
                      name="description" 
                      value={newListData.description} onChange={handleInputChange}
                      style={{width: '100%', padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px'}}
                   />
                </div>
                
                {/* Checkbox Private */}
                <div className="form-group" style={{marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                   <input 
                      type="checkbox" name="is_private" id="is_private"
                      checked={newListData.is_private} onChange={handleInputChange}
                   />
                   <label htmlFor="is_private" style={{color: 'var(--text-main)', fontSize: '14px'}}>Make this list private</label>
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                   <button type="button" onClick={() => setShowCreateModal(false)} style={{padding: '6px 12px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer'}}>Cancel</button>
                   <button type="submit" style={{padding: '6px 12px', background: 'var(--accent-green)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer'}} disabled={creating}>Create</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;