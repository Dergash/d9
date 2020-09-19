import React from 'react'
import PaperdollView from './components/PaperdollView/PaperdollView'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import { AppBar } from './components/AppBar/AppBar'

function App() {
  return (
    <div className="App">
      <HashRouter>
        <AppBar />
        <Switch>
          <Route path="/bam-paperdoll">
            <PaperdollView />
          </Route>
          <Route path="/">
            <Redirect to="/bam-paperdoll" />
          </Route>
        </Switch>
      </HashRouter>
    </div>
  )
}

export default App
