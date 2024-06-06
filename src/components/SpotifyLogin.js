import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const SpotifyLogin = () => {
    const clientId = '3c807510a4d541cc919356740ed22cf1';
    const redirectUri = 'http://localhost:3000/callback'; // redirect URI registered in the Spotify app settings
    const scopes = [
        'user-read-private',
        'user-read-email',
        // add other scopes if needed
    ];

    const handleLogin = () => {
        const url = new URL('https://accounts.spotify.com/authorize');
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('scope', scopes.join(' '));
        url.searchParams.append('redirect_uri', redirectUri);
        url.searchParams.append('state', 'some_random_state');  // an optional bit for enhanced security purposes

        window.location.href = url.toString();  // redirects the user to spotify's authorization page
    };

    return (
        <button onClick={handleLogin}>Log in with Spotify</button>
    );
};

export default SpotifyLogin;
