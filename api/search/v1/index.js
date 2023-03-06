const router = require("express").Router()

const mongoConnect = require("../../../config/mongo-connect")
const mongo = require("../../../services/mongo-crud")

const searchContents = async (req, res) => {
  const { db, client } = await mongoConnect()
  
  if(req.body.eventTypes) {
    const queryObj = {
      "$or": []
    }
    const hasGoogleDocEvents = req.body.eventTypes.includes("google_doc")
    const hasLinkEvents = req.body.eventTypes.includes("link")
    const hasPdfEvents = req.body.eventTypes.includes("pdf")
    const hasYouTubeEvents = req.body.eventTypes.includes("youtube")

    if(hasGoogleDocEvents) {
      queryObj.$or.push({ eventType: "google_doc" })
    }

    if(hasLinkEvents) {
      queryObj.$or.push({ eventType: "link" })
    }

    if(hasPdfEvents) {
      queryObj.$or.push({ eventType: "pdf" })
    }

    if(hasYouTubeEvents) {
      queryObj.$or.push({ eventType: "youtube" })
    }

    const events = await mongo.search(db, "events", queryObj)
    return res.status(200).json({ success: true, count: events.length, events })    
  }

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
