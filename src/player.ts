import Entity from "./entity.js"
import type { Input } from "./types"
import Vector2 from "./vector2.js"


export default class Player extends Entity {
	public readonly TYPE = "PLAYER"

	public readonly COLLISION_RADIUS = 0.25

	private static readonly TORQUE = 4
	private static readonly ACCELERATION = 0.5
	private static readonly LINEAR_FRICTION = 0.05
	private static readonly ANGULAR_FRICTION = 0.5
	private static readonly FRAMES_PER_SECOND = 10

	private _linearVelocity = new Vector2(0, 0)
	private _angularVelocity = 0

	private _frame = 0
	public get frame(): number {
		return Math.floor(this._frame)
	}

	public onUpdate(delta: number, input: Input): void {
		this.handleRotation(delta, input)
		this.handlePosition(delta, input)
		this.handleAnimation(delta, input)
	}

	public onCollision(entity: Entity): void {
		if (entity.TYPE === "ASTEROID") {
			console.log(this, entity)
			this.game.destroyEntity(this)
		}
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
		this.direction += this._angularVelocity * delta

		if (this.direction > 2 * Math.PI) {
			this.direction -= 2 * Math.PI
		} else if (this.direction < 0) {
			this.direction += 2 * Math.PI
		}
	}

	private handlePosition(delta: number, input: Input): void {
		const acceleration = new Vector2(0, 0)
		if (input.up) {
			acceleration.x = Math.cos(this.direction) * Player.ACCELERATION
			acceleration.y = Math.sin(this.direction) * Player.ACCELERATION
		}

		this._linearVelocity = this._linearVelocity.add(acceleration).subtract(this._linearVelocity.multiply(Player.LINEAR_FRICTION))

		if (Math.abs(this._linearVelocity.x) < 0.01) {
			this._linearVelocity.x = 0
		}
		if (Math.abs(this._linearVelocity.y) < 0.01) {
			this._linearVelocity.y = 0
		}

		this.position = this.position.add(this._linearVelocity.multiply(delta))

		if (this.position.x > 5) {
			this.position.x -= 10
		} else if (this.position.x < -5) {
			this.position.x += 10
		}

		if (this.position.y > 5) {
			this.position.y -= 10
		} else if (this.position.y < -5) {
			this.position.y += 10
		}
	}

	private handleAnimation(delta: number, input: Input): void {
		if (input.up) {
			if (this._frame < 1) {
				this._frame += 1
			}

			this._frame += delta * Player.FRAMES_PER_SECOND
			if (this._frame >= 3) {
				this._frame -= 2
			}
		} else {
			this._frame = 0
		}
	}
}
