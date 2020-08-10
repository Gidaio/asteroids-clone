import Animator from "./animator.js"
import Debris from "./debris.js"
import Entity from "./entity.js"
import type { Input } from "./input"
import Shot from "./shot.js"
import type { Sprite } from "./types"
import Vector2 from "./vector2.js"


const PLAYER_SPRITES: Sprite[] = [
	{
		drawRadius: 0.25,
		points: [
			[0, 1, false],
			[4 / 5, 1],
			[1, 1 / 2],
			[6 / 5, 1],
			[0, 1]
		]
	},
	{
		drawRadius: 0.25,
		points: [
			[0, 1, false],
			[4 / 5, 1],
			[1, 1 / 2],
			[6 / 5, 1],
			[0, 1],
			[19 / 20, 5 / 8, false],
			[1, 5 / 4],
			[21 / 20, 5 / 8]
		]
	},
	{
		drawRadius: 0.25,
		points: [
			[0, 1, false],
			[4 / 5, 1],
			[1, 1 / 2],
			[6 / 5, 1],
			[0, 1],
			[9 / 10, 3 / 4, false],
			[1, 7 / 4],
			[11 / 10, 3 / 4]
		]
	}
]


export default class Player extends Entity {
	public readonly TYPE = "PLAYER"

	public readonly COLLISION_RADIUS = 0.25

	private static readonly TORQUE = 4
	private static readonly ACCELERATION = 0.5
	private static readonly LINEAR_FRICTION = 0.05
	private static readonly ANGULAR_FRICTION = 0.5

	private _linearVelocity = new Vector2(0, 0)
	private _angularVelocity = 0

	public animator = new Animator(
		{
			idle: {
				framesPerSecond: 0,
				frames: [PLAYER_SPRITES[0]]
			},
			moving: {
				framesPerSecond: 10,
				frames: PLAYER_SPRITES.slice(1)
			}
		},
		"idle"
	)

	public onUpdate(delta: number, input: Input): void {
		super.onUpdate(delta, input)
		this.handleRotation(delta, input)
		this.handlePosition(delta, input)
		this.handleShooting(input)
		this.handleAnimation(input)
	}

	public onCollision(entity: Entity): void {
		if (entity.TYPE === "ASTEROID") {
			console.log(this, entity)
			this._game.destroyEntity(this)
			const neDebris = this._game.instantiateEntity(Debris)
			const nwDebris = this._game.instantiateEntity(Debris)
			const swDebris = this._game.instantiateEntity(Debris)
			const seDebris = this._game.instantiateEntity(Debris)
			neDebris.position = this.position
			nwDebris.position = this.position
			swDebris.position = this.position
			seDebris.position = this.position
			neDebris.linearVelocity = new Vector2(1, 1).normalize().multiply(2)
			nwDebris.linearVelocity = new Vector2(1, -1).normalize().multiply(2)
			swDebris.linearVelocity = new Vector2(-1, -1).normalize().multiply(2)
			seDebris.linearVelocity = new Vector2(-1, 1).normalize().multiply(2)
			neDebris.angularVelocity = 2 * Math.PI
			nwDebris.angularVelocity = 2 * Math.PI
			swDebris.angularVelocity = 2 * Math.PI
			seDebris.angularVelocity = 2 * Math.PI
		}
	}

	private handleRotation(delta: number, input: Input): void {
		let torque = 0

		if (input.isButtonDown("right")) {
			torque -= Player.TORQUE
		}

		if (input.isButtonDown("left")) {
			torque += Player.TORQUE
		}

		this._angularVelocity += torque - this._angularVelocity * Player.ANGULAR_FRICTION

		if (Math.abs(this._angularVelocity) < 0.01) {
			this._angularVelocity = 0
		}

		this.direction += this._angularVelocity * delta

		if (this.direction > 2 * Math.PI) {
			this.direction -= 2 * Math.PI
		} else if (this.direction < 0) {
			this.direction += 2 * Math.PI
		}
	}

	private handlePosition(delta: number, input: Input): void {
		const acceleration = new Vector2(0, 0)
		if (input.isButtonDown("thrust")) {
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

	private handleShooting(input: Input): void {
		if (input.isButtonJustPressed("shoot")) {
			const shot = this._game.instantiateEntity(Shot)
			shot.position = new Vector2(
				this.position.x + Math.cos(this.direction) * this.COLLISION_RADIUS,
				this.position.y + Math.sin(this.direction) * this.COLLISION_RADIUS
			)
			shot.direction = this.direction
			shot.addedVelocity = this._linearVelocity.clone()
		}
	}

	private handleAnimation(input: Input): void {
		if (input.isButtonDown("thrust")) {
			this.animator.setAnimation("moving")
		} else {
			this.animator.setAnimation("idle")
		}
	}
}
