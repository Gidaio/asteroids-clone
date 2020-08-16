import Asteroid from "./asteroid.js"
import Entity from "./entity.js"
import Player from "./player.js"
import Vector2 from "./vector2.js"


export default class LevelManager extends Entity {
	public readonly TYPE = "LEVEL_MANAGER"
	public readonly COLLISION_RADIUS = 0

	private _levelFinished = true
	private _counter = 0
	private _level = 0

	public onUpdate(delta: number): void {
		if (this._levelFinished) {
			this._counter -= delta
			if (this._counter <= 0) {
				this._levelFinished = false
				this.createNextLevel()
			}
		} else {
			if (this._game.getEntityCountOfType("ASTEROID") === 0) {
				this._levelFinished = true
				this._counter = 3
			}
		}
	}

	private createNextLevel(): void {
		this._game.destroyAllEntitiesOfType("PLAYER")
		this._game.destroyAllEntitiesOfType("SHOT")
		this._level++
		this._game.instantiateEntity(Player)
		for (let i = 0; i < this._level; i++) {
			this.createAsteroid()
		}
	}

	private createAsteroid(): void {
		const asteroid = this._game.instantiateEntity(Asteroid)
		const angle = Math.random() * 2 * Math.PI
		const x = Math.cos(angle) * 2.5
		const y = Math.sin(angle) * 2.5
		asteroid.position = new Vector2(x, y)
	}
}
