import React from 'react';
import './App.css';
import PaperdollView from './components/PaperdollView/PaperdollView'
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import {AppBar} from './components/AppBar/AppBar'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppBar />
        <Switch>
          <Route path="/d9/bam-paperdoll">
            <PaperdollView />
          </Route>
          <Route path="/">
            <Redirect to="/d9/bam-paperdoll" />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
