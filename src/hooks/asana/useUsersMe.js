import { client } from '../asana.js'
import { useEffect, useState } from 'react'

export function useUsersMe() {
	const [workspaces, setWorkspaces] = useState([])
	const [meGid, setMeGid] = useState('')
	const [isFetching, setIsFetching] = useState(false)

	async function fetchUsersMe() {
		try {
			setIsFetching(true)
			const response = await client.users.me()
			const {
				gid = '',
				workspaces = [],
				status = 200,
				message = 'no error message',
			} = response

			if (status !== 200) {
				throw new Error(message)
			}

			setMeGid(gid)
			setWorkspaces(workspaces)
		} catch (e) {
			console.error(e.message)
		} finally {
			setIsFetching(false)
		}
	}

	useEffect(() => {
		fetchUsersMe()
	}, [])

	return { isFetching, meGid, workspaces }
}
