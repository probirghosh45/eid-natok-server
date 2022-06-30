const express = require('express')
const app = express()
const port = 4700;

app.get('/', (req, res) => {
  res.send("What's UP Bro🥴!!!")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
