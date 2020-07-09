import type Asteroid from "./asteroid"
import type Player from "./player"


export interface GameState {
	player: Player
	asteroids: Asteroid[]
}

export interface Input {
	right: boolean
	up: boolean
	left: boolean
	down: boolean
	space: boolean
}
