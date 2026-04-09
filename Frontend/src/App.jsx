import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Detail from './pages/Detail'

import './App.css'
import Default from './pages/Default'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/catalog' element={<Catalog />} />
      <Route path='/plant/:id' element={<Detail />} />
      <Route path='*' element={<Default/>} />
    </Routes>
  )
}

export default App
