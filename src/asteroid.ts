import Vector2 from "./vector2.js"


type PointRadii = [number, number, number, number, number, number, number, number, number]

export default class Asteroid {
	private _position: Vector2
	public get position(): Vector2 {
		return this._position
	}

	private _pointRadii: PointRadii
	public get pointRadii(): PointRadii {
		return this._pointRadii
	}

	private _rotation: number
	public get rotation(): number {
		return this._rotation
	}

	public constructor(position: Vector2) {
		this._position = position
		this._pointRadii = new Array<number>(9).fill(0).map(() => 1 - Math.random() / 2) as PointRadii
		this._rotation = Math.random() * 2 * Math.PI
	}
}