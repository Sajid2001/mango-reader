import { useState } from 'react'

import Sidebar from './components/Sidebar'
import {Route, HashRouter, Routes } from 'react-router-dom'
import LibraryPage from './pages/LibraryPage'
import SearchPage from './pages/SearchPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import AskAIPage from './pages/AskAIPage'
import MangaPage from './pages/MangaPage'
function App() {

  return (
    <div className='flex'>
      <div className='absolute z-3 h-screen bg-gray-200'>
        <Sidebar/>
      </div>
      
      <div className='pl-16'>
        <HashRouter >
          <Routes>
            <Route path="/manga/:id" element={<MangaPage/>}/>
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
