import type { GameState, Input } from "./types"

import Renderer from "./renderer.js"
import Player from "./player.js"


export default class Game {
	private gameState: GameState
	private renderer: Renderer
	private input: Input

	public constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.gameState = {
			player: new Player()
		}
		this.renderer = new Renderer(canvas, context)
		this.input = {
			right: false,
			up: false,
			left: false,
			down: false,
			space: false
		}
		document.addEventListener("keydown", this.processInput.bind(this))
		document.addEventListener("keyup", this.processInput.bind(this))
		this.queueFrame()
	}

	private loop(timestamp: DOMHighResTimeStamp) {
		this.gameState.player.update(this.input)
		this.renderer.render(this.gameState)
		this.queueFrame()
	}

	private queueFrame(): void {
		requestAnimationFrame(this.loop.bind(this))
	}

	private processInput(event: KeyboardEvent): void {
		const isKeyDown = event.type === "keydown" ? true : false

		switch (event.code) {
			case "ArrowRight":
				this.input.right = isKeyDown
				break

			case "ArrowUp":
				this.input.up = isKeyDown
				break

			case "ArrowLeft":
				this.input.left = isKeyDown
				break

			case "ArrowDown":
				this.input.down = isKeyDown
				break

			case "Space":
				this.input.space = isKeyDown
				break
		}
	}
}
