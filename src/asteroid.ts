import Vector2 from "./vector2.js"
import Entity from "./entity.js"


type PointRadii = [number, number, number, number, number, number, number, number, number]

export default class Asteroid extends Entity {
	public readonly RADIUS: number
	public readonly type = "ASTEROID"

	private _position: Vector2
	public get position(): Vector2 {
		return this._position
	}

	private _velocity: Vector2
	public get velocity(): Vector2 {
		return this._velocity
	}

	private _pointRadii: PointRadii
	public get pointRadii(): PointRadii {
		return this._pointRadii
	}

	private _rotation: number
	public get rotation(): number {
		return this._rotation
	}

	private _rotationRate: number

	public constructor(position: Vector2, size: number, speed: number) {
		super()

		this._position = position
		this._pointRadii = new Array<number>(9).fill(0).map(() => 1 - Math.random() / 2) as PointRadii
		this._rotation = Math.random() * 2 * Math.PI
		this._rotationRate = Math.random() * Math.PI / size

		const direction = Math.random() * 2 * Math.PI
		const actualSpeed = (speed + Math.random() * speed - speed / 2) / size
		this._velocity = new Vector2(Math.cos(direction), Math.sin(direction)).multiply(actualSpeed)

		this.RADIUS = 0.25 * size
	}

	public update(delta: number): void {
		this._rotation += this._rotationRate * delta
		this._position = this._position.add(this._velocity.multiply(delta))
		if (Math.abs(this._position.x) > 5) {
			this._position.x -= Math.sign(this._position.x) * 10
		}
		if (Math.abs(this._position.y) > 5) {
			this._position.y -= Math.sign(this._position.y) * 10
		}
	}
}
