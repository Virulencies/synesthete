/*import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyAuth } from './SpotifyContext';

const SpotifyCallback = () => {
    const navigate = useNavigate();
    const { saveAccessToken } = useSpotifyAuth();
    const executedRef = useRef(false);
    const storedState = sessionStorage.getItem('spotify_auth_state');

    console.log("SpotifyCallback component rendered");

    useEffect(() => {
        if (executedRef.current) return;

        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');
        const state = params.get('state');

        console.log("Callback Params:", { accessToken, state, storedState });

        if (state === storedState && accessToken) {
            console.log("State matches and token found:", accessToken);
            sessionStorage.removeItem('spotify_auth_state');
            saveAccessToken(accessToken);
            executedRef.current = true;
            navigate('/dashboard', { replace: true });
        } else {
            console.error("State mismatch or no access token found, redirecting...");
            navigate('/', { replace: true });
        }
    }, [saveAccessToken, navigate, storedState]);

    return <div>Loading...</div>;
};

export default SpotifyCallback;
*/


import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyAuth } from './SpotifyContext';

const SpotifyCallback = () => {
    const navigate = useNavigate();
    const { saveAccessToken } = useSpotifyAuth();
    const executedRef = useRef(false);

    useEffect(() => {
        if (executedRef.current) return;

        const params = new URLSearchParams(window.location.search); // Use search for query params
        const authorizationCode = params.get('code');
        const state = params.get('state');
        const storedState = sessionStorage.getItem('spotify_auth_state');

        console.log("Callback Params:", { authorizationCode, state, storedState });

        if (state === storedState && authorizationCode) {
            console.log("State matches and authorization code found:", authorizationCode);
            sessionStorage.removeItem('spotify_auth_state');
            exchangeAuthorizationCode(authorizationCode);
            executedRef.current = true;
        } else {
            console.error("State mismatch or no authorization code found, redirecting...");
            navigate('/', { replace: true });
        }
    }, [navigate, saveAccessToken]);

    const exchangeAuthorizationCode = async (code) => {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${btoa(`${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`)}`,
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/callback`
        });

        if (response.ok) {
            const data = await response.json();
            const { access_token, refresh_token, expires_in } = data;

            saveAccessToken(access_token);
            sessionStorage.setItem('refresh_token', refresh_token);
            sessionStorage.setItem('expires_at', Math.floor(Date.now() / 1000) + expires_in);

            navigate('/dashboard', { replace: true });
        } else {
            console.error("Failed to exchange authorization code:", response.status, response.statusText);
            navigate('/', { replace: true });
        }
    };

    return <div>Loading...</div>;
};

export default SpotifyCallback;
