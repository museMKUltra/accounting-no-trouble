import './App.css'
import { Route, Routes } from 'react-router-dom'
import Board from './components/board/Board.js'
import Demo from './components/demo/Demo.js'
import Home from './components/Home.js'
import Issue from './components/issue/Issue.js'
import Oauth from './components/oauth/Oauth.js'
import Authorization from './components/oauth/Authorization.js'

function App() {
	return (
		<div className="App">
			<Routes>
				<Route
					path="/demo/*"
					element={
						<Authorization>
							<Demo path={'/demo'} />
						</Authorization>
					}
				/>
				<Route
					path="/board"
					element={
						<Authorization>
							<Board />
						</Authorization>
					}
				/>
				<Route
					path="/issue"
					element={
						<Authorization>
							<Issue />
						</Authorization>
					}
				/>
				<Route path="/oauth/*" element={<Oauth path={'/oauth'} />} />
				<Route
					path="/"
					element={
						<Authorization>
							<Home />
						</Authorization>
					}
				/>
			</Routes>
		</div>
	)
}

export default App
