import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import { ToastContainer } from'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
