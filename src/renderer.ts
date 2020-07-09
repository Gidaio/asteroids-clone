import type Asteroid from "./asteroid"
import type Player from "./player"
import type { GameState } from "./types"

import Vector2 from "./vector2.js"


type Frame = Point[]
type Point = [number, number, boolean?]
//						angle   radius  connect to previous (default true)
//						(will be multiplied by pi)

export default class Renderer {
	private static readonly GAME_DIMENSION = 10
	private static readonly PLAYER_SPRITE: Frame[] = [
		[
			[0, 1, false],
			[4 / 5, 1],
			[1, 1 / 2],
			[6 / 5, 1],
			[0, 1]
		],
		[
			[0, 1, false],
			[4 / 5, 1],
			[1, 1 / 2],
			[6 / 5, 1],
			[0, 1],
			[19 / 20, 5 / 8, false],
			[1, 5 / 4],
			[21 / 20, 5 / 8]
		],
		[
			[0, 1, false],
			[4 / 5, 1],
			[1, 1 / 2],
			[6 / 5, 1],
			[0, 1],
			[9 / 10, 3 / 4, false],
			[1, 7 / 4],
			[11 / 10, 3 / 4]
		]
	]

	private canvas: HTMLCanvasElement
	private context: CanvasRenderingContext2D
	private minimumDimension: number

	public constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.canvas = canvas
		this.context = context
		this.minimumDimension = 0
	}

	public render(gameState: GameState): void {
		this.clearScreen()
		this.drawSpace()
		this.drawPlayer(gameState.player)
		this.drawAsteroids(gameState.asteroids)
	}

	private drawPlayer(player: Player): void {
		this.context.strokeStyle = "#FFF"
		const ppm = this.minimumDimension / Renderer.GAME_DIMENSION
		const playerRadius = 0.25 * ppm
		const playerX = player.position.x * ppm + this.canvas.width / 2
		const playerY = -player.position.y * ppm + this.canvas.height / 2
		const rotation = 2 * Math.PI - player.rotation

		const frame = Renderer.PLAYER_SPRITE[player.frame]
		this.context.beginPath()
		for (const point of frame) {
			const x = playerX + Math.cos(rotation + point[0] * Math.PI) * playerRadius * point[1]
			const y = playerY + Math.sin(rotation + point[0] * Math.PI) * playerRadius * point[1]
			if (point.length === 3 && !point[2]) {
				this.context.moveTo(x, y)
			} else {
				this.context.lineTo(x, y)
			}
		}
		this.context.stroke()
	}

	private drawSpace(): void {
		this.context.fillStyle = "#000"
		this.minimumDimension = Math.min(this.canvas.width, this.canvas.height)
		const top = this.canvas.height / 2 - this.minimumDimension / 2
		const left = this.canvas.width / 2 - this.minimumDimension / 2
		this.context.fillRect(left, top, this.minimumDimension, this.minimumDimension)
	}

	private clearScreen(): void {
		this.context.fillStyle = "#FFF"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}

	private drawAsteroids(asteroids: Asteroid[]): void {
		for (const asteroid of asteroids) {
			this.drawAsteroid(asteroid)
		}
	}

	private drawAsteroid(asteroid: Asteroid): void {
		const ppm = this.minimumDimension / Renderer.GAME_DIMENSION

		this.context.beginPath()
		for (let pointIndex = 0; pointIndex < 9; pointIndex++) {
			const angle = pointIndex * 2 * Math.PI / 9

			const asteroidRadius = 0.25 * ppm * asteroid.pointRadii[pointIndex]
			const asteroidPosition = asteroid.position.multiply(ppm).add(new Vector2(this.canvas.width, this.canvas.height).multiply(0.5))
			const pointPosition = asteroidPosition.add(new Vector2(Math.cos(angle), Math.sin(angle)).multiply(asteroidRadius))
			this.context.lineTo(
				pointPosition.x,
				pointPosition.y
			)
		}

		this.context.closePath()
		this.context.stroke()
	}
}
