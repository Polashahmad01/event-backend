const router = require("express").Router()

const mongoConnect = require("../../../config/mongo-connect")
const mongo = require("../../../services/mongo-crud")

const schema = require("../../../utils/userValidation")
const { validate } = require("../../../middleware/formValidation")

const createPerson = async (req, res) => {
  const { db, client } = await mongoConnect()

  try {
    await db.collection("person").createIndex({ firstName: 1}, { unique: true})
    const person = await mongo.insertOne(db, "person", req.body)

    if(!person) {
      return res.status(201).json({ success: true, data: { acknowledged: false, message: 'Duplicate field value or firstName is already been taken' }})
    }
    res.status(201).json({ success: true, data: person })

  } catch (error) {
    console.log("error", error)
    res.status(500).json({ success: false, data: { error }})
  } finally {
    await client.close()
  }
}

router.post("/user", validate(schema), createPerson)

module.exports = router
