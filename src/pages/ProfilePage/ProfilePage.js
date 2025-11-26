import React from 'react';
import './ProfilePage.css';
import ProfileBanner from './components/ProfileBanner';
import ActivityHistory from './components/ActivityHistory';
import GenreOverview from './components/GenreOverview';
import MediaGrid from './components/MediaGrid';
import StatsOverview from './components/StatsOverview';
import ActivityFeed from './components/ActivityFeed';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <ProfileBanner />
      <div className="profile-content-container">
        <div className="left-column">
          <ActivityHistory />
          <GenreOverview />
          <MediaGrid />
        </div>
        <div className="right-column">
          <StatsOverview />
          <div className="activity-section">
            <div className="activity-filter">
              <span>Activity</span>
              <span style={{cursor: 'pointer'}}>Filter ▾</span>
            </div>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;