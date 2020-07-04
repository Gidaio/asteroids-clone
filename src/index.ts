window.addEventListener("resize", () => {
	setCanvasSize()
	drawDummyData()
})

const canvas = document.getElementById("game") as HTMLCanvasElement
const context = canvas.getContext("2d")!
setCanvasSize()
drawDummyData()


function setCanvasSize(): void {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}

function drawDummyData(): void {
	context.fillStyle = "#000"
	context.fillRect(0, 0, canvas.width, canvas.height)

	context.strokeStyle = "#EEE"
	context.strokeRect(10, 10, 50, 50)
}
