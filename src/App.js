import './App.css'
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom'
import Home from './Home.js'
import About from './About.js'
import Users from './Users.js'
import { fetch } from './asana'

function App() {
	fetch()
	return (
		<div className="App">
			<Router>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/about">About</Link>
						</li>
						<li>
							<Link to="/users">Users</Link>
						</li>
					</ul>
				</nav>
				<Routes>
					<Route path="/about" element={<About />} />
					<Route path="/users" element={<Users />} />
					<Route path="/" element={<Home />} />
				</Routes>
			</Router>
		</div>
	)
}

export default App
