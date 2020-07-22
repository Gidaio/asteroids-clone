import type { GameState, Input } from "./types"

import Asteroid from "./asteroid.js"
import Player from "./player.js"
import Renderer from "./renderer.js"
import Vector2 from "./vector2.js"


export default class Game {
	private gameState: GameState
	private renderer: Renderer
	private input: Input

	private previousTimestamp: DOMHighResTimeStamp

	public constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.gameState = {
			entities: [
				new Player(),
				new Asteroid(new Vector2(2, 2), 1, 1),
				new Asteroid(new Vector2(2, -2), 1.5, 1),
				new Asteroid(new Vector2(-2, -2), 2, 1),
				new Asteroid(new Vector2(-2, 2), 1.5, 1)
			]
		}
		this.renderer = new Renderer(canvas, context)
		this.input = {
			right: false,
			up: false,
			left: false,
			down: false,
			space: false
		}
		this.previousTimestamp = performance.now()

		document.addEventListener("keydown", this.processInput.bind(this))
		document.addEventListener("keyup", this.processInput.bind(this))
		this.queueFrame()
	}

	private loop(timestamp: DOMHighResTimeStamp) {
		const delta = (timestamp - this.previousTimestamp) / 1000

		this.gameState.entities.forEach(entity => entity.update(delta, this.input))

		this.renderer.render(this.gameState)
		this.previousTimestamp = timestamp
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
