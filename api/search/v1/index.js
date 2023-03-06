const router = require("express").Router()

const mongoConnect = require("../../../config/mongo-connect")
const mongo = require("../../../services/mongo-crud")

const searchContents = async (req, res) => {
  const { db, client } = await mongoConnect()

  try {
    const events = await mongo.search(db, "events")
    res.status(200).json({ success: true, count: events.length, events })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ success: false, data: { error }})
  } finally {
    await client.close()
  }
}

router.get("/event/search", searchContents)

module.exports = router
