import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SpotifyAuthProvider } from './components/SpotifyContext';
import SpotifyLogin from './components/SpotifyLogin';
import SpotifyCallback from './components/SpotifyCallback';

function App() {
    return (
        <Router>
            <SpotifyAuthProvider>
                <Routes>
                    <Route path="/callback" component={SpotifyCallback} />
                    <Route path="/" element={<SpotifyLogin />} />
                </Routes>
            </SpotifyAuthProvider>
        </Router>
    );
}

export default App;
