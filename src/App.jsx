import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter } from 'react-router-dom'
import Signup from './pages/Signup'
import GeneralInfo from './pages/Generalinfo'

function App() {

  

  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <GeneralInfo/>
      </BrowserRouter>
    </>
  )
}

export default App
