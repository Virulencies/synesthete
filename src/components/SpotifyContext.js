/*import React, { createContext, useContext, useState, useEffect } from 'react';

const SpotifyAuthContext = createContext();

export const useSpotifyAuth = () => useContext(SpotifyAuthContext);

export const SpotifyAuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const saveAccessToken = (token) => {
        console.log("Saving access token:", token);
        setAccessToken(token);
    };

    const fetchSpotifyData = async (endpoint) => {
        const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            console.error('Failed to fetch data from Spotify API');
            return null;
        }
        return await response.json();
    };

    useEffect(() => {
        if (accessToken) {
            fetchSpotifyData('me').then(data => setUserInfo(data));
        }
    }, [accessToken]);

    return (
        <SpotifyAuthContext.Provider value={{ accessToken, saveAccessToken, userInfo, fetchSpotifyData }}>
            {children}
        </SpotifyAuthContext.Provider>
    );
};
*/

/*
import React, { createContext, useContext, useState, useEffect } from 'react';

const SpotifyAuthContext = createContext();

export const useSpotifyAuth = () => useContext(SpotifyAuthContext);

export const SpotifyAuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

     const clearSession = () => {
    sessionStorage.removeItem('access_token');
    setAccessToken(null);
    setUserInfo(null);

    // Call the Spotify logout endpoint
    fetch('https://www.spotify.com/logout', { method: 'POST' }); 
  };

    const saveAccessToken = (token) => {
        console.log("Saving access token:", token);
        setAccessToken(token);
        sessionStorage.setItem('access_token', token);
    };

    const fetchSpotifyData = async (endpoint) => {
        const token = sessionStorage.getItem('access_token');
        const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            console.error('Failed to fetch data from Spotify API', response.status, response.statusText);
            return null;
        }
        return await response.json();
    };

    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            setAccessToken(token);
            fetchSpotifyData('me').then(data => setUserInfo(data));
        }
    }, []);

    return (
        <SpotifyAuthContext.Provider value={{ accessToken, saveAccessToken, userInfo, fetchSpotifyData }}>
            {children}
        </SpotifyAuthContext.Provider>
    );
};
*/

/*
import React, { createContext, useContext, useState, useEffect } from 'react';

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
    };

    const fetchSpotifyData = async (endpoint) => {
        const token = accessToken;
        if (!token) {
            console.error('No access token available');
            return null;
        }
        const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            console.error('Failed to fetch data from Spotify API', response.status, response.statusText);
            return null;
        }
        return await response.json();
    };

    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            setAccessToken(token);
            fetchSpotifyData('me').then(data => setUserInfo(data));
        }
    }, []);

    return (
        <SpotifyAuthContext.Provider value={{ accessToken, saveAccessToken, logout, userInfo, fetchSpotifyData }}>
            {children}
        </SpotifyAuthContext.Provider>
    );
};
*/

/*
import React, { createContext, useContext, useState, useEffect } from 'react';

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
    };

    const refreshAccessToken = async (refreshToken) => {
        const request = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
            cache: 'no-store' // Ensures no caching for token refresh
        });

        if (request.ok) {
            const response = await request.json();
            const { access_token, expires_in, refresh_token: newRefreshToken } = response;

            saveAccessToken(access_token);
            sessionStorage.setItem('refresh_token', newRefreshToken || refreshToken);
            sessionStorage.setItem('expires_at', Math.floor(Date.now() / 1000) + expires_in);

            return access_token;
        } else {
            console.error(`Failed to refresh token: ${request.status} ${request.statusText}`);
            return null;
        }
    };

    const fetchSpotifyData = async (endpoint) => {
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
            },
            cache: 'no-store' // Ensures no caching for data fetching
        });

        if (response.status === 401) {
            // Token expired or invalid
            console.log('Token expired or invalid, refreshing...');
            const refreshToken = sessionStorage.getItem('refresh_token');
            const newToken = await refreshAccessToken(refreshToken);
            if (newToken) {
                const newResponse = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${newToken}`
                    },
                    cache: 'no-store' // Ensures no caching for data fetching after token refresh
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
    };

    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            setAccessToken(token);
            fetchSpotifyData('me').then(data => setUserInfo(data));
        }
    }, []);

    return (
        <SpotifyAuthContext.Provider value={{ accessToken, saveAccessToken, logout, userInfo, fetchSpotifyData }}>
            {children}
        </SpotifyAuthContext.Provider>
    );
};
*/

import React, { createContext, useContext, useState, useEffect } from 'react';

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

    const refreshAccessToken = async (refreshToken) => {
        const request = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${btoa(`${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`)}`,
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        });

        if (request.ok) {
            const response = await request.json();
            const { access_token, expires_in, refresh_token: newRefreshToken } = response;

            saveAccessToken(access_token);
            sessionStorage.setItem('refresh_token', newRefreshToken || refreshToken);
            sessionStorage.setItem('expires_at', Math.floor(Date.now() / 1000) + expires_in);

            return access_token;
        } else {
            console.error(`Failed to refresh token: ${request.status} ${request.statusText}`);
            return null;
        }
    };

    const fetchSpotifyData = async (endpoint) => {
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
            // Token expired or invalid
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
    };

    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            setAccessToken(token);
            fetchSpotifyData('me').then(data => setUserInfo(data));
        }
    }, []);

    return (
        <SpotifyAuthContext.Provider value={{ accessToken, saveAccessToken, logout, userInfo, fetchSpotifyData }}>
            {children}
        </SpotifyAuthContext.Provider>
    );
};
