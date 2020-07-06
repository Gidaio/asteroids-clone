import type Player from "./player"
import type { GameState } from "./types"


export default class Renderer {
	private static readonly GAME_DIMENSION = 10

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
	}

	private drawPlayer(player: Player): void {
		this.context.strokeStyle = "#FFF"
		const ppm = this.minimumDimension / Renderer.GAME_DIMENSION
		const playerRadius = 0.25
		const playerX = player.position.x * ppm + this.canvas.width / 2
		const playerY = -player.position.y * ppm + this.canvas.height / 2
		this.context.beginPath()
		this.context.ellipse(
			playerX,
			playerY,
			playerRadius * ppm,
			playerRadius * ppm,
			2 * Math.PI - player.rotation,
			0,
			2 * Math.PI
		)
		this.context.lineTo(playerX, playerY)
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
}
