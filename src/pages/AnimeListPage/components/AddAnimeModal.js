// src/components/AddAnimeModal.js
import React, { useState, useEffect } from 'react';
import { getUserAnimeList } from '../../../services/api'; 
import AnimeCard from '../../../components/AnimeCard';
import './AddAnimeModal.css';

const AddAnimeModal = ({ isOpen, onClose, onAddAnime }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [addingIds, setAddingIds] = useState([]); 
    const [addedIds, setAddedIds] = useState([]);   

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
            setAddingIds([]);
            setAddedIds([]);
            setSearchTerm('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        // [UPDATE] Kiểm tra class mới
        if (e.target.classList.contains('add-anime-modal-overlay')) {
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

    return (
        // [UPDATE] Đổi class name để tránh trùng với Edit Modal
        <div className="add-anime-modal-overlay" onClick={handleOverlayClick}>
            <div className="add-anime-modal-content">
                <div className="add-anime-modal-header">
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

                <div className="add-anime-modal-body">
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