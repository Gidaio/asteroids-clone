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
	public get velocity(): Vector2 {
		return this._velocity
	}

	private _rotationRate = 0

	public size: number = 2

	public onCreate(): void {
		let xPos = Math.random() < 0.5 ? -2 : 2
		let yPos = Math.random() < 0.5 ? -2 : 2

		this.position = new Vector2(xPos, yPos)
		this.direction = Math.random() * 2 * Math.PI
		this._rotationRate = Math.random() * Math.PI / 2

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
		const actualSpeed = (1 + Math.random() * 1 - 1 / 2) / 2
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
}
