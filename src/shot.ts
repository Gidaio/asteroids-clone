import Entity from "./entity.js"
import type { Input, Sprite } from "./types"
import Animator from "./animator.js"


const SHOT_SPRITE: Sprite = {
	drawRadius: 0.0625,
	points: [
		[0, 1, false],
		[1 - 1 / 7, 1],
		[1 + 1 / 7, 1],
		[0, 1]
	]
}


export default class Shot extends Entity {
	public readonly TYPE = "SHOT"

	public readonly COLLISION_RADIUS = 0.0625

	private static readonly SPEED = 5
	private static readonly MAX_LIFETIME = 1.5

	private _lifetime = 0

	public animator = new Animator(
		{
			default: {
				framesPerSecond: 0,
				frames: [SHOT_SPRITE]
			}
		},
		"default"
	)

	public onUpdate(delta: number, input: Input) {
		if (this._lifetime >= Shot.MAX_LIFETIME) {
			this._game.destroyEntity(this)
			return
		}

		this.position.x += Math.cos(this.direction) * Shot.SPEED * delta
		if (this.position.x > 5) {
			this.position.x -= 10
		} else if (this.position.x < -5) {
			this.position.x += 10
		}
		
		this.position.y += Math.sin(this.direction) * Shot.SPEED * delta
		if (this.position.y > 5) {
			this.position.y -= 10
		} else if (this.position.y < -5) {
			this.position.y += 10
		}

		this._lifetime += delta
	}

	public onCollision(entity: Entity) {
		if (entity.TYPE === "ASTEROID") {
			this._game.destroyEntity(this)
		}
	}
}
