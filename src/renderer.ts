import type { GameState, Sprite } from "./types"
import Vector2 from "./vector2.js"


export default class Renderer {
	private static readonly GAME_DIMENSION = 10

	private canvas: HTMLCanvasElement
	private context: CanvasRenderingContext2D
	private ppm: number

	public constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.canvas = canvas
		this.context = context
		this.ppm = 0
	}

	public render(gameState: GameState): void {
		this.clearScreen()
		this.drawSpace()
		this.context.strokeStyle = "#FFF"
		this.context.beginPath()
		gameState.entities.forEach(entity => {
			if (!entity.animator) {
				return
			}

			const sprite = entity.animator.getSprite()

			this.drawPolarSprite(sprite, entity.position, entity.direction)
		})
		this.context.stroke()
	}

	private clearScreen(): void {
		this.context.fillStyle = "#FFF"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}

	private drawSpace(): void {
		this.context.fillStyle = "#000"
		const minimumDimension = Math.min(this.canvas.width, this.canvas.height)
		const top = this.canvas.height / 2 - minimumDimension / 2
		const left = this.canvas.width / 2 - minimumDimension / 2
		this.context.fillRect(left, top, minimumDimension, minimumDimension)
		this.ppm = minimumDimension / Renderer.GAME_DIMENSION
	}

	private drawPolarSprite(sprite: Sprite, position: Vector2, direction: number): void {
		const canvasPosition = this.getCanvasPosition(position)
		const canvasDirection = 2 * Math.PI - direction
		const canvasRadius = sprite.drawRadius * this.ppm

		for (const point of sprite.points) {
			const x = canvasPosition.x + Math.cos(canvasDirection + point[0] * Math.PI) * canvasRadius * point[1]
			const y = canvasPosition.y + Math.sin(canvasDirection + point[0] * Math.PI) * canvasRadius * point[1]
			if (point.length === 3 && !point[2]) {
				this.context.moveTo(x, y)
			} else {
				this.context.lineTo(x, y)
			}
		}
	}

	private getCanvasPosition(position: Vector2): Vector2 {
		return this.flipY(position)
			.multiply(this.ppm)
			.add(new Vector2(this.canvas.width, this.canvas.height).multiply(0.5))
	}

	private flipY(vector: Vector2): Vector2 {
		return new Vector2(vector.x, -vector.y)
	}
}
