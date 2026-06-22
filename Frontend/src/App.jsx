import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Detail from './pages/Detail'
import Login from './pages/Login'
import Default from './pages/Default'
import Profile from './pages/Profile'
import Administrate from './pages/Administrate'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'

import './App.css'

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token')

function App() {
  return (
    <Routes>
      <Route
        path='/login'
        element={getToken() ? <Navigate to='/' replace /> : <Login />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<Home />} />
        <Route path='/catalog' element={<Catalog />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/plant/:id' element={<Detail />} />

        <Route element={<AdminRoute />}>
          <Route path='/administrate' element={<Administrate />} />
        </Route>
      </Route>

      <Route path='*' element={<Default />} />
    </Routes>
  )
}

export default App
