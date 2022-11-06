import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import './App.css'

import NavBar from './components/NavBar'

import NoteFinder from './components/NoteFinder'
import TextPractice from './components/TextPractice'
import SentenceCollector from './components/SentenceCollector'
import Home from "./components/Home";
import AuthModal from "./components/AuthModal";

import UserContext from "./components/UserContext";

function App() {
    const [user, setUser] = useState(null);
    const RequireUser = (component) => {
        return user ? component : <AuthModal show={true} updateUser={setUser}/>;
    }

    useEffect(async () => {
        const response = await fetch("/api/user/me");
        if (response.ok) {
            const user = await response.json();
            setUser(user);
        }
    }, []);
    
    return (
        <UserContext.Provider value={user}>
            <NavBar />
            <Routes>
                <Route path="*" element={<Navigate to="/home" replace/>} />
                <Route path="/home" element={<Home/>} />
                <Route path="/note-finder" element={<NoteFinder/>} />
                <Route path="/text-practice" element={<TextPractice/>} />
                <Route path="/sentence-collector" element={RequireUser(<SentenceCollector />)} />
            </Routes>
        </UserContext.Provider>
    )
}

export default App
