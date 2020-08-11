import Animator from "./animator.js"
import Entity from "./entity.js"
import type { Input } from "./input.js"
import Vector2 from "./vector2.js"


export default class Debris extends Entity {
	public readonly TYPE = "DEBRIS"

	public readonly COLLISION_RADIUS = 0

	private _lifetime = 3

	public linearVelocity = new Vector2(0, 0)
	public angularVelocity = 0

	public animator = new Animator(
		{
			default: {
				framesPerSecond: 10,
				frames: [
					{
						drawRadius: 0.15,
						points: [
							[0, 1, false],
							[0.25, 0.15],
							[0.5, 1],
							[0.75, 0.15],
							[1, 1],
							[1.25, 0.15],
							[1.5, 1],
							[1.75, 0.15],
							[0, 1]
						]
					},
					{
						drawRadius: 0.15,
						points: [
							[0, 0.65, false],
							[0.25, 0.3],
							[0.5, 0.65],
							[0.75, 0.3],
							[1, 0.65],
							[1.25, 0.3],
							[1.5, 0.65],
							[1.75, 0.3],
							[0, 0.65]
						]
					}
				]
			}
		},
		"default"
	)


	public onUpdate(delta: number, input: Input) {
		super.onUpdate(delta, input)

		this.position = this.position.add(this.linearVelocity.multiply(delta))
		this.direction += this.angularVelocity * delta

		this._lifetime -= delta

		if (this._lifetime <= 0) {
			this._game.destroyEntity(this)
		}
	}
}
