import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Detail from './pages/Detail'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Default from './pages/Default'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/catalog' element={<Catalog />} />
      <Route path='/plant/:id' element={<Detail />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='*' element={<Default/>} />
    </Routes>
  )
}

export default App
