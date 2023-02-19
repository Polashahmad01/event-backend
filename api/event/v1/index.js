const router = require("express").Router()
const { ObjectId } = require("mongodb")

const mongoConnect = require("../../../config/mongo-connect")
const mongo = require("../../../services/mongo-crud")

const schema = require("../../../utils/eventValidation")
const { validate } = require("../../../middleware/formValidation")

const getEvents = async (req, res) => {
  const { db, client } = await mongoConnect()

  try {
    const events = await mongo.fetchMany(db, 'events')
    res.status(200).json({ success: true, count: events.length, data: events })
  } catch(error) {
    console.log('error', error)
    res.status(500).json({ success: false, data: { error }})
  } finally {
    await client.close()
  }
}

const getEvent = async (req, res) => {
  const { db, client } = await mongoConnect()
  const id = req.params.id

  try {
    const event = await mongo.findOne(db, 'events', { _id: new ObjectId(id) }, { sort: { "events.title": -1 }})
    res.status(200).json({ success: true, data: event })
  } catch(error) {
    console.log('error', error)
    res.status(500).json({ success: false, data: { error }})
  } finally {
    await client.close()
  }
}

const createEvent = async (req, res) => {
  const { db, client } = await mongoConnect()
  
  try {
    await db.collection('events').createIndex({ title: 1},{ unique: true})
    const event = await mongo.insertOne(db, 'events', req.body)
    if(!event) {
      return res.status(201).json({ success: true, data: { acknowledged: false, message: 'Duplicate field value or event title is already been taken' } })
    }
    res.status(201).json({ success: true, data: event })
  } catch(error) {
    console.log('error', error)
    res.status(500).json({ success: false, data: { error }})
  } finally {
    await client.close()
  }
}

const updateEvent = async (req, res) => {
  const { db, client } = await mongoConnect()
  const id = req.params.id

  const updateEventField = {
    $set: {
      title: req.body.title,
      author: req.body.author,
      eventType: req.body.eventType,
      tags: req.body.tags,
      contentUrl: req.body.contentUrl,
      summary: req.body.summary,
      description: req.body.description,
      isSaved: req.body.isSaved,
      isPublished: req.body.isPublished,
      isUnPublished: req.body.isUnPublished
    },
  }

  try {
    const updatedEventItem = await mongo.updateOne(db, 'events', { _id: new ObjectId(id)}, { upsert: true }, updateEventField)
    res.status(200).json({ success: true, data: updatedEventItem })
  } catch(error) {
    console.log('error', error)
    res.status(500).json({ success: false, data: { error }})
  } finally {
    await client.close()
  }
}

const deleteEvent = async (req, res) => {
  const { db, client } = await mongoConnect()
  const id = req.params.id

  try {
    const event = await mongo.deleteOne(db, 'events', { _id: new ObjectId(id)})
    res.status(200).json({ success: true, data: event })
  } catch(error) {
    console.log('error', error)
    res.status(500).json({ success: false, data: { error }})
  } finally {
    await client.close()
  }
}

router.get('/event', getEvents)
router.get('/event/:id', getEvent)
router.post('/event', validate(schema), createEvent)
router.put('/event/:id', updateEvent)
router.delete('/event/:id', deleteEvent)

module.exports = router
