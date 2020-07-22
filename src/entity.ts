import type Game from "./game"
import type { Input } from "./types"
import Vector2 from "./vector2.js"


export default abstract class Entity {
	public abstract readonly RADIUS: number
	public abstract readonly TYPE: string
	protected readonly game: Game

	protected _position: Vector2 = new Vector2(0, 0)
	public get position(): Vector2 {
		return this._position
	}

	public constructor(game: Game) {
		this.game = game
	}

	public update(delta: number, input: Input): void {}
	public onCollision(entity: Entity): void {}
}
