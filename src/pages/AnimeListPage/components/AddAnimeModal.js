// src/components/AddAnimeModal.js
import React, { useState, useEffect, useMemo } from 'react';
import { getUserAnimeList, searchAnimeByName } from '../../../services/api';
import AnimeCard from '../../../components/AnimeCard';
import './AddAnimeModal.css';

const AddAnimeModal = ({ isOpen, onClose, onAddAnime, currentList = [] }) => {
    const [userData, setUserData] = useState(null);
    const [globalResults, setGlobalResults] = useState([]);
    const [isGlobalSearch, setIsGlobalSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [addingIds, setAddingIds] = useState([]); 
    const [addedIds, setAddedIds] = useState([]);   

    const statusKeys = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'];

    // [FIX 1] Logic lấy ID cho danh sách hiện tại (currentList)
    const existingIds = useMemo(() => {
        const ids = new Set();
        if (currentList && Array.isArray(currentList)) {
            currentList.forEach(anime => {
                // Ưu tiên anilist_id vì data của bạn trả về { id: 2, anilist_id: 177175 }
                const rawId = anime.anilist_id || anime.media?.id || anime.id;
                if (rawId) ids.add(String(rawId));
            });
        }
        return ids;
    }, [currentList]);

    // [FIX 2] Hàm Map data chuẩn hóa: Ưu tiên anilist_id
    const mapAnimeData = (rawItem) => {
        // LOGIC QUAN TRỌNG:
        // 1. anilist_id: Ưu tiên số 1 (Dành cho User List của bạn trả về)
        // 2. media.id: Ưu tiên số 2 (Dành cho cấu trúc lồng nhau của Anilist gốc)
        // 3. id: Cuối cùng (Dành cho Search API trả về trực tiếp)
        const correctId = rawItem.anilist_id || rawItem.media?.id || rawItem.id;
        
        return {
            ...rawItem,
            // Ép ID về String để so sánh chuẩn xác
            id: String(correctId), 
            
            // Backup ID gốc
            anilist_id: rawItem.anilist_id || correctId, 
            
            // Map title linh hoạt (ưu tiên title_romaji phẳng từ JSON của bạn)
            title_romaji: rawItem.title_romaji || rawItem.title?.romaji || rawItem.name_romaji || rawItem.media?.title?.romaji,
            title_english: rawItem.title_english || rawItem.title?.english || rawItem.name_english || rawItem.media?.title?.english,
            
            // Map cover image (ưu tiên cover_image phẳng từ JSON của bạn)
            cover_image: rawItem.cover_image || rawItem.coverImage?.large || rawItem.cover || rawItem.media?.coverImage?.large,
            
            episodes: rawItem.episodes || rawItem.airing_episodes || rawItem.media?.episodes,
            average_score: rawItem.averageScore || rawItem.average_score || rawItem.media?.averageScore,
            season: rawItem.season || rawItem.media?.season,
        };
    };

    useEffect(() => {
        if (isOpen) {
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
            setAddingIds([]);
            setAddedIds([]);
            setSearchTerm('');
            setIsGlobalSearch(false);
            setGlobalResults([]);
        }
    }, [isOpen]);

    const handleSearchAction = async () => {
        if (!searchTerm || searchTerm.trim() === '') {
            setIsGlobalSearch(false);
            return;
        }

        setLoading(true);
        setIsGlobalSearch(true);

        try {
            const response = await searchAnimeByName(searchTerm);
            const rawCandidates = response.data.candidates || [];
            // Map kết quả search
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
        
        const animeIdStr = String(anime.id);

        if (addingIds.includes(animeIdStr) || addedIds.includes(animeIdStr) || existingIds.has(animeIdStr)) return;
        
        setAddingIds(prev => [...prev, animeIdStr]);

        try {
            if (onAddAnime) {
                await onAddAnime(anime);
                setAddedIds(prev => [...prev, animeIdStr]);
            }
        } catch (error) {
            console.error("Add failed in modal", error);
        } finally {
            setAddingIds(prev => prev.filter(id => id !== animeIdStr));
        }
    };

    const renderAnimeCard = (anime) => {
        const animeIdStr = String(anime.id); 
        
        const isAdding = addingIds.includes(animeIdStr);
        const isAlreadyInList = existingIds.has(animeIdStr);
        const isAddedSession = addedIds.includes(animeIdStr);
        const isAdded = isAlreadyInList || isAddedSession;

        return (
            <div key={animeIdStr} className="modal-card-wrapper">
                <AnimeCard
                    anime={{
                        ...anime,
                        // Xóa các trường progress để tránh hiển thị thanh tiến trình trong modal add
                        episode_progress: undefined,
                        next_airing_ep: undefined
                    }}
                />
                <button
                    className={`btn-card-add ${isAdded ? 'added-success' : ''}`}
                    onClick={(e) => handleAddClick(e, anime)}
                    disabled={isAdding || isAdded}
                    title={isAdded ? "Already in this list" : "Add to list"}
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
                        <span 
                            className="material-symbols-outlined search-icon" 
                            onClick={handleSearchAction}
                            style={{cursor: 'pointer', pointerEvents: 'auto'}}
                        >
                            search
                        </span>
                        <input
                            type="text"
                            className="modal-search-input"
                            placeholder="Search anime to add..."
                            value={searchTerm}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
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
                                userData ? (
                                    statusKeys.map((status) => {
                                        const rawItems = userData[status] || [];
                                        if (rawItems.length === 0) return null;

                                        // Map item trước khi render
                                        const normalizedItems = rawItems.map(mapAnimeData);

                                        return (
                                            <div key={status} className="modal-section">
                                                <h3 className="section-title">
                                                    {formatStatusTitle(status)}
                                                    <span className="count-badge">{normalizedItems.length}</span>
                                                </h3>

                                                <div className="modal-grid">
                                                    {normalizedItems.map(anime => renderAnimeCard(anime))}
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