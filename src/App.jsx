import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import SDGDisc from './components/SDGDisc/SDGDisc'
import PieChart from './components/PieChart/PieChart'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage'
import GoalPage from './pages/GoalPage/GoalPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/goal/:goalId" element={<GoalPage />} />
        {/* <Route path="/user/:userId" element={<User />} /> */}
      </Routes>
    </Router>
  )
}

export default App
