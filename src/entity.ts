import type Game from "./game"
import type { Input } from "./types"
import Vector2 from "./vector2.js"


export default abstract class Entity {
	public abstract readonly TYPE: string

	public abstract readonly COLLISION_RADIUS: number
	protected readonly game: Game

	public position: Vector2 = new Vector2(0, 0)
	public direction: number = 0

	public constructor(game: Game) {
		this.game = game
	}

	public onCreate(): void {}
	public onUpdate(delta: number, input: Input): void {}
	public onCollision(entity: Entity): void {}
}
