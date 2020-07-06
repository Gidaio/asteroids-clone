import Game from "./game.js"

const canvas = document.getElementById("game") as HTMLCanvasElement
const context = canvas.getContext("2d")

if (context) {
	window.addEventListener("resize", () => {
		setCanvasSize()
	})

	setCanvasSize()

	const game = new Game(canvas, context)
} else {
	alert("Something went very wrong.")
}


function setCanvasSize(): void {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}
