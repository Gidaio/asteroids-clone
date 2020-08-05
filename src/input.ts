type Button = "left" | "right" | "thrust" | "shoot" | "teleport"

export interface Input {
	isButtonJustPressed: (button: Button) => boolean
	isButtonDown: (button: Button) => boolean
}


interface RawInput {
	right: boolean
	up: boolean
	left: boolean
	down: boolean
	space: boolean
}

type ButtonState = "up" | "pressed" | "down" | "released"

interface ProcessedInput {
	left: ButtonState
	right: ButtonState
	thrust: ButtonState
	shoot: ButtonState
	teleport: ButtonState
}

export class GameInput implements Input {
	private _rawInput: RawInput = {
		right: false,
		up: false,
		left: false,
		down: false,
		space: false
	}

	private _processedInput: ProcessedInput = {
		left: "up",
		right: "up",
		thrust: "up",
		shoot: "up",
		teleport: "up"
	}

	public isButtonDown(button: Button): boolean {
		return this._processedInput[button] === "down" || this._processedInput[button] === "pressed"
	}

	public isButtonJustPressed(button: Button): boolean {
		return this._processedInput[button] === "pressed"
	}

	public updateInput(): void {
		this.updateButton("right", "right")
		this.updateButton("up", "thrust")
		this.updateButton("left", "left")
		this.updateButton("down", "teleport")
		this.updateButton("space", "shoot")
	}

	private updateButton(rawKey: keyof RawInput, processedButton: keyof ProcessedInput) {
		if (this._rawInput[rawKey]) {
			if (this._processedInput[processedButton] === "up" || this._processedInput[processedButton] === "released") {
				this._processedInput[processedButton] = "pressed"
			} else if (this._processedInput[processedButton] === "pressed") {
				this._processedInput[processedButton] = "down"
			}
		} else {
			if (this._processedInput[processedButton] === "down" || this._processedInput[processedButton] === "pressed") {
				this._processedInput[processedButton] = "released"
			} else if (this._processedInput[processedButton] === "released") {
				this._processedInput[processedButton] = "up"
			}
		}
	}

	public processRawInputEvent(event: KeyboardEvent): void {
		const isKeyDown = event.type === "keydown" ? true : false

		switch (event.code) {
			case "ArrowRight":
				this._rawInput.right = isKeyDown
				break

			case "ArrowUp":
				this._rawInput.up = isKeyDown
				break

			case "ArrowLeft":
				this._rawInput.left = isKeyDown
				break

			case "ArrowDown":
				this._rawInput.down = isKeyDown
				break

			case "Space":
				this._rawInput.space = isKeyDown
				break
		}
	}
}
