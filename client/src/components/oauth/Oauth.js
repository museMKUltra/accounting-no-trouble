import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Grant from './Grant.js'
import Callback from './Callback.js'
import Refresh from './Refresh.js'

function Oauth() {
	return (
		<Routes>
			<Route path={'/grant'} element={<Grant />} />
			<Route path={'/callback'} element={<Callback />} />
			<Route path={'/refresh'} element={<Refresh />} />
		</Routes>
	)
}

export default Oauth
