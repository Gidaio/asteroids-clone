import Asteroid from "./asteroid.js"
import type Entity from "./entity.js"
import Player from "./player.js"
import Renderer from "./renderer.js"
import type { GameState, Input } from "./types"


export default class Game {
	private gameState: GameState = {
		entities: []
	}
	private renderer: Renderer
	private input: Input = {
		right: false,
		up: false,
		left: false,
		down: false,
		space: false
	}
	private entitiesToDestroy: Entity[] = []
	private previousTimestamp: DOMHighResTimeStamp = performance.now()

	public constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.renderer = new Renderer(canvas, context)
		this.instantiateEntity(Player)
		this.instantiateEntity(Asteroid)
		this.instantiateEntity(Asteroid)
		this.instantiateEntity(Asteroid)
		this.instantiateEntity(Asteroid)

		document.addEventListener("keydown", this.processInput.bind(this))
		document.addEventListener("keyup", this.processInput.bind(this))
		this.queueFrame()
	}

	public instantiateEntity<T extends Entity>(entityType: new (game: Game) => T): T {
		const entity = new entityType(this)
		entity.onCreate()
		this.gameState.entities.push(entity)

		return entity
	}

	public destroyEntity(entity: Entity): void {
		this.entitiesToDestroy.push(entity)
	}

	private loop(timestamp: DOMHighResTimeStamp) {
		const delta = (timestamp - this.previousTimestamp) / 1000

		// Updates
		this.gameState.entities.forEach(entity => entity.onUpdate(delta, this.input))

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
