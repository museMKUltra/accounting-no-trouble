import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Grant from './Grant.js'
import Callback from './Callback.js'

function Oauth() {
	return (
		<Routes>
			<Route path={'/grant'} element={<Grant />} />
			<Route path={'/callback'} element={<Callback />} />
		</Routes>
	)
}

export default Oauth
