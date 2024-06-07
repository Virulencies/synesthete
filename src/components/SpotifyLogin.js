import React, { useEffect } from 'react';

const SpotifyLogin = () => {
    const clientId = '3c807510a4d541cc919356740ed22cf1';
    const redirectUri = 'http://localhost:3000/callback'; // Ensure this matches the registered redirect URI in the Spotify Developer Dashboard
    const scopes = [
        'user-read-private',
        'user-read-email',
    ];

    useEffect(() => {
        console.log("SpotifyLogin component rendered"); // Ensure this is printed
    }, []);

    const handleLogin = () => {
        sessionStorage.removeItem('spotify_auth_state');
        sessionStorage.removeItem('access_token');
        //alert("handleLogin function called");
        console.log("handleLogin function called");
        const stateValue = Math.random().toString(36).substring(2, 15); // generate a random state value
        sessionStorage.setItem('spotify_auth_state', stateValue); // store it locally

        const url = new URL('https://accounts.spotify.com/authorize');
        url.searchParams.append('response_type', 'token');
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('scope', scopes.join(' '));
        url.searchParams.append('redirect_uri', redirectUri);
        url.searchParams.append('state', stateValue);

        console.log("Generated Login URL:", url.toString()); // Debug log to check the URL
        console.log("State Value Stored:", stateValue); // Debug log for the state value
        console.log("Redirecting to Spotify Authorization..."); // Indicate the redirection is happening
        window.location.href = url.toString(); // redirects to Spotify's authorization page
    };

    const handleLogout = () => {
        sessionStorage.clear();
        console.log("Session storage cleared");
        alert("Session storage cleared");
    };


    return (
        <div>
            <button onClick={handleLogin}>Log in with Spotify</button>
            <button onClick={handleLogout}>Clear Session</button>
        </div>
        
    );
};

export default SpotifyLogin;
