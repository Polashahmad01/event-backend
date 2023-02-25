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

    const eventLists = await mongo.fetchMany(db, 'events')
    const uniqueEventLists = eventLists.filter(eventList => eventList._id !== event._id)

    const matchedEvents = event.tags.map(tagLabel => uniqueEventLists.filter(uniqueEventList => uniqueEventList.tags.some(tag => tag.tagName === tagLabel.tagName))).flat()
    
    const matchedEventsArray = matchedEvents.map(matchedEvent => [matchedEvent._id, matchedEvent])

    const matchedEventsMap = new Map(matchedEventsArray)

    const result = [...matchedEventsMap.values()]

    const recommendedEventList = result.slice(1)

    res.status(200).json({ success: true, count: recommendedEventList.length, data: event, recommendedEvent: recommendedEventList })
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
  const { title, author, eventType, tags, contentUrl, summary, description, isSaved, isPublished, isUnPublished, status } = req.body
  
  const updateEventByFieldValue = { $set: {} }

  if(title) {
    updateEventByFieldValue.$set.title = title
  }
  
  if(author) {
    updateEventByFieldValue.$set.author = author
  }

  if(eventType) {
    updateEventByFieldValue.$set.eventType = eventType
  }

  if(tags) {
    updateEventByFieldValue.$set.tags = tags
  }

  if(contentUrl) {
    updateEventByFieldValue.$set.contentUrl = contentUrl
  }

  if(summary) {
    updateEventByFieldValue.$set.summary = summary
  }

  if(description) {
    updateEventByFieldValue.$set.description = description
  }
  
  if(isSaved === true || isSaved === false) {
    updateEventByFieldValue.$set.isSaved = isSaved
  }

  if(isPublished === true || isPublished === false) {
    updateEventByFieldValue.$set.isPublished = isPublished
  }

  if(isUnPublished === false || isUnPublished === true) {
    updateEventByFieldValue.$set.isUnPublished = isUnPublished
  }

  if(status) {
    updateEventByFieldValue.$set.status = status
  }

  try {
    const updatedEventItem = await mongo.updateOne(db, 'events', { _id: new ObjectId(id)}, { upsert: true }, updateEventByFieldValue)
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
    res.status(500).json({ success: false, data: { acknowledged: false, message: 'Unable to delete the event. Something went wrong' }})
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
