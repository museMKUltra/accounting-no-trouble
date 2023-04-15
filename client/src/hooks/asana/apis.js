export function tasksForSectionGetter(client) {
	return async (sectionGid, payload) =>
		await client.tasks.getTasksForSection(sectionGid, payload)
}
