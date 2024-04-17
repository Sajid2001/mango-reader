import { useState } from 'react'

import Sidebar from './components/Sidebar'
import {Route, HashRouter, Routes } from 'react-router-dom'
import LibraryPage from './pages/LibraryPage'
import SearchPage from './pages/SearchPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import AskAIPage from './pages/AskAIPage'
function App() {

  return (
    <div className='flex'>
      <div className='h-screen bg-gray-200'>
        <Sidebar/>
      </div>
      
      <div>
        <HashRouter >
          <Routes>
            
            <Route path="/search" element={<SearchPage/>}/>
            <Route path="/history" element={<HistoryPage/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
            <Route path="/askai" element={<AskAIPage/>}/>
            <Route path="/" element={<LibraryPage/>}/>
            
          </Routes>
          
        </HashRouter>
       
      </div>

    </div>
  )
}

export default App
