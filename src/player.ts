import type { Input, Vector2 } from "./types"


export default class Player {
	private static readonly ROTATION_RATE = 0.1
	private static readonly ACCELERATION = 0.5
	private static readonly FRICTION_COEFFICIENT = 0.05

	public get position(): Vector2 {
		return this._position
	}

	public get rotation(): number {
		return this._rotation
	}

	private _position: Vector2
	private _velocity: Vector2
	private _rotation: number

	public constructor() {
		this._position = { x: 0, y: 0 }
		this._velocity = { x: 0, y: 0 }
		this._rotation = 0
	}

	public update(delta: number, input: Input): void {
		this.handleRotation(input)
		this.handlePosition(delta, input)
	}

	private handleRotation(input: Input): void {
		if (input.right) {
			this._rotation -= Player.ROTATION_RATE
		}

		if (input.left) {
			this._rotation += Player.ROTATION_RATE
		}

		if (this._rotation > 2 * Math.PI) {
			this._rotation -= 2 * Math.PI
		} else if (this._rotation < 0) {
			this._rotation += 2 * Math.PI
		}
	}

	private handlePosition(delta: number, input: Input): void {
		const acceleration: Vector2 = { x: 0, y: 0 }
		if (input.up) {
			acceleration.x = Math.cos(this._rotation) * Player.ACCELERATION
			acceleration.y = Math.sin(this._rotation) * Player.ACCELERATION
		}

		this._velocity.x += acceleration.x - this._velocity.x * Player.FRICTION_COEFFICIENT
		this._velocity.y += acceleration.y - this._velocity.y * Player.FRICTION_COEFFICIENT
		if (Math.abs(this._velocity.x) < 0.01) {
			this._velocity.x = 0
		}
		if (Math.abs(this._velocity.y) < 0.01) {
			this._velocity.y = 0
		}

		this._position.x += this._velocity.x * delta
		this._position.y += this._velocity.y * delta

		if (this._position.x > 5) {
			this._position.x -= 10
		} else if (this._position.x < -5) {
			this._position.x += 10
		}

		if (this._position.y > 5) {
			this._position.y -= 10
		} else if (this._position.y < -5) {
			this._position.y += 10
		}
	}
}
