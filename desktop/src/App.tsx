import { useState } from 'react'

import SidebarButton from './components/SidebarButton'
import Sidebar from './components/Sidebar'
function App() {

  const [path, setPath] = useState("hello world")
  return (
    <div className='flex'>
      <div className='h-screen bg-gray-200'>
        <Sidebar/>
      </div>
      
      <div>
        
      </div>

    </div>
  )
}

export default App
