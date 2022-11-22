import { Memento } from './Memento.js'

export class Originator {
	estimatedDateCount

	createState() {
		return new Memento(this.estimatedDateCount)
	}

	restore(memento) {
		this.estimatedDateCount = memento.estimatedDateCount
	}
}
