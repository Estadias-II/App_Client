import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Principal from './components/Principal'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/principal" element={<Principal />} />
      </Routes>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App
