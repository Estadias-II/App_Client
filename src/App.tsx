import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        {/* Agrega más rutas según necesites */}
      </Routes>
    </div>
  )
}

export default App