import React, { useEffect, useRef } from 'react';
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
