import type { Input, Vector2 } from "./types"


export default class Player {
	private static readonly ROTATION_RATE = 0.1
	private static readonly MOVE_RATE = 0.1

	public get position(): Vector2 {
		return this._position
	}

	public get rotation(): number {
		return this._rotation
	}

	private _position: Vector2
	private _rotation: number

	public constructor() {
		this._position = { x: 0, y: 0 }
		this._rotation = 0
	}

	public update(input: Input): void {
		this.handleRotation(input)
		this.handlePosition(input)
	}

	private handleRotation(input: Input): void {
		if (input.right) {
			this._rotation -= Player.ROTATION_RATE
		}

		if (input.left) {
			this._rotation += Player.ROTATION_RATE
		}

		if (this._rotation > 2 * Math.PI) {
			this._rotation -= 2 * Math.PI
		} else if (this._rotation < 0) {
			this._rotation += 2 * Math.PI
		}
	}

	private handlePosition(input: Input): void {
		if (input.up) {
			this._position.x += Math.cos(this._rotation) * Player.MOVE_RATE
			this._position.y += Math.sin(this._rotation) * Player.MOVE_RATE
		}

		if (this._position.x > 5) {
			this._position.x -= 10
		} else if (this._position.x < -5) {
			this._position.x += 10
		}

		if (this._position.y > 5) {
			this._position.y -= 10
		} else if (this._position.y < -5) {
			this._position.y += 10
		}
	}
}
