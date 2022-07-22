const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
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
      console.log("DB Connected😁");
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

 // GET Method Route (by Dynamic id) 

 app.get("/eid-natok-collection/:id",async (req,res)=>{
  // console.log(req);
  const id = req.params.id;
  const query = { _id : ObjectId(id) };
  const result = await natokCollection.findOne(query);
  res.send (result)
 })

//  Update Data
app.put("/update-info/:id",async (req, res) => {
  const data = req.body;
  console.log("updated info",data);
  const id = req.params.id;
  const filter = { _id : ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      natokName : data.natokName,
      directorName : data.directorName,
      starring : data.starring,
      description : data.description,
      subscriptionFee : data.subscriptionFee,
      coverPhoto : data.coverPhoto
    },
  };
  const result = await natokCollection.updateOne(filter, updateDoc, options);
  res.send(result);
})

// Delete Data

app.delete("/delete-data/:id",async(req,res)=>{
  const id = req.params.id
  const query = { _id : ObjectId(id) };
  const result = await natokCollection.deleteOne(query);
  res.send(result);
})


  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});




// Part-1

/**
 * API Route
 * 
 * POST API : http://localhost:4700/eid-natok
 * 
 * GET API : http://localhost:4700/eid-natok-collection
 * GET API (dynamic id/Unique Identity) : (req.params.id) : http://localhost:4700/eid-natok-collection/$id
 * GET API (dynamic Data) : (req.query) : http://localhost:4700/eid-natok-collection?
 * 
 * 
 * UPDATE API : http://localhost:4700/update-info/:id
 * 
 * DELETE API : http://localhost:4700/delete-data/:id
 * **/ 


// Part-2

/***
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * ****/ 