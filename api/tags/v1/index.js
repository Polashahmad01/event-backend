const router = require("express").Router()
const { ObjectId } = require("mongodb")

const mongoConnect = require("../../../config/mongo-connect")
const mongo = require("../../../services/mongo-crud")


const schema = require("../../../utils/tagValidation")
const { validate } = require("../../../middleware/formValidation")

const getTags = async (req, res) => {
  const { db, client } = await mongoConnect()
  
  try {
    const tags = await mongo.fetchMany(db, 'tags')
    res.status(200).json({ success: true, count: tags.length, data: tags })
  } catch(error) {
    console.log('error', error)
    res.status(500).json({ success: false, data: { error }})
  } finally {
    await client.close()
  }
}

const getTag = async (req, res) => {
  const { db, client } = await mongoConnect()
  const id = req.params.id

  try {
    const tag = await mongo.findOne(db, 'tags', { _id: new ObjectId(id) }, { sort: { "tags.tagName": -1 }})
    res.status(200).json({ success: true, data: tag })
  } catch(error) {
    console.log('error', error)
    res.status(500).json({ success: false, data: { error }})
  } finally {
    await client.close()
  }
}

const createTags = async (req, res) => {
  const { db, client } = await mongoConnect()

  try {
    const tag = await mongo.insertOne(db, 'tags', req.body)
    res.status(201).json({ success: true, data: tag })
  } catch(error) {
    console.log('error', error)
    res.status(500).json({ success: false, data: { error } })
  } finally {
    await client.close()
  }
}

const updateTag = async (req, res) => {
  const { db, client } = await mongoConnect()
  const id = req.params.id  

  const updateTag = {
    $set: {
      tagName: req.body.tagName,
      tagDescription: req.body.tagDescription
    },
  };

  try {
    const updatedTag = await mongo.updateOne(db, 'tags', { _id: new ObjectId(id)}, { upsert: true }, updateTag)
    res.status(200).json({ success: true, data: updatedTag })
  } catch(error) {
    console.log('error', error)
    res.status(500).json({ success: false, data: { error }})
  } finally {
    await client.close()
  }
}

const deleteTag = async (req, res) => {
  const { db, client } = await mongoConnect()
  const id = req.params.id

  try {
    const tag = await mongo.deleteOne(db, 'tags', { _id: new ObjectId(id)})
    res.status(200).json({ success: true, data: tag })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ success: false, data: { error } })
  } finally {
    await client.close()
  }
}



router.get('/tags', getTags)
router.get('/tags/:id', getTag)
router.post('/tags', validate(schema), createTags)
router.put('/tags/:id', updateTag)
router.delete('/tags/:id', deleteTag)

module.exports = router

