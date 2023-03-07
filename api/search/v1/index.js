const router = require("express").Router()

const mongoConnect = require("../../../config/mongo-connect")
const mongo = require("../../../services/mongo-crud")

const searchContents = async (req, res) => {
  const { db, client } = await mongoConnect()
  const requestBody = Object.keys(req.body).length === 0

  if(!requestBody) {
    const { eventTypes, statuses, tags, query } = req.body  
    const eventType = Object.keys(eventTypes).length === 0
    const status = Object.keys(statuses).length === 0
    const tag = Object.keys(tags).length === 0
    const searchTerm = Object.keys(query).length === 0

    // If all fields are blank
    if(eventType && status && tag && searchTerm) {
      const events = await mongo.search(db, "events")
      return res.status(200).json({ success: true, count: events.length, events })
    }
  
    // filtered response
    if(!eventType || !status || !tag || !searchTerm) {
      let query = {}

      if(!eventType) {
        query = {
          ...query,
          eventType: { $in: req.body.eventTypes }
        }
      }

      if(!status) {
        query = {
          ...query,
          status: { $in: req.body.statuses}
        }
      }

      if(!tag) {
        query = {
          ...query,
          "tags._id": { $in: req.body.tags }
        }
      }

      if(!searchTerm) {
        query = {
          ...query,
          $or: [
            { title: { $regex: `(?i)${req.body.query}(?-i)` }},
            { description: { $regex: `(?i)${req.body.query}(?-i)` }}
          ]
        }
      }

      const events = await mongo.search(db, "events", query)
      return res.status(200).json({ success: true, count: events.length, events })
    }
  }

  // Default response
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

router.post("/event/search", searchContents)

module.exports = router
