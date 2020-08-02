import Entity from "./entity.js"
import Vector2 from "./vector2.js"


type PointRadii = [number, number, number, number, number, number, number, number, number]

export default class Asteroid extends Entity {
	public readonly RADIUS = 0.5
	public readonly TYPE = "ASTEROID"

	private _velocity = new Vector2(0, 0)
	public get velocity(): Vector2 {
		return this._velocity
	}

	private _pointRadii: PointRadii = [1, 1, 1, 1, 1, 1, 1, 1, 1]
	public get pointRadii(): PointRadii {
		return this._pointRadii
	}

	private _rotationRate = 0

	public onCreate(): void {
		let xPos = Math.random() < 0.5 ? -2 : 2
		let yPos = Math.random() < 0.5 ? -2 : 2

		this.position = new Vector2(xPos, yPos)
		this._pointRadii = new Array<number>(9).fill(0).map(() => 1 - Math.random() / 2) as PointRadii
		this.direction = Math.random() * 2 * Math.PI
		this._rotationRate = Math.random() * Math.PI / 2

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
