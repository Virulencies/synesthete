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
        const token = accessToken || sessionStorage.getItem('access_token');
        if (!token) {
            console.error('No access token available');
            return;
        }
        console.log("Using access token for playback:", token);
        console.log("Track URI:", trackUri);

        const requestData = {
            uris: [trackUri]
        };

        console.log("Request Data:", requestData);

        const devicesResponse = await fetch(`https://api.spotify.com/v1/me/player/devices`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const devicesData = await devicesResponse.json();
        const activeDevice = devicesData.devices.find(device => device.is_active);

        if (!activeDevice) {
            console.error('No active device available for playback');
            const availableDevice = devicesData.devices[0];
            if (availableDevice) {
                console.log('Transferring playback to available device:', availableDevice.id);
                await fetch(`https://api.spotify.com/v1/me/player`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ device_ids: [availableDevice.id], play: true }),
                    cache: "no-cache"
                });
            } else {
                alert('No active device found. Please open Spotify on one of your devices.');
                return;
            }
        }

        await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
            cache: "no-cache"
        }).then(response => {
            if (!response.ok) {
                console.error('Failed to play track', response.status, response.statusText);
                if (response.status === 401) {
                    console.log('Token expired or invalid, please re-authenticate');
                } else if (response.status === 400) {
                    console.log('Bad Request: The request was malformed');
                }
            } else {
                console.log('Track played successfully');
            }
        }).catch(error => {
            console.error('Error playing track:', error);
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
