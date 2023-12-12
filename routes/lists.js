const express = require('express')
const router = express.Router()
const db = require('cyclic-dynamodb')

router.get('/', function (req, res, next) {
  let uuid = req.headers.uuid
  let game = req.query.game
  let action = req.query.action
  let list = req.query.list
  let range = req.query.range
  let games = db.collection('games')

  // Generate Game Collection
  if (action === 'createCollection') {
    async function createCollection() {
      games.set(uuid)
        .then(data => {
          res.json(data)
        })
        .catch(error => {
          res.json(error)
        })
    }
    createCollection()
  }

  // Delete Game Collection
  if (action === 'deleteCollection') {
    async function deleteCollection() {
      games.delete(uuid)
        .then(data => {
          res.json(data)
        })
        .catch(error => {
          res.json(error)
        })
    }
    deleteCollection()
  }


  // Add Game to List
  if (action === 'add') {
    async function addGame() {
      let gameId = JSON.stringify(game.id)
      games.item(uuid).fragment(gameId).set({
        id: game.id,
        console: game.console,
        list: list
      })
        .then(data => {
          console.log(`Game ID ${game.id} added to list "${list}"`)
          res.json(data)
        })
        .catch(error => {
          res.json(error)
        })
    }
    addGame()
  }

  // Update Game data
  if (action === 'update') {
    async function updateGame() {
      let gameId = JSON.stringify(game.id)
      games.item(uuid).fragment(gameId).set({
        console: game.console,
        list: list
      })
        .then(data => {
          console.log(`Game ID ${game.id} updated`)
          res.json(data)
        })
        .catch(error => {
          res.json(error)
        })
    }
    updateGame()
  }

  // Get Game data
  if (action === 'get') {
    async function getGame() {
      // Get single Game by ID
      if (game && game.id !== null) {
        let gameId = JSON.stringify(game.id)
        games.item(uuid).fragment(gameId).get()
          .then(data => {
            res.json(data[0].props)
          })
          .catch(error => {
            res.json(error)
          })
      } else {
        // Get all Users Games
        games.item(uuid).fragments() // 1. Get the full list of game IDs
          .then(data => {
            let promises = []
            let gamesList = []
            data.forEach((game, i) => {
              promises.push(
                games.item(uuid).fragment(game).get() // 2. Get the data form from the listed IDs
                  .then(data => {
                    let key = data[0].type
                    let value = data[0].props
                    gamesList.push({[key] : value})
                  })
              )
            })
            Promise.all(promises) // 3. Return the full user's list
              .then(() => {
                res.json(gamesList)
              })
          }).catch(error => {
            res.json(error)
          })
      }
    }
    getGame()
  }

})

module.exports = router
