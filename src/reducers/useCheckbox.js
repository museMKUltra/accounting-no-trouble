import { useReducer } from 'react'

const reducer = (state, action) => {
	switch (action.type) {
		case 'check': {
			return state.concat([action.checkbox])
		}
		case 'uncheck': {
			return state.filter(checkbox => checkbox !== action.checkbox)
		}
		case 'clean': {
			return []
		}
		default:
			return state
	}
}

export function useCheckbox() {
	const [state, dispatch] = useReducer(reducer, [], () => [])

	return {
		checkedCheckboxes: state,
		checkCheckbox: checkedCheckbox =>
			dispatch({ type: 'check', checkbox: checkedCheckbox }),
		uncheckCheckbox: uncheckedCheckbox =>
			dispatch({ type: 'uncheck', checkbox: uncheckedCheckbox }),
		cleanCheckbox: uncheckedCheckbox =>
			dispatch({ type: 'clean', checkbox: uncheckedCheckbox }),
	}
}
