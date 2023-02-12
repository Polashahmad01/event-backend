const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

const eventRoute = require("./api/event")
const tagsRoute = require("./api/tags")

const PORT = process.env.PORT || 5001

app.use(cors())

app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({ success: true, data: "Server is running" })
})

app.use("/api", eventRoute)
app.use("/api", tagsRoute)

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`)
})
