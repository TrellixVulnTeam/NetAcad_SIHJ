const bodyParser = require('body-parser')
const express = require('express')
const app = express();

const port = 3000;

const cors = require('cors');

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors());

app.post('/test' , urlencodedParser, async (req, res) => {
    console.log(req.body)
      
    res.json({})
  })

  app.listen(port, () => {
    console.log(`HTTP Server at localhost:${port}`)
  })