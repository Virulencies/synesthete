import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyAuth } from './SpotifyContext';

const SpotifyCallback = () => {
    const navigate = useNavigate();
    const { saveAccessToken, accessToken } = useSpotifyAuth();
    const executedRef = useRef(false);
    const storedState = sessionStorage.getItem('spotify_auth_state'); // get this once on component mount

    useEffect(() => {
        if (executedRef.current) return;
        
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessTokenURL = params.get('access_token');
        const stateURL = params.get('state');

        if (stateURL === storedState && accessTokenURL) {
            console.log("State matches and token found:", accessTokenURL);
            saveAccessToken(accessTokenURL);
            executedRef.current = true; // prevent further executions
            navigate('/dashboard', { replace: true });
        } else {
            console.error("State mismatch or no access token found, redirecting...");
            navigate('/', { replace: true });
        }
    }, [saveAccessToken, navigate]);

    return <div>Loading...</div>;
};

export default SpotifyCallback;
