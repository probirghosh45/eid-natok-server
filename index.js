const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
// import { MongoClient } from "mongodb";
require("dotenv").config();
const cors = require("cors");
const port = 4700 || process.env.PORT;

// middleware

app.use(cors());
app.use(express.json());

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
    app.post("/eid-natok", async (req, res) => {
    //   console.log(req.body);
    const natokData = req.body
    const result = await natokCollection.insertOne(natokData);
    console.log(result);
    res.send(result);
    //   res.send("আমি পোষ্ট করে এসেছি😉");
    });



    // GET method route
    app.get("/eid-natok-collection",async (req, res) => {
      //    console.log(req);
      const query = {};
      const cursor = natokCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    //   res.send("ঈদ নাটক - কোরবানীর গরু🐄😬🏃!!!");
});
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
