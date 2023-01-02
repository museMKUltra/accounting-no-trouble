import { Caretaker } from './Caretaker.js'
import { Originator } from './Originator.js'

export class Service {
	caretaker
	originator

	constructor(estimatedDateCount) {
		this.caretaker = new Caretaker()
		this.originator = new Originator()

		this.originator.estimatedDateCount = estimatedDateCount
	}

	estimatedDateCount() {
		return this.originator.estimatedDateCount
	}

	estimatedDateCountRecords() {
		const history = this.caretaker.history.map(
			({ estimatedDateCount }) => estimatedDateCount
		)

		return [...history, this.originator.estimatedDateCount]
	}

	update(estimatedDateCount) {
		const memento = this.originator.createState()

		this.caretaker.push(memento)
		this.originator.estimatedDateCount = estimatedDateCount
	}

	rollback() {
		if (this.caretaker.isEmpty()) return

		const memento = this.caretaker.pop()

		this.originator.estimatedDateCount = memento.estimatedDateCount
	}
}
