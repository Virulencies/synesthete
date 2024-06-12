import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyAuth } from './SpotifyContext';

const SpotifyCallback = () => {
    const navigate = useNavigate();
    const { saveAccessToken } = useSpotifyAuth();
    const executedRef = useRef(false);

    const exchangeAuthorizationCode = useCallback(async (code) => {
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

            navigate('/dashboard');
        } else {
            console.error("Failed to exchange authorization code:", response.status, response.statusText);
            navigate('/');
        }
    }, [navigate, saveAccessToken]);

    useEffect(() => {
        if (executedRef.current) return;

        const params = new URLSearchParams(window.location.search);
        const authorizationCode = params.get('code');
        const state = params.get('state');
        const storedState = sessionStorage.getItem('spotify_auth_state');

        console.log("Callback Params:", { authorizationCode, state, storedState });

        if (state === storedState && authorizationCode) {
            sessionStorage.removeItem('spotify_auth_state');
            exchangeAuthorizationCode(authorizationCode);
            executedRef.current = true;
        } else {
            console.error("State mismatch or no authorization code found, redirecting...");
            navigate('/', { replace: true });
        }
    }, [navigate, exchangeAuthorizationCode]);

    return <div>Loading...</div>;
};

export default SpotifyCallback;
