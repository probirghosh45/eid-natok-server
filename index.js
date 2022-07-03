const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
// import { MongoClient } from "mongodb";
require("dotenv").config();
const cors = require('cors')
const port = 4700 || process.env.PORT;


// middleware

app.use(cors())




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.ywri3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

app.get("/", (req, res) => {
  res.send("What's UP Bro🥴!!!");
});

async function run() {
  try {
    await client.connect();
    //   console.log("DB Connected😁");
    const natokCollection = client.db("eid_natok2022").collection("natok");

 
    // POST method route
    app.post("/eid-natok", (req, res) => {
      res.send("POST request to the homepage");
    });

       // GET method route
       app.get("/eid-natok-collection", (req, res) => {
    //    console.log(req);
        res.send("Hello Bhola!!!");
      });

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
