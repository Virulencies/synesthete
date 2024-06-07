import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpotifyAuthProvider } from './components/SpotifyContext';
import SpotifyLogin from './components/SpotifyLogin';
import SpotifyCallback from './components/SpotifyCallback';
import Dashboard from './components/Dashboard';

function App() {
    return (
        <Router>
            <SpotifyAuthProvider>
                <Routes>
                    <Route path="/callback" element={<SpotifyCallback />} />
                   {/* <Route path="/callback" component={SpotifyCallback} />*/}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<SpotifyLogin />} />
                </Routes>
            </SpotifyAuthProvider>
        </Router>
    );
}

export default App;