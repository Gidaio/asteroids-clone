import type Entity from "./entity"


export interface GameState {
	entities: Entity[]
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
