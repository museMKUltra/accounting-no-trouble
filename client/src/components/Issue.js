import React, {useEffect} from 'react'

import {
	WORKSPACE_GID as workspaceGid,
	PROJECT_GID_LIST as projectIdList,
} from '../configs/constent.js'
import {useTasksWithPayload} from '../hooks/asana/useTasksWithPayload'

const issueProjectGid = projectIdList.ISSUE
const issueSectionGid = '1201191083505009'

function Issue() {
	const {
		isFetching: isTasksFetching,
		tasks,
		fetchTasks,
	} = useTasksWithPayload()

	useEffect(() => {
		async function fetchIssueTasks() {
			await fetchTasks(workspaceGid, {
				'projects.any': issueProjectGid,
				'sections.any': issueSectionGid,
			})
		}

		fetchIssueTasks()
	}, [])

	return <>
		{isTasksFetching ? (
			<p>fetching...</p>
		) : (
			<div>{JSON.stringify(tasks)}</div>
		)}
</>
}

export default Issue
