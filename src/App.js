import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SpotifyAuthProvider } from './components/SpotifyContext';
import SpotifyLogin from './components/SpotifyLogin';
import SpotifyCallback from './components/SpotifyCallback';
import Dashboard from './components/Dashboard';

function App() {
    console.log("App component rendered");
    return (
        <Router>
            <SpotifyAuthProvider>
                <Routes>
                    <Route path="/callback" element={<SpotifyCallback />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<SpotifyLogin />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </SpotifyAuthProvider>
        </Router>
    );
}

export default App;
