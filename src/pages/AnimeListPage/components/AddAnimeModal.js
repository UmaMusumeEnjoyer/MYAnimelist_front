// src/components/AddAnimeModal.js
import React, { useState, useEffect } from 'react';
import { getUserAnimeList, searchAnimeByName } from '../../../services/api'; // [MỚI] Import search API
import AnimeCard from '../../../components/AnimeCard';
import './AddAnimeModal.css';

const AddAnimeModal = ({ isOpen, onClose, onAddAnime }) => {
    // State cho User Data (Danh sách có sẵn)
    const [userData, setUserData] = useState(null);
    
    // State cho Global Search (Tìm kiếm từ API)
    const [globalResults, setGlobalResults] = useState([]);
    const [isGlobalSearch, setIsGlobalSearch] = useState(false); // Flag để switch view

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [addingIds, setAddingIds] = useState([]); 
    const [addedIds, setAddedIds] = useState([]);   

    const statusKeys = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'];

    // [MỚI] Helper map data từ API search cho giống format AnimeCard cần
    const mapAnimeData = (rawItem) => ({
        id: rawItem.id,
        anilist_id: rawItem.id,
        title_romaji: rawItem.name_romaji || rawItem.romaji || rawItem.title_romaji,
        title_english: rawItem.name_english || rawItem.english || rawItem.title_english,
        cover_image: rawItem.cover_image || rawItem.cover,
        episodes: rawItem.airing_episodes || rawItem.episodes,
        average_score: rawItem.average_score,
        season: rawItem.season,
        // Giữ lại các trường gốc nếu cần
        ...rawItem
    });

    useEffect(() => {
        if (isOpen) {
            // Load danh sách user mặc định khi mở modal
            const username = localStorage.getItem("username");
            if (username) {
                setLoading(true);
                getUserAnimeList(username)
                    .then(res => {
                        setUserData(res.data);
                    })
                    .catch(err => {
                        console.error("Failed to fetch user list", err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        } else {
            // Reset khi đóng modal
            setAddingIds([]);
            setAddedIds([]);
            setSearchTerm('');
            setIsGlobalSearch(false);
            setGlobalResults([]);
        }
    }, [isOpen]);

    // [MỚI] Xử lý tìm kiếm Global
    const handleSearchAction = async () => {
        if (!searchTerm || searchTerm.trim() === '') {
            // Nếu rỗng, quay về chế độ xem User List
            setIsGlobalSearch(false);
            return;
        }

        setLoading(true);
        setIsGlobalSearch(true); // Chuyển sang mode search global

        try {
            const response = await searchAnimeByName(searchTerm);
            const rawCandidates = response.data.candidates || [];
            const mappedResults = rawCandidates.map(mapAnimeData);
            setGlobalResults(mappedResults);
        } catch (error) {
            console.error("Search failed in modal:", error);
            setGlobalResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchAction();
        }
    };

    // [MỚI] Xử lý input change: Nếu xóa hết chữ thì tự reset về list cũ
    const handleInputChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (val === '') {
            setIsGlobalSearch(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('add-anime-modal-overlay')) {
            onClose();
        }
    };

    const formatStatusTitle = (status) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const handleAddClick = async (e, anime) => {
        e.preventDefault(); 
        if (addingIds.includes(anime.id) || addedIds.includes(anime.id)) return;
        setAddingIds(prev => [...prev, anime.id]);

        try {
            if (onAddAnime) {
                await onAddAnime(anime);
                setAddedIds(prev => [...prev, anime.id]);
            }
        } catch (error) {
            console.error("Add failed in modal", error);
        } finally {
            setAddingIds(prev => prev.filter(id => id !== anime.id));
        }
    };

    // Helper render card để tái sử dụng
    const renderAnimeCard = (anime) => {
        const isAdding = addingIds.includes(anime.id);
        const isAdded = addedIds.includes(anime.id);

        return (
            <div key={anime.id} className="modal-card-wrapper">
                <AnimeCard
                    anime={{
                        ...anime,
                        episode_progress: undefined,
                        next_airing_ep: undefined
                    }}
                />
                <button
                    className={`btn-card-add ${isAdded ? 'added-success' : ''}`}
                    onClick={(e) => handleAddClick(e, anime)}
                    disabled={isAdding || isAdded}
                    title={isAdded ? "Added to list" : "Add to list"}
                >
                    {isAdding ? (
                        <span className="material-symbols-outlined spin-icon">progress_activity</span>
                    ) : isAdded ? (
                        <span className="material-symbols-outlined">check</span>
                    ) : (
                        <span className="material-symbols-outlined">add</span>
                    )}
                </button>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="add-anime-modal-overlay" onClick={handleOverlayClick}>
            <div className="add-anime-modal-content">
                <div className="add-anime-modal-header">
                    <div className="modal-search-wrapper">
                        {/* [MỚI] Thêm onClick cho icon search */}
                        <span 
                            className="material-symbols-outlined search-icon" 
                            onClick={handleSearchAction}
                            style={{cursor: 'pointer', pointerEvents: 'auto'}} // Cho phép click
                        >
                            search
                        </span>
                        <input
                            type="text"
                            className="modal-search-input"
                            placeholder="Search anime to add..." // Đổi placeholder cho hợp ngữ cảnh
                            value={searchTerm}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown} // Bắt sự kiện Enter
                            autoFocus
                        />
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="add-anime-modal-body">
                    {loading ? (
                        <div className="modal-loading">
                            <span className="material-symbols-outlined spin-icon" style={{marginRight: '10px'}}>progress_activity</span>
                            {isGlobalSearch ? "Searching database..." : "Loading your library..."}
                        </div>
                    ) : (
                        <>
                            {/* --- VIEW 1: GLOBAL SEARCH RESULTS --- */}
                            {isGlobalSearch ? (
                                <div className="modal-section">
                                    <h3 className="section-title">
                                        Search Results
                                        <span className="count-badge">{globalResults.length}</span>
                                    </h3>
                                    {globalResults.length > 0 ? (
                                        <div className="modal-grid">
                                            {globalResults.map(anime => renderAnimeCard(anime))}
                                        </div>
                                    ) : (
                                        <div className="modal-error">No results found for "{searchTerm}"</div>
                                    )}
                                </div>
                            ) : (
                                /* --- VIEW 2: USER EXISTING LIBRARY (Logic cũ) --- */
                                userData ? (
                                    statusKeys.map((status) => {
                                        // Logic lọc local cũ vẫn giữ nếu user không đang search global
                                        // Nhưng thực tế khi input rỗng ta mới show cái này, nên không cần filterList(userData[status]) nữa
                                        // Tuy nhiên giữ lại nếu muốn filter local, nhưng ở đây ta ưu tiên switch mode.
                                        const items = userData[status] || [];
                                        if (items.length === 0) return null;

                                        return (
                                            <div key={status} className="modal-section">
                                                <h3 className="section-title">
                                                    {formatStatusTitle(status)}
                                                    <span className="count-badge">{items.length}</span>
                                                </h3>

                                                <div className="modal-grid">
                                                    {items.map(anime => renderAnimeCard(anime))}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="modal-error">Could not load library data.</div>
                                )
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddAnimeModal;