import Animator from "./animator.js"
import Entity from "./entity.js"
import { Sprite } from "./types.js"
import Vector2 from "./vector2.js"


type PointRadii = [number, number, number, number, number, number, number, number, number]

export default class Asteroid extends Entity {
	public readonly TYPE = "ASTEROID"

	public get COLLISION_RADIUS(): number {
		return (this.size * this.size + this.size + 2) * 0.0625
	}

	private _velocity = new Vector2(0, 0)
	private _rotationRate = 0

	public size: number = 2

	public onCreate(): void {
		this.direction = Math.random() * 2 * Math.PI
		this._rotationRate = Math.random() * Math.PI / (this.size * 2 + 1)

		const pointRadii = new Array<number>(9).fill(0).map(() => 1 - Math.random() / 2) as PointRadii
		const sprite: Sprite = { drawRadius: this.COLLISION_RADIUS, points: pointRadii.map((radius, index) => [index * 2 / 9, radius]) }
		sprite.points.push([0, pointRadii[0]])
		sprite.points[0][2] = false

		this.animator = new Animator(
			{
				default: {
					framesPerSecond: 0,
					frames: [sprite]
				}
			},
			"default"
		)

		const direction = Math.random() * 2 * Math.PI
		const actualSpeed = (1 + Math.random() * 1 - 1 / 2) / (this.size + 1)
		this._velocity = new Vector2(Math.cos(direction), Math.sin(direction)).multiply(actualSpeed)
	}

	public onUpdate(delta: number): void {
		this.direction += this._rotationRate * delta
		this.position = this.position.add(this._velocity.multiply(delta))
		if (Math.abs(this.position.x) > 5) {
			this.position.x -= Math.sign(this.position.x) * 10
		}
		if (Math.abs(this.position.y) > 5) {
			this.position.y -= Math.sign(this.position.y) * 10
		}
	}

	public onCollision(entity: Entity) {
		if (entity.TYPE === "SHOT") {
			if (this.size === 0) {
				this._game.destroyEntity(this)
			} else {
				this.size -= 1
				this.onCreate()

				const sisterAsteroid = this._game.instantiateEntity(Asteroid)
				sisterAsteroid.position = this.position.clone()
				sisterAsteroid.size = this.size
			}
		}
	}
}
