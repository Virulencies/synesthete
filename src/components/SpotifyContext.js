import React, { createContext, useContext, useState, useEffect } from 'react';

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
