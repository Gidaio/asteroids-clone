import Renderer from "./renderer.js"


export default class Game {
	private renderer: Renderer

	public constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.renderer = new Renderer(canvas, context)
		this.queueFrame()
	}

	private loop(timestamp: DOMHighResTimeStamp) {
		this.renderer.render()
		this.queueFrame()
	}

	private queueFrame(): void {
		requestAnimationFrame(this.loop.bind(this))
	}
}
