import type { Input, Vector2 } from "./types"


export default class Player {
	private static readonly TORQUE = 4
	private static readonly ACCELERATION = 0.5
	private static readonly LINEAR_FRICTION = 0.05
	private static readonly ANGULAR_FRICTION = 0.5

	public get position(): Vector2 {
		return this._position
	}

	public get rotation(): number {
		return this._rotation
	}

	private _position: Vector2
	private _linearVelocity: Vector2
	private _rotation: number
	private _angularVelocity: number

	public constructor() {
		this._position = { x: 0, y: 0 }
		this._linearVelocity = { x: 0, y: 0 }
		this._rotation = 0
		this._angularVelocity = 0
	}

	public update(delta: number, input: Input): void {
		this.handleRotation(delta, input)
		this.handlePosition(delta, input)
	}

	private handleRotation(delta: number, input: Input): void {
		let torque = 0

		if (input.right) {
			torque -= Player.TORQUE
		}

		if (input.left) {
			torque += Player.TORQUE
		}

		this._angularVelocity += torque - this._angularVelocity * Player.ANGULAR_FRICTION
		this._rotation += this._angularVelocity * delta

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

		this._linearVelocity.x += acceleration.x - this._linearVelocity.x * Player.LINEAR_FRICTION
		this._linearVelocity.y += acceleration.y - this._linearVelocity.y * Player.LINEAR_FRICTION
		if (Math.abs(this._linearVelocity.x) < 0.01) {
			this._linearVelocity.x = 0
		}
		if (Math.abs(this._linearVelocity.y) < 0.01) {
			this._linearVelocity.y = 0
		}

		this._position.x += this._linearVelocity.x * delta
		this._position.y += this._linearVelocity.y * delta

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
