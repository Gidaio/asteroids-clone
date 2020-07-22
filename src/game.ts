import Asteroid from "./asteroid.js"
import type Entity from "./entity.js"
import Player from "./player.js"
import Renderer from "./renderer.js"
import type { GameState, Input } from "./types"
import Vector2 from "./vector2.js"


export default class Game {
	private gameState: GameState
	private renderer: Renderer
	private input: Input
	private entitiesToDestroy: Entity[] = []

	private previousTimestamp: DOMHighResTimeStamp

	public constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.gameState = {
			entities: [
				new Player(this),
				new Asteroid(this, new Vector2(2, 2), 1, 1),
				new Asteroid(this, new Vector2(2, -2), 1.5, 1),
				new Asteroid(this, new Vector2(-2, -2), 2, 1),
				new Asteroid(this, new Vector2(-2, 2), 1.5, 1)
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

	public destroyEntity(entity: Entity): void {
		this.entitiesToDestroy.push(entity)
	}

	private loop(timestamp: DOMHighResTimeStamp) {
		const delta = (timestamp - this.previousTimestamp) / 1000

		// Updates
		this.gameState.entities.forEach(entity => entity.update(delta, this.input))

		// Collisions
		this.gameState.entities.forEach((entity, index) => {
			for (let otherIndex = index + 1; otherIndex < this.gameState.entities.length; otherIndex++) {
				let other = this.gameState.entities[otherIndex]
				if (entity.position.subtract(other.position).magnitudeSquared() <= (entity.RADIUS + other.RADIUS) ** 2) {
					entity.onCollision(other)
					other.onCollision(entity)
				}
			}
		})

		this.entitiesToDestroy.forEach(entity => {
			const entityIndex = this.gameState.entities.indexOf(entity)
			if (entityIndex == null) {
				console.warn(`Couldn't destroy entity ${entity}`)
			} else {
				this.gameState.entities.splice(entityIndex, 1)
			}
		})
		this.entitiesToDestroy = []

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
