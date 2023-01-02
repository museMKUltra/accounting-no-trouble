export class Caretaker {
	history = []

	push(memento) {
		this.history.push(memento)
	}

	pop() {
		return this.history.pop()
	}

	isEmpty() {
		return this.history.length === 0
	}
}
