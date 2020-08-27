import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import StartPage from './Components/Pages/StartPage';
import CreatePage from './Components/Pages/CreatePage';
import UserPage from './Components/Pages/UserPage';
import ToastContextProvider from './contexts/ToastContext';

function App() {

    return (
        <div className="App">
            <ToastContextProvider>
                <Router>
                    <Switch>
                        <Route exact path="/" component={StartPage}/>
                        <Route path="/create" component={CreatePage}/>
                        <Route path="/:id" component={UserPage}/>
                    </Switch>
                </Router>
            </ToastContextProvider>
        </div>
    );
}

export default App;
