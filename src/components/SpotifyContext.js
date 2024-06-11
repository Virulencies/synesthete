import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SpotifyAuthContext = createContext();

export const useSpotifyAuth = () => useContext(SpotifyAuthContext);

export const SpotifyAuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const saveAccessToken = (token) => {
        console.log("Saving access token:", token);
        setAccessToken(token);
        sessionStorage.setItem('access_token', token);
    };

    const logout = () => {
        console.log("Clearing access token");
        setAccessToken(null);
        setUserInfo(null);
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('expires_at');
    };

    const refreshAccessToken = useCallback(async (refreshToken) => {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${btoa(`${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`)}`,
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        });

        if (response.ok) {
            const data = await response.json();
            const { access_token, expires_in, refresh_token: newRefreshToken } = data;

            saveAccessToken(access_token);
            sessionStorage.setItem('refresh_token', newRefreshToken || refreshToken);
            sessionStorage.setItem('expires_at', Math.floor(Date.now() / 1000) + expires_in);

            return access_token;
        } else {
            console.error(`Failed to refresh token: ${response.status} ${response.statusText}`);
            return null;
        }
    }, []);

    const fetchSpotifyData = useCallback(async (endpoint) => {
        let token = accessToken || sessionStorage.getItem('access_token');
        const expiresAt = sessionStorage.getItem('expires_at');

        if (expiresAt && Date.now() / 1000 > expiresAt) {
            console.log('Access token expired, refreshing...');
            const refreshToken = sessionStorage.getItem('refresh_token');
            token = await refreshAccessToken(refreshToken);
        }

        if (!token) {
            console.error('No access token available');
            return null;
        }

        const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            console.log('Token expired or invalid, refreshing...');
            const refreshToken = sessionStorage.getItem('refresh_token');
            const newToken = await refreshAccessToken(refreshToken);
            if (newToken) {
                const newResponse = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${newToken}`
                    }
                });
                return await newResponse.json();
            } else {
                return null;
            }
        } else if (!response.ok) {
            console.error('Failed to fetch data from Spotify API', response.status, response.statusText);
            return null;
        }
        return await response.json();
    }, [accessToken, refreshAccessToken]);

    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            setAccessToken(token);
            fetchSpotifyData('me').then(data => setUserInfo(data));
        }
    }, [fetchSpotifyData]);

    return (
        <SpotifyAuthContext.Provider value={{ accessToken, saveAccessToken, logout, userInfo, fetchSpotifyData }}>
            {children}
        </SpotifyAuthContext.Provider>
    );
};
