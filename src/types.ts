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


type Point = [
	number, // angle (will be multiplied by pi)
	number, // percent of draw radius (should be between 0 and 1)
	boolean? // connect to previous point (defaults to true)
]

export interface Sprite {
	drawRadius: number
	points: Point[]
}
