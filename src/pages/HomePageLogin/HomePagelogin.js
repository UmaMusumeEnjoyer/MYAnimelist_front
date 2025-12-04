// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import AnimeSection from './components/AnimeSection'; 
import { getUserAnimeList } from '../../services/api';
// import { Link } from 'react-router-dom'; // Unlock this if you want to link to a search page

const HomePage = () => {
  // Initialize state
  const [inProgressList, setInProgressList] = useState([]);     // Watching
  const [completedList, setCompletedList] = useState([]);       // Completed
  const [pausedList, setPausedList] = useState([]);             // On Hold
  const [droppedList, setDroppedList] = useState([]);           // Dropped
  const [planningList, setPlanningList] = useState([]);        
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const username = localStorage.getItem('username');

        if (username) {
          const response = await getUserAnimeList(username);
          
          if (response.data) {
            setInProgressList(response.data.watching || []);
            setCompletedList(response.data.completed || []);
            setPausedList(response.data.on_hold || response.data.paused || []);
            setDroppedList(response.data.dropped || []);
            setPlanningList(response.data.plan_to_watch || response.data.planning || []);
          }
        } else {
            console.warn("No username found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching user anime list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Check if ALL lists are empty
  const allListsAreEmpty = 
    inProgressList.length === 0 &&
    planningList.length === 0 &&
    completedList.length === 0 &&
    pausedList.length === 0 &&
    droppedList.length === 0;

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', color: '#fff' }}>
            <h2>Loading your list...</h2>
        </div>
    );
  }

  return (
    <div>
      <div className="main-content-container">
        <main style={{ padding: '0 50px', maxWidth: '1400px', margin: '0 auto' }}>
          
          {allListsAreEmpty ? (
            /* Empty State Message */
            <div style={{ 
              textAlign: 'center', 
              marginTop: '100px', 
              color: '#cbd5e0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0' }}>Your List is Empty</h2>
                <p style={{ fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>
                  It looks like you haven't added any anime yet. <br />
                  Please use the <strong>Browse</strong> feature to find your favorite anime and add them to your collection.
                </p>
                
                {/* Optional: Add a button if you have a route to Search */}
                {/* <Link to="/search" className="view-all-btn" style={{ textDecoration: 'none', padding: '10px 24px', fontSize: '1rem' }}>
                    Go to Search
                </Link> */}
            </div>
          ) : (
            /* Standard List View */
            <>
              {/* 1. Watching */}
              <AnimeSection title="Anime in Progress" animeList={inProgressList} />
              
              {/* 2. Plan to Watch */}
              <AnimeSection title="Plan to Watch" animeList={planningList} />

              {/* 3. Completed */}
              <AnimeSection title="Completed" animeList={completedList} />

              {/* 4. On Hold */}
              <AnimeSection title="On Hold" animeList={pausedList} />

              {/* 5. Dropped */}
              <AnimeSection title="Dropped" animeList={droppedList} />
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default HomePage;