// src/components/AddAnimeModal.js
import React, { useState, useEffect } from 'react';
import { getUserAnimeList } from '../../../services/api'; 
import AnimeCard from '../../../components/AnimeCard';
import './AddAnimeModal.css';

const AddAnimeModal = ({ isOpen, onClose, onAddAnime }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // State quản lý UI cho từng nút Add
    const [addingIds, setAddingIds] = useState([]); // Danh sách ID đang gọi API
    const [addedIds, setAddedIds] = useState([]);   // Danh sách ID đã thêm thành công

    const statusKeys = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'];

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
            // Reset trạng thái khi đóng modal
            setAddingIds([]);
            setAddedIds([]);
            setSearchTerm('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };

    const filterList = (list) => {
        if (!list || !Array.isArray(list)) return [];
        if (!searchTerm) return list;
        return list.filter(anime => {
            const title = anime.title_romaji || anime.title_english || "";
            return title.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    const formatStatusTitle = (status) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    // [LOGIC MỚI] Xử lý sự kiện click nút Add
    const handleAddClick = async (e, anime) => {
        e.preventDefault(); // Ngăn chặn thẻ Link của AnimeCard

        // Nếu đang add hoặc đã add rồi thì chặn click
        if (addingIds.includes(anime.id) || addedIds.includes(anime.id)) return;

        // 1. Thêm vào danh sách đang loading
        setAddingIds(prev => [...prev, anime.id]);

        try {
            if (onAddAnime) {
                // Gọi hàm từ Parent (AnimeListPage)
                await onAddAnime(anime);
                
                // 2. Thành công: Thêm vào danh sách đã xong, xóa khỏi loading
                setAddedIds(prev => [...prev, anime.id]);
            }
        } catch (error) {
            console.error("Add failed in modal", error);
            // Có thể hiện thông báo lỗi ở đây (toast)
        } finally {
            // Luôn xóa khỏi danh sách loading
            setAddingIds(prev => prev.filter(id => id !== anime.id));
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <div className="modal-search-wrapper">
                        <span className="material-symbols-outlined search-icon">search</span>
                        <input
                            type="text"
                            className="modal-search-input"
                            placeholder="Search from your list..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="modal-loading">Loading your library...</div>
                    ) : userData ? (
                        statusKeys.map((status) => {
                            const items = filterList(userData[status]);
                            if (items.length === 0) return null;

                            return (
                                <div key={status} className="modal-section">
                                    <h3 className="section-title">
                                        {formatStatusTitle(status)}
                                        <span className="count-badge">{items.length}</span>
                                    </h3>

                                    <div className="modal-grid">
                                        {items.map((anime) => {
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

                                                    {/* Nút Add với trạng thái động */}
                                                    <button
                                                        className={`btn-card-add ${isAdded ? 'added-success' : ''}`}
                                                        onClick={(e) => handleAddClick(e, anime)}
                                                        disabled={isAdding || isAdded}
                                                        title={isAdded ? "Added to list" : "Add to list"}
                                                    >
                                                        {isAdding ? (
                                                            // Icon loading xoay
                                                            <span className="material-symbols-outlined spin-icon">progress_activity</span>
                                                        ) : isAdded ? (
                                                            // Icon check thành công
                                                            <span className="material-symbols-outlined">check</span>
                                                        ) : (
                                                            // Icon cộng mặc định
                                                            <span className="material-symbols-outlined">add</span>
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="modal-error">Could not load data.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddAnimeModal;