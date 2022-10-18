const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const db = require('cyclic-dynamodb')

router.get('/', function (req, res, next) {
  let users = db.collection('users')
  let uuid = req.body.uuid
  let userInfo = req.body.userInfo
  let action = req.body.action
  let range = req.body.range

  // Create new user
  if ( action === 'createUser') {
    async function createUser() {
      let uuid = uuidv4()
      users.set(uuid, {
        id: uuid,
        status: 'subscribed',
        role: 'user',
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        country: userInfo.country,
        language: userInfo.language
      }).then(data => {
        res.json(data).end()
      }).catch(error => {
        res.json(error).end()
      })
    }
    createUser()
  }

  // Get a single User Data
  if (action === 'getUserData') {
    async function getUserData(uuid) {
      users.get(uuid).then(data => {
        res.json(data.props).end()
      }).catch(error => {
        res.json(error).end()
      })
    }
    getUserData(uuid)
  }

  // Get All Users list
  if (action === 'getAllUsers') {
    async function getAllUsers(range) {
      users.list().then(data => {
        res.json(data).end()
      }).catch(error => {
        res.json(error).end()
      })
    }
    getAllUsers(range)
  }

  // Delete user
  if (action === 'deleteUser') {
    async function deleteUser(range) {
      users.delete(uuid).then(data => {
        res.json(data).end()
      }).catch(error => {
        res.json(error).end()
      })
    }
    deleteUser(range)
  }
})

module.exports = router
