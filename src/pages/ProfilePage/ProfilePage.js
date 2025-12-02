// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate, useParams } from 'react-router-dom'; // Thêm useParams
import ProfileBanner from './components/ProfileBanner'; 
import ActivityHistory from './components/ActivityHistory';
import ActivityFeed from './components/ActivityFeed';
import AnimeCard from '../../components/AnimeCard';
import { getUserCustomLists, createCustomList, getUserAnimeList } from '../../services/api'; 

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const navigate = useNavigate();
  
  // --- LOGIC XÁC ĐỊNH USER ---
  const { username: routeUsername } = useParams(); // Lấy param từ URL nếu có
  const loggedInUsername = localStorage.getItem('username'); // User đang đăng nhập

  // Username mục tiêu để fetch data
  // Nếu có routeUsername (vd: /user/abc) thì dùng abc, nếu không thì dùng user đăng nhập
  const targetUsername = routeUsername || loggedInUsername || "guest";
  
  // Kiểm tra xem có phải "Chính chủ" không để hiện nút Edit
  const isOwnProfile = !routeUsername || (routeUsername === loggedInUsername);

  // Fake User Info (Nếu bạn có API getProfileInfo, hãy gọi ở đây bằng targetUsername)
  const userDisplayName = targetUsername; // Tạm dùng username làm tên hiển thị
  const userAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlZjpoc6BcEHSBXN83B8niRWSjcbNE-DArpg&s";
  const userBio = "UmaMusumeEnjoyer · he/him";
  
  const [customLists, setCustomLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(false);
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

  // Logic Fetch Custom List - Dùng targetUsername
  const fetchCustomLists = () => {
    if (!targetUsername) return;
    setListsLoading(true);
    getUserCustomLists(targetUsername)
      .then((res) => setCustomLists(res.data && res.data.lists ? res.data.lists : []))
      .catch((err) => console.error(err))
      .finally(() => setListsLoading(false));
  };

  // Logic Fetch Favorites - Dùng targetUsername
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

  // Reset data khi chuyển qua user khác
  useEffect(() => {
    if (activeTab === 'Anime List') fetchCustomLists();
    // Reset các state khác nếu cần thiết khi đổi user
    setSelectedDate(null);
  }, [activeTab, targetUsername]); // Thêm targetUsername vào dependency

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

  return (
    <div className="profile-page">
      <div className="profile-layout">
        
        {/* === LEFT COLUMN: SIDEBAR === */}
        <div className="profile-sidebar">
          <div className="profile-avatar-wrapper">
            <img src={userAvatar} alt="Profile" className="profile-avatar" />
          </div>
          <div className="profile-names">
            <span className="profile-display-name">{userDisplayName}</span>
            <span className="profile-username">{targetUsername}</span>
          </div>
          
          <div className="profile-bio">{userBio}</div>
          
          {/* CHỈ HIỆN NÚT EDIT NẾU LÀ PROFILE CỦA CHÍNH MÌNH */}
          {isOwnProfile && (
            <button className="btn-edit-profile">Edit profile</button>
          )}
          
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
            <div className="meta-item">
               <svg className="meta-icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zM1.5 5.51v6.74c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.509L8 9.349 1.5 5.51z"></path></svg>
               <a href={`mailto:contact@${targetUsername}.com`} style={{color: 'inherit', textDecoration: 'none'}}>contact@{targetUsername}.com</a>
            </div>
             <div className="meta-item">
               <svg className="meta-icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>
               <a href="#" style={{color: 'inherit', textDecoration: 'none'}}>anilist.co/user/{targetUsername}</a>
            </div>
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
              <div className="activity-section-wrapper" style={{marginTop: 0}}>
                 <div className="section-header">
                    <div className="section-title">{totalContributions} contributions in the last year</div>
                 </div>
                 
                 {/* Cần đảm bảo ActivityHistory hỗ trợ prop user/username nếu API cần */}
                 <ActivityHistory 
                    username={targetUsername} 
                    onTotalCountChange={setTotalContributions}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                 />
              </div>

              <div className="activity-section-wrapper">
                <div className="section-header">
                  <div className="section-title">
                    {selectedDate ? `Activity on ${selectedDate}` : "Contribution activity"}
                  </div>
                  {selectedDate && (
                    <span 
                      className="link-view-all" 
                      style={{cursor: 'pointer'}} 
                      onClick={() => setSelectedDate(null)}
                    >
                      Show all activity
                    </span>
                  )}
                </div>
                 
                 {/* Cần đảm bảo ActivityFeed hỗ trợ prop username nếu API cần */}
                 <ActivityFeed username={targetUsername} filterDate={selectedDate} />
              </div>
            </>
          )}

          {activeTab === 'Anime List' && (
             <div className="custom-lists-container">
               <div className="section-header">
                 <h2 className="section-title" style={{fontSize: '20px', fontWeight: 600}}>
                   {isOwnProfile ? "My Custom Lists" : `${targetUsername}'s Lists`}
                 </h2>
                 {/* Ẩn nút New List nếu không phải chính chủ */}
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
                          <h3 className="list-name">{list.list_name}</h3>
                          <p className="list-desc">{list.description}</p>
                       </div>
                    ))}
                 </div>
               )}
             </div>
          )}

          {activeTab === 'Favorites' && (
            <div className="favorites-container">
               <div className="section-header">
                 <h2 className="section-title" style={{fontSize: '20px', fontWeight: 600}}>Favorites</h2>
               </div>

               {favLoading ? <div>Loading favorites...</div> : (
                 <div className="anime-grid-6">
                    {favoriteList.length > 0 ? (
                      favoriteList.map((anime) => (
                        <div key={anime.id || anime.anilist_id} className="grid-item">
                           <AnimeCard anime={anime} />
                        </div>
                      ))
                    ) : (
                      <div className="empty-text">No favorites found.</div>
                    )}
                 </div>
               )}
            </div>
          )}

        </div>
      </div>

      {/* Modal logic: Chỉ cho phép mở modal tạo list nếu là chính chủ */}
      {showCreateModal && isOwnProfile && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
           {/* ... Giữ nguyên phần nội dung modal ... */}
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