// src/pages/CharacterPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeCharacter } from '../services/api'; // Giả sử file api của bạn ở đây
import styles from './CharacterPage.module.css';

// Component con để xử lý spoiler
const Spoiler = ({ children }) => {
    const [revealed, setRevealed] = useState(false);
    if (!revealed) {
        return (
            <span className={styles.spoiler} onClick={() => setRevealed(true)}>
                Spoiler, click to view
            </span>
        );
    }
    return <span className={styles.spoilerRevealed}>{children}</span>;
};

const CharacterPage = () => {
    const { characterId } = useParams(); // Lấy ID từ URL
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [extraInfo, setExtraInfo] = useState({});
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                setLoading(true);
                const response = await getAnimeCharacter(characterId);
                const data = response.data;
                setCharacter(data);

                // Xử lý chuỗi description để tách thông tin
                const lines = data.description.split('\n').filter(line => line.trim() !== '');
                const info = {};
                const descParts = [];

                lines.forEach(line => {
                    const match = line.match(/^__(.*):__\s*(.*)/);
                    if (match) {
                        info[match[1]] = match[2];
                    } else {
                        descParts.push(line);
                    }
                });

                setExtraInfo(info);
                setDescription(descParts.join('\n\n'));

            } catch (error) {
                console.error("Failed to fetch character data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [characterId]);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!character) {
        return <div className={styles.loading}>Character not found.</div>;
    }

    // Xử lý hiển thị description với spoiler
    const renderDescription = () => {
        const parts = description.split(/(~!|!~)/g);
        let isSpoiler = false;
        return parts.map((part, index) => {
            if (part === '~!' || part === '!~') {
                isSpoiler = part === '~!';
                return null;
            }
            return isSpoiler ? <Spoiler key={index}>{part}</Spoiler> : <span key={index}>{part}</span>;
        });
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <div className={styles.leftColumn}>
                    <img src={character.image} alt={character.name_full} className={styles.characterImage} />
                </div>
                <div className={styles.rightColumn}>
                    <h1 className={styles.characterName}>{character.name_full}</h1>
                    <p className={styles.nativeName}>{character.name_native}</p>
                    
                    {/* Lưu ý: API không trả về các thông tin này, đây là placeholder */}
 
                    <div className={styles.description}>
                        {renderDescription()}
                    </div>
                </div>
            </div>

            <div className={styles.mediaSection}>
                <h2>Media Appearances</h2>
                <div className={styles.mediaGrid}>
                    {character.media.map(item => (
                        <a href={`/anime/${item.id}`} key={item.id} className={styles.mediaCard}>
                            <img src={item.cover_image} alt={item.title_romaji} />
                            <p>{item.title_romaji}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CharacterPage;