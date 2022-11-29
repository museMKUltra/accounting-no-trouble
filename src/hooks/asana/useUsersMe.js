import { client } from '../asana.js'
import { useEffect, useState } from 'react'

export function useUsersMe() {
	const [workspaces, setWorkspaces] = useState([])
	const [meGid, setMeGid] = useState('')
	const [isFetching, setIsFetching] = useState(false)

	async function fetchUsersMe() {
		try {
			setIsFetching(true)
			const { gid = '', workspaces = [] } = await client.users.me()

			setMeGid(gid)
			setWorkspaces(workspaces)
		} catch (e) {
			console.error(e)
		} finally {
			setIsFetching(false)
		}
	}

	useEffect(() => {
		fetchUsersMe()
	}, [])

	return { isFetching, meGid, workspaces }
}
