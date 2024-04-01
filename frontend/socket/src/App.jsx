import { useEffect, useMemo, useState } from 'react'

import './App.css'

import {io}  from "socket.io-client"
import Signup from '../pages/Signup'
import Allroutes from '../components/Allroutes'
import Navbar from '../components/Navbar'

function App() {



  return (
    <>

<Navbar/>
<Allroutes/>

    </>
  )
}

export default App
