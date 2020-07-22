import type Entity from "./entity"


export interface GameState {
	entities: Entity[]
}

export interface Input {
	right: boolean
	up: boolean
	left: boolean
	down: boolean
	space: boolean
}
