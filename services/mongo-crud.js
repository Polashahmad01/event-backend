module.exports = {
  async insertOne(db, collection, payload) {
    try {
      const response = await db.collection(collection).insertOne(payload)
      return response
    } catch(error) {
      console.log('error', error)
      return false
    }
  },
  async deleteOne(db, collection, query = {}) {
    try {
      const response = await db.collection(collection).deleteOne(query)
      return response
    } catch(error) {
      console.log('error', error)
      return false
    }
  },
  async fetchMany(db, collection, query = {}, keys = {}, sorting = {}, limit = 0, pageNumber = 0) {
    try {
      const response = await db.collection(collection).find(query).skip(pageNumber > 0 ? (pageNumber - 1) * limit : 0).limit(limit).sort(sorting).project(keys).toArray()
      return response
    } catch(error) {
      console.log('error', error)
      return false
    }
  },
  async findOne(db, collection, query = {}, options ={}) {
    try {
      const response = await db.collection(collection).findOne(query, options)
      return response
    } catch(error) {
      console.log('error', error)
      return false
    }
  },
  async updateOne(db, collection, query = {}, options = {}, payload = {}) {
    try {
      const response = await db.collection(collection).updateOne(query, payload, options)
      return response
    } catch(error) {
      console.log('error', error)
      return false
    }
  },
  async search(db, collection, query = {}, keys = {}, sorting = {}, limit = 0, pageNumber = 0) {
    try {
      const response = await db.collection(collection).find(query).skip(pageNumber > 0 ? (pageNumber - 1) * limit : 0).limit(limit).sort(sorting).project(keys).toArray()
      return response
    } catch(error) {
      console.log('error', error)
      return false
    }
  }
}
