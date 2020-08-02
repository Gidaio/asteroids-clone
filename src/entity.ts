import type Game from "./game"
import type { Input } from "./types"
import Vector2 from "./vector2.js"
import Animator from "./animator.js"


export default abstract class Entity {
	public abstract readonly TYPE: string

	public abstract readonly COLLISION_RADIUS: number
	protected readonly _game: Game

	public animator: Animator | null = null
	public position: Vector2 = new Vector2(0, 0)
	public direction: number = 0

	public constructor(game: Game) {
		this._game = game
	}

	public onCreate(): void {}
	public onUpdate(delta: number, input: Input): void {
		this.animator?.onUpdate(delta)
	}
	public onCollision(entity: Entity): void {}
}
