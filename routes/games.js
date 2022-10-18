const express = require('express')
const router = express.Router()
const axios = require('axios');

router.get('/', function (req, res, next) {
  let searchQuery = req.query.query
  const data = JSON.stringify({
    "searchType": "games",
    "searchTerms": [searchQuery],
    "searchPage": 1,
    "size": 100,
    "searchOptions": {
      "games": {
        "userId": 0,
        "platform": "",
        "sortCategory": "popular",
        "rangeCategory": "main",
        "rangeTime": {
          "min": 0,
          "max": 0
        },
        "gameplay": {
          "perspective": "",
          "flow": "",
          "genre": ""
        },
        "modifier": ""
      },
      "users": {
        "sortCategory": "postcount"
      },
      "filter": "",
      "sort": 0,
      "randomizer": 0
    }
  });

  const config = {
    method: 'post',
    url: 'https://www.howlongtobeat.com/api/search',
    headers: {
      'Referer': 'https://howlongtobeat.com/',
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      res.json(
        response.data
      )
    })
    .catch(function (error) {
      console.log(error)
    })
})

module.exports = router
