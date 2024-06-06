import React, { useEffect } from 'react';
import { useSpotifyAuth } from './SpotifyContext';

const SpotifyCallback = () => {
    const { saveAccessToken } = useSpotifyAuth();

    useEffect(() => {
        const hash = window.location.hash
            .substring(1)
            .split('&')
            .reduce(function (initial, item) {
                if (item) {
                    var parts = item.split('=');
                    initial[parts[0]] = decodeURIComponent(parts[1]);
                }
                return initial;
            }, {});
        window.location.hash = '';

        if (hash.access_token) {
            saveAccessToken(hash.access_token);
        }

        console.log('Access Token:', hash.access_token);
    }, [saveAccessToken]);

    return <div>Loading...</div>;
};

export default SpotifyCallback;
