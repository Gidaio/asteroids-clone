import type Asteroid from "./asteroid"
import type Player from "./player"
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
			switch (entity.TYPE) {
				case "PLAYER":
					this.drawPlayer(entity as Player)
					break

				case "ASTEROID":
					this.drawAsteroid(entity as Asteroid)
					break

				default:
					console.warn(`Can't draw entity of type '${entity.TYPE}'.`)
					break
			}
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

	private drawPlayer(player: Player): void {
		const playerCanvasPosition = this.getCanvasPosition(player.position)
		const playerCanvasRotation = 2 * Math.PI - player.direction
		const playerCanvasRadius = player.COLLISION_RADIUS * this.ppm

		const frame = player.sprites[player.frame]
		this.drawPolarSprite(frame, playerCanvasPosition, playerCanvasRotation, playerCanvasRadius)
	}

	private drawAsteroid(asteroid: Asteroid): void {
		const asteroidCanvasPosition = this.getCanvasPosition(asteroid.position)
		const asteroidCanvasRotation = 2 * Math.PI - asteroid.direction
		const asteroidCanvasRadius = asteroid.COLLISION_RADIUS * this.ppm

		const asteroidSprite: Sprite = asteroid.sprites[0]
		this.drawPolarSprite(asteroidSprite, asteroidCanvasPosition, asteroidCanvasRotation, asteroidCanvasRadius)
	}

	private drawPolarSprite(sprite: Sprite, canvasPosition: Vector2, canvasRotation: number, canvasRadius: number): void {
		for (const point of sprite.points) {
			const x = canvasPosition.x + Math.cos(canvasRotation + point[0] * Math.PI) * canvasRadius * point[1]
			const y = canvasPosition.y + Math.sin(canvasRotation + point[0] * Math.PI) * canvasRadius * point[1]
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
