import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DataVisualization from './components/DataVisualization';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/dashboard" component={Dashboard} />
                    <Route exact path="/data-visualization" component={DataVisualization} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;
