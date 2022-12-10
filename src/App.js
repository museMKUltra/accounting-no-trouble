import './App.css'
import { Route, Routes } from 'react-router-dom'
import Board from './components/Board.js'
import Demo from './components/Demo.js'

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/demo/*" element={<Demo path={'/demo'} />} />
				<Route path="/board" element={<Board />} />
				<Route path="/" element={<Board />} />
			</Routes>
		</div>
	)
}

export default App
