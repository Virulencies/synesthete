import React from 'react';

const SpotifyLogin = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = 'http://localhost:3000/callback';
    const scopes = [
        'user-read-private',
        'user-read-email',
        'user-modify-playback-state',
        'user-read-playback-state',
        'user-library-read',
        'streaming',
        'playlist-read-private',
        'playlist-read-collaborative'
    ];

    const handleLogin = () => {
        const stateValue = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('spotify_auth_state', stateValue);

        const url = new URL('https://accounts.spotify.com/authorize');
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('scope', scopes.join(' '));
        url.searchParams.append('redirect_uri', redirectUri);
        url.searchParams.append('state', stateValue);

        window.location.href = url.toString();
    };

    return (
        <button onClick={handleLogin}>Log in with Spotify</button>
    );
};

export default SpotifyLogin;
