import Login from './Login/Login'
import Navbar from './Navbar/Navbar'
import {Routes, Route, Navigate} from 'react-router-dom'
import Play from './Play/Play'
import Profile from './Profile/Profile'
import Leaderboard from './Leaderboard/Leaderboard'

function App() {
 
  return (
    <>
    <Navbar/>
      <Routes>
          <Route path="/play" element={<Play />}  />
          <Route path="/login" element={<Login />}  />  
          <Route path="/profile" element={<Profile />}  />
          <Route path="/leaderboard" element={<Leaderboard />}  />
      </Routes>
    </>
  )
}

export default App
