import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import './App.css'

import NavBar from './components/NavBar'

import NoteFinder from './components/NoteFinder'
import TextPractice from './components/TextPractice'
import SentenceCollector from './components/SentenceCollector'

import home from "./components/Home"

class App extends Component {
    render() {
        return (
            <>
                <NavBar />
                <Switch>
                    <Redirect exact path = "/" to = "/home" />
                    <Route path = "/home" component = { home } />
                    <Route path = "/note-finder" component={ NoteFinder } />
                    <Route path = "/text-practice" component={ TextPractice } />
                    <Route path = "/sentence-collector" component={ SentenceCollector } />
                </Switch>
            </>
        )
    }
}

export default App
