export function tasksForSectionGetter(client) {
	return async (sectionGid, payload) =>
		await client.tasks.getTasksForSection(sectionGid, payload)
}

export function subtaskForTaskCreator(client) {
	return async (taskGid, payload) =>
		await client.tasks.createSubtaskForTask(taskGid, payload)
}
