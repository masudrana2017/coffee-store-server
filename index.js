const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const port=process.env.PORT || 5000;


// Middleware
app.use(cors({
  origin:["http://localhost:5000",
    "https://coffee-store-23e8e.web.app",
    "https://coffee-store-23e8e.firebaseapp.com"],
  credentials:true
}))
app.use(cors())
app.use(express.json())

// CoffeeMaker
// 8houGGZiiZYNugwg


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a8kovsf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
// const uri = "mongodb+srv://CoffeeMaker:8houGGZiiZYNugwg@cluster0.a8kovsf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection=client.db('coffeeDB').collection('coffee')
    const userCollection=client.db('coffeeDB').collection('users')
    // add coffee

    app.post('/coffee',async(req,res)=>{
      const newCoffee=req.body
      const result=await coffeeCollection.insertOne(newCoffee)
      res.send(result)
      console.log(newCoffee)
    })

    app.get('/coffee',async(req,res)=>{
      const result=await coffeeCollection.find().toArray()
      res.send(result)
    })

    // Delete Data 
    app.delete('/coffee/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await coffeeCollection.deleteOne(query)
      res.send(result)
    })

    // get single data by id
    app.get('/coffee/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await coffeeCollection.findOne(query)
      res.send(result)
    })
    // Update Coffee
    app.put('/coffee/:id',async(req,res)=>{
      const id=req.params.id
      const filter={_id: new ObjectId(id)}
      const options={upsert:true}
      const updateCoffee=req.body
      const coffee={
        $set:{
          name:updateCoffee.name,
          chef:updateCoffee.chef,
          supplier:updateCoffee.supplier,
          taste:updateCoffee.taste,
          category:updateCoffee.category,
          details:updateCoffee.details,
          photo:updateCoffee.photo,
          price:updateCoffee.price
        }
      }
      const result=await coffeeCollection.updateOne(filter,coffee,options)
      res.send(result)
    })

    // User Related API
    app.post('/user',async (req,res)=>{
      const user=req.body;
      const result=await userCollection.insertOne(user)
      res.send(result)
    })
    app.get('/users',async(req,res)=>{
      const result=await userCollection.find().toArray()
      res.send(result)
    })
    app.delete('/user/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result= await userCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Mongo db End


app.get('/',(req,res)=>{
    res.send("Coffee Maker Server is Running")
})

app.listen(port,()=>{
    console.log(`Coffee Server is Running on Port ${port}`)
})