export default class Vector2 {
	public x: number
	public y: number

	public constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	public add(scalar: number): Vector2
	public add(other: Vector2): Vector2
	public add(other: Vector2 | number): Vector2 {
		if (typeof other === "number") {
			return new Vector2(this.x + other, this.y + other)
		} else {
			return new Vector2(this.x + other.x, this.y + other.y)
		}
	}

	public subtract(scalar: number): Vector2
	public subtract(other: Vector2): Vector2
	public subtract(other: Vector2 | number): Vector2 {
		if (typeof other === "number") {
			return new Vector2(this.x - other, this.y - other)
		} else {
			return new Vector2(this.x - other.x, this.y - other.y)
		}
	}

	public multiply(scalar: number): Vector2 {
		return new Vector2(this.x * scalar, this.y * scalar)
	}

	public magnitudeSquared(): number {
		return this.x ** 2 + this.y ** 2
	}
}
