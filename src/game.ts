import Asteroid from "./asteroid.js"
import type Entity from "./entity.js"
import { GameInput } from "./input.js"
import Player from "./player.js"
import Renderer from "./renderer.js"
import type { GameState } from "./types"


export default class Game {
	private gameState: GameState = {
		entities: []
	}
	private renderer: Renderer
	private input: GameInput
	private entitiesToDestroy: Entity[] = []
	private previousTimestamp: DOMHighResTimeStamp = performance.now()

	public constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.renderer = new Renderer(canvas, context)
		this.input = new GameInput()

		this.instantiateEntity(Player)
		this.instantiateEntity(Asteroid)
		this.instantiateEntity(Asteroid)
		this.instantiateEntity(Asteroid)
		this.instantiateEntity(Asteroid)

		document.addEventListener("keydown", this.input.processRawInputEvent.bind(this.input))
		document.addEventListener("keyup", this.input.processRawInputEvent.bind(this.input))
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

		// Input
		this.input.updateInput()

		// Updates
		this.gameState.entities.forEach(entity => entity.onUpdate(delta, this.input))

		// Collisions
		this.gameState.entities.forEach((entity, index) => {
			for (let otherIndex = index + 1; otherIndex < this.gameState.entities.length; otherIndex++) {
				let other = this.gameState.entities[otherIndex]
				if (entity.position.subtract(other.position).magnitudeSquared() <= (entity.COLLISION_RADIUS + other.COLLISION_RADIUS) ** 2) {
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
}
