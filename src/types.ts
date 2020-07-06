import type Player from "./player"


export interface GameState {
	player: Player
}

export interface Input {
	right: boolean
	up: boolean
	left: boolean
	down: boolean
	space: boolean
}

export interface Vector2 {
	x: number
	y: number
}
