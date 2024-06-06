import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SpotifyAuthProvider } from './components/SpotifyContext';
import SpotifyLogin from './components/SpotifyLogin';
import SpotifyCallback from './components/SpotifyCallback';

function App() {
    return (
        <Router>
            <SpotifyAuthProvider>
                <Switch>
                    <Route path="/callback" component={SpotifyCallback} />
                    <Route path="/" exact component={SpotifyLogin} />
                </Switch>
            </SpotifyAuthProvider>
        </Router>
    );
}

export default App;
