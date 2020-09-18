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
          <Route path="/bam-paperdoll">
            <PaperdollView />
          </Route>
          <Route path="/">
            <Redirect to="/bam-paperdoll" />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
