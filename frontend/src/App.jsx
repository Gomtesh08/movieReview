import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Movie from './pages/Movie'

function App() {

  return (
    <div className='App' >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/movies/:id' element={<Movies />} />
          <Route path='/movies/:userId/getmoviewithreviews/:movieId' element={<Movie />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
