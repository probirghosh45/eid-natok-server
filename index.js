const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
// import { MongoClient } from "mongodb";
require('dotenv').config()
const port = 4700 || process.env.PORT ;




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.ywri3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

app.get('/', (req, res) => {
  res.send("What's UP Bro🥴!!!")
})

async function run() {
    try {
      await client.connect();
    //   console.log("DB Connected😁");
      const natokCollection = client.db("eid_natok2022").collection("natok");;

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
