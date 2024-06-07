import React, { useEffect, useState } from 'react';
import { useSpotifyAuth } from './SpotifyContext';

const Dashboard = () => {
    const { accessToken, userInfo, fetchSpotifyData } = useSpotifyAuth();
    const [tracks, setTracks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (accessToken) {
            fetchSpotifyData('me/playlists').then(data => {
                if (data && data.items) {
                    setTracks(data.items);
                }
            });
        }
    }, [accessToken, fetchSpotifyData]);

    const handleSearch = async () => {
        const data = await fetchSpotifyData(`search?q=${encodeURIComponent(searchTerm)}&type=track`);
        if (data && data.tracks) {
            setTracks(data.tracks.items);
        }
    };

    const handlePlayTrack = async (trackUri) => {
        await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uris: [trackUri] })
        });
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Access Token: {accessToken || "No token available"}</p>
            {userInfo && <p>Welcome, {userInfo.display_name}</p>}
            <input
                type="text"
                placeholder="Search for a track"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {tracks.map(track => (
                    <li key={track.id}>
                        {track.name} by {track.artists && track.artists.length > 0 ? track.artists[0].name : "Unknown Artist"}
                        <button onClick={() => handlePlayTrack(track.uri)}>Play</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
