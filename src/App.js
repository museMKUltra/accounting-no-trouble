import './App.css'
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom'
import Home from './Home.js'
import About from './About.js'
import Users from './Users.js'

import { fetch } from './asana'
import { Service } from './memento'

function App() {
	fetch()

	const service = new Service(3)

	service.update(5)
	service.update(7)

	return (
		<div className="App">
			<div>{service.estimatedDateCountRecords().join(', ')}</div>
			<div>{service.estimatedDateCount()}</div>
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
					<Route path="/accounting-no-trouble" element={<Users />} />
					<Route path="/" element={<Home />} />
				</Routes>
			</Router>
		</div>
	)
}

export default App
