﻿import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import './App.css'

import NavBar from './components/NavBar'

import NoteFinder from './components/note-finder'
import TextPractice from './components/text-practice'

import home from "./components/home"

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
                </Switch>
            </>
        )
    }
}

export default App