import Asteroid from "./asteroid.js"
import Entity from "./entity.js"
import Player from "./player.js"
import TitleManager from "./titleManager.js"
import Vector2 from "./vector2.js"


export default class LevelManager extends Entity {
	public readonly TYPE = "LEVEL_MANAGER"
	public readonly COLLISION_RADIUS = 0

	private _levelFinished = true
	private _playerDied = false
	private _counter = 0
	private _level = 0

	public onUpdate(delta: number): void {
		if (this._levelFinished || this._playerDied) {
			this._counter -= delta
			if (this._counter <= 0) {
				if (this._levelFinished) {
					this._levelFinished = false
					this.createNextLevel()
				} else {
					this._game.destroyAllEntitiesOfType("ASTEROID")
					this._game.destroyAllEntitiesOfType("SHOT")
					this._game.destroyEntity(this)
					this._game.instantiateEntity(TitleManager)
				}
			}
		} else {
			if (this._game.getEntityCountOfType("ASTEROID") === 0) {
				this._levelFinished = true
				this._counter = 3
			} else if (this._game.getEntityCountOfType("PLAYER") === 0) {
				this._playerDied = true
				this._counter = 4
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
