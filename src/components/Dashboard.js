import React from 'react';
import { useSpotifyAuth } from './SpotifyContext'; // Adjust the path as necessary

const Dashboard = () => {
    const { accessToken } = useSpotifyAuth(); // Use the context to access the token

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Access Token: {accessToken || "No token available"}</p>
            {/* You can expand this area to add more features or information */}
        </div>
    );
};

export default Dashboard;