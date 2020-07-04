const express = require("express")

const app = express()

app.use("/", express.static("html"))
app.use("/", express.static("out"))

app.listen(8080, () => console.log("Listening!"))
