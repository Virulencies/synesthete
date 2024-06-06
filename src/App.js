import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SpotifyLogin from './components/SpotifyLogin';
import SpotifyCallback from './components/SpotifyCallback';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/callback" component={SpotifyCallback} />
                <Route path="/" exact component={SpotifyLogin} />
            </Switch>
        </Router>
    );
}

export default App;
