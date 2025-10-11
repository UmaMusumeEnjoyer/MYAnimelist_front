// src/pages/StaffPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Thêm Link vào import
import { getStaffById } from '../services/api';
import styles from './StaffPage.module.css';

// Helper function để định dạng ngày tháng (không đổi)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Helper component để render description (không đổi)
const DescriptionRenderer = ({ text }) => {
    if (!text) return null;

    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return (
        <p>
            {parts.map((part, index) => {
                const match = part.match(/\[(.*?)\]\((.*?)\)/);
                if (match) {
                    return (
                        <a key={index} href={match[2]} target="_blank" rel="noopener noreferrer" className={styles.descriptionLink}>
                            {match[1]}
                        </a>
                    );
                }
                if (part.startsWith('__')) {
                    return <strong key={index}>{part.replace(/__/g, '')}</strong>;
                }
                if (part.startsWith('- ')) {
                    return <li key={index}>{part.substring(2)}</li>
                }
                return <span key={index}>{part}</span>;
            })}
        </p>
    );
};


const StaffPage = () => {
    const { staffId } = useParams();
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rolesByYear, setRolesByYear] = useState({});
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                const response = await getStaffById(staffId);
                const data = response.data;
                setStaff(data);

                const groupedRoles = data.media.reduce((acc, role) => {
                    const year = role.season_year || 'TBA';
                    if (!acc[year]) {
                        acc[year] = [];
                    }
                    acc[year].push(role);
                    return acc;
                }, {});
                setRolesByYear(groupedRoles);

            } catch (error) {
                console.error("Failed to fetch staff data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, [staffId]);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (!staff) return <div className={styles.loading}>Staff not found.</div>;

    const descriptionText = staff.description || '';
    const CHARACTER_LIMIT = 400;
    const shouldShowReadMore = descriptionText.length > CHARACTER_LIMIT;
    const sortedYears = Object.keys(rolesByYear).sort((a, b) => b - a);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <div className={styles.leftColumn}>
                    <img src={staff.image} alt={staff.name_full} className={styles.staffImage} />
                </div>
                <div className={styles.rightColumn}>
                    <h1 className={styles.staffName}>{staff.name_full}</h1>
                    <p className={styles.nativeName}>{staff.name_native}</p>
                    
                    <div className={styles.infoGrid}>
                        <p><strong>Birth:</strong> {formatDate(staff.date_of_birth)}</p>
                        <p><strong>Age:</strong> {staff.age}</p>
                        <p><strong>Gender:</strong> {staff.gender}</p>
                        <p><strong>Hometown:</strong> {staff.home_town}</p>
                    </div>
                    
                    {/* --- SỬA Ở ĐÂY --- */}
                    {/* Thêm class 'collapsed' và nút 'Read More' một cách có điều kiện */}
                    <div className={`${styles.description} ${!isDescriptionExpanded && shouldShowReadMore ? styles.collapsed : ''}`}>
                        <DescriptionRenderer text={descriptionText} />
                    </div>
                    {shouldShowReadMore && (
                        <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className={styles.readMoreButton}>
                            {isDescriptionExpanded ? 'Show Less' : 'Read More'}
                        </button>
                    )}
                    {/* --- KẾT THÚC PHẦN SỬA --- */}
                </div>
            </div>

            {/* Phần hiển thị các vai diễn */}
            <div className={styles.rolesSection}>
                {sortedYears.map(year => (
                    <div key={year} className={styles.yearGroup}>
                        <h2 className={styles.yearTitle}>{year}</h2>
                        <div className={styles.rolesGrid}>
                            {rolesByYear[year].map(role => (
                                // --- SỬA Ở ĐÂY ---
                                // Bọc card bằng Link để có thể click
                                <Link to={`/anime/${role.id}`} key={`${role.id}-${role.character_role || Math.random()}`} className={styles.roleCardLink}>
                                    <div className={styles.roleCard}>
                                        <img 
                                            src={role.cover_image} 
                                            alt={role.title_romaji} 
                                            className={styles.roleImage} 
                                        />
                                        <div className={styles.roleDetails}>
                                            <p className={styles.roleMainText}>{role.title_romaji}</p>
                                            <p className={styles.roleSubText}>{role.format}</p>
                                        </div>
                                    </div>
                                </Link>
                                // --- KẾT THÚC PHẦN SỬA ---
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffPage;