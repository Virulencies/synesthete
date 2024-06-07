import React, { createContext, useContext, useState } from 'react';

const SpotifyAuthContext = createContext();

export const useSpotifyAuth = () => useContext(SpotifyAuthContext);

export const SpotifyAuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);

    const saveAccessToken = (token) => {
        console.log("Saving access token:", token); 
        setAccessToken(token);
    };

    return (
        <SpotifyAuthContext.Provider value={{ accessToken, saveAccessToken }}>
            {children}
        </SpotifyAuthContext.Provider>
    );
};
