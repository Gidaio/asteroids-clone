export default class Renderer {
	private canvas: HTMLCanvasElement
	private context: CanvasRenderingContext2D

	public constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.canvas = canvas
		this.context = context
	}

	public render(): void {
		this.context.fillStyle = "#000"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.context.strokeStyle = "#EEE"
		this.context.strokeRect(10, 10, 50, 50)
	}
}
