import { useState } from 'react'
import Caruselconsola from './paginas/consola/Carrusel'
import Header from './components/Header'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>  
    <Header/>    
     <div> <Caruselconsola /> </div>
  </>

  )
}

export default App
