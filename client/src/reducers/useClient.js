import { useReducer } from 'react'
import asana from 'asana'

const initialState = {
	client: asana.Client.create(),
	accessToken: null,
	refreshToken: null,
}

const initializer = state => {
	const accessToken = localStorage.getItem('access_token')
	const refreshToken = localStorage.getItem('refresh_token')

	state.client.useAccessToken(accessToken)
	state.accessToken = accessToken
	state.refreshToken = refreshToken

	return state
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'update': {
			const { accessToken, refreshToken } = action

			localStorage.setItem('access_token', accessToken)
			localStorage.setItem('access_token', refreshToken)
			state.client.useAccessToken(accessToken)
			state.accessToken = accessToken
			state.refreshToken = refreshToken

			return {
				...state,
			}
		}
		case 'reset': {
			console.log('reset')
			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')
			state.client.useAccessToken(null)
			state.accessToken = null
			state.refreshToken = null

			return {
				...state,
			}
		}
		default:
			return state
	}
}

export function useClient() {
	const [state, dispatch] = useReducer(reducer, initialState, initializer)
	const { accessToken, refreshToken } = state

	return {
		...state,
		updateClient: tokens =>
			dispatch({ type: 'update', accessToken, refreshToken, ...tokens }),
		resetClient: () => dispatch({ type: 'reset' }),
	}
}
