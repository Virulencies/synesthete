import React, { useEffect } from 'react';

const SpotifyCallback = () => {
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

        console.log('Access Token:', hash.access_token);
    }, []);

    return <div>Loading...</div>;
};

export default SpotifyCallback;
