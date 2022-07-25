const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
// import { MongoClient } from "mongodb";
require("dotenv").config();
const cors = require("cors");
const port = 4700 || process.env.PORT;
var jwt = require('jsonwebtoken');
// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.ywri3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

app.get("/", (req, res) => {
  res.send("What's UP Bro🥴!!!");
});


function verifyJWT (req,res,next){
    const authHeader = req.headers.authorization;
    // console.log("auth Header Data",authHeader);
    if(!authHeader){
      // return res.status(401).send({'message' : "Unauthorized Access"})
      return res.status(401).send({ message: 'UnAuthorized access' });
    }
    else{
      TokenArray = authHeader.split(" ");
      const token = TokenArray[1]
      // console.log("JWT Token",token);

      jwt.verify(token,process.env.SECRET_ACCESS_TOKEN , function(err, decoded) {
        
        if(err){
          return res.status(403).send({message : "Forbidden Access"})
        }
        // console.log(decoded);
        req.decoded = decoded;
        // console.log(req.decoded.email);
        next();
      });


    }
}

async function run() {
  try {
    await client.connect();
      console.log("DB Connected😁");
      const natokCollection = client.db("eid_natok2022").collection("natok");
      const orderCollection = client.db("eid_natok2022").collection("order");
      const userCollection = client.db("eid_natok2022").collection("user");

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


// Order API
 app.post("/order",async (req,res)=>{
    const body = req.body;
    console.log(body);
    const result = await orderCollection.insertOne(body);
    res.send(result)
 })

 app.get("/order", async (req,res)=>{
   const query = {}
   const cursor = orderCollection.find(query);
   const result = await cursor.toArray();
   res.send(result)
     
 })

// ******** type-1 *************

//  app.get("/my-order/:email", async(req,res)=>{
//   const email = req.params.email;
//   console.log(email);
//    const query = {userEmail : email}
//    const cursor = orderCollection.find(query);
//    const result = await cursor.toArray();
//    res.send(result);
//  })
    


// *********** type-2 ***********************

app.get("/my-order",verifyJWT, async(req,res)=>{
  const email = req.query.email;
  // console.log(email);

  // const authHeader = req.headers;
  // console.log("auth Header", authHeader);
   const query = {userEmail : email}
   const cursor = orderCollection.find(query);
   const result = await cursor.toArray();
   res.send(result);
 })



//  user data 

app.put("/user-info/:email", async (req,res)=>{
    const email = req.params.email;
    // console.log(email);
    const filter = { email : email };
    const options = { upsert: true };
    const user = req.body;
    // console.log(user);
    const updateDoc = {
      $set: user
    };

    const result = await userCollection.updateOne(filter, updateDoc, options);
    // console.log(result);
    const token = jwt.sign({email : email}, process.env.SECRET_ACCESS_TOKEN , { expiresIn: '1h' });
    res.send({result,token});
})


app.get("/user-info",verifyJWT,async(req,res)=>{
  const query = {}
  console.log(query);
  const cursor = userCollection.find(query);
 const result = await cursor.toArray()
 res.send(result)
})

// Admin API almost same as User API ,ignore token & options [upsert]

app.put("/user-info/admin/:email", verifyJWT, async (req,res)=>{
 const email = req.params.email;
 // console.log(email);
 const requester = req.decoded.email;
 const requesterAccount = await userCollection.find({email : requester})
 if (requesterAccount.role === 'admin') {
  const filter = { email : email };
  //  const options = { upsert: true };
   // const user = req.body;
   // console.log(user);
   const updateDoc = {
     $set: {role : 'admin'}
   };
  
   const result = await userCollection.updateOne(filter, updateDoc);
      // console.log(result);
      // const token = jwt.sign({email : email}, process.env.SECRET_ACCESS_TOKEN , { expiresIn: '1h' });
      res.send({result});
 }

 else {
    res.status(403).send({message : "Forbidden Access"})
 }

})

  // Admin GET API
  
  app.get("/admin/:email", verifyJWT , async (req,res)=>{
       const email = req.params.email;
       const user = await userCollection.findOne({email : email})
       const isAdmin = user.role === 'admin';
       console.log(isAdmin);
       res.send({admin : isAdmin})
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