import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSpotifyAuth } from './SpotifyContext';
import Visualizer from './Visualizer';

const Dashboard = () => {
    const { accessToken, userInfo, fetchSpotifyData } = useSpotifyAuth();
    const [tracks, setTracks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [audioFeatures, setAudioFeatures] = useState(null);
    const playerRef = useRef(null);
    const [player, setPlayer] = useState(null);

    const initializePlayer = useCallback(() => {
        if (!accessToken) return;

        window.onSpotifyWebPlaybackSDKReady = () => {
            const newPlayer = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(accessToken); }
            });

            newPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
            newPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
            newPlayer.addListener('account_error', ({ message }) => { console.error(message); });
            newPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

            newPlayer.addListener('player_state_changed', async state => {
                console.log(state);
                if (state && state.track_window && state.track_window.current_track) {
                    const trackId = state.track_window.current_track.id;
                    const features = await getAudioFeatures(trackId);
                    setAudioFeatures(features);
                }
            });

            newPlayer.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                playerRef.current = newPlayer;
                setPlayer(newPlayer);
            });

            newPlayer.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            newPlayer.connect();
        };

        const script = document.createElement('script');
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        script.onload = () => console.log("Spotify Web Playback SDK loaded successfully.");
        script.onerror = () => console.error("Failed to load Spotify Web Playback SDK.");
        document.body.appendChild(script);
    }, [accessToken]);

    useEffect(() => {
        initializePlayer();
    }, [initializePlayer]);

    const handleSearch = async () => {
        const data = await fetchSpotifyData(`search?q=${encodeURIComponent(searchTerm)}&type=track`);
        if (data && data.tracks) {
            setTracks(data.tracks.items);
        }
    };

    const handlePlayTrack = async (trackUri) => {
        if (!accessToken) {
            console.error('No access token available');
            return;
        }

        if (!trackUri.startsWith('spotify:track:')) {
            console.error('Invalid URI for track playback:', trackUri);
            alert('Please select a track to play, not a playlist.');
            return;
        }

        const requestData = {
            uris: [trackUri]
        };

        const devicesResponse = await fetch(`https://api.spotify.com/v1/me/player/devices`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const devicesData = await devicesResponse.json();
        const activeDevice = devicesData.devices.find(device => device.is_active);

        if (!activeDevice) {
            console.error('No active device available for playback');
            const availableDevice = devicesData.devices[0];
            if (availableDevice) {
                await fetch(`https://api.spotify.com/v1/me/player`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
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
                Authorization: `Bearer ${accessToken}`,
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

    const getAudioFeatures = async (trackId) => {
        if (!accessToken) {
            console.error('No access token available');
            return null;
        }

        const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.error('Failed to fetch audio features', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        console.log('Audio Features:', data); // log audio features
        return data;
    };

    const handleTogglePlay = () => {
        if (player) {
            player.togglePlay().catch(error => {
                console.error('Failed to toggle play:', error);
            });
        } else {
            console.error('Player is not ready');
        }
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
            <div id="player">
                <div id="player-status"></div>
                <button onClick={handleTogglePlay}>Play/Pause</button>
            </div>
            {audioFeatures && (
                <div>
                    <h2>Audio Features</h2>
                    <p>Tempo: {audioFeatures.tempo} BPM</p>
                    <p>Danceability: {audioFeatures.danceability}</p>
                    <p>Energy: {audioFeatures.energy}</p>
                    <p>Valence: {audioFeatures.valence}</p>
                    {/* Add more audio features as needed */}
                </div>
            )}
            <div style={{ width: '100%', height: '500px' }}> {/* container for Visualizer */}
                <Visualizer audioFeatures={audioFeatures} /> {/* adds the Visualizer component */}
            </div>
        </div>
    );
};

export default Dashboard;
