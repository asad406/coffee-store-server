const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n1ha416.mongodb.net/?retryWrites=true&w=majority`;

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

    const coffeeCollection = client.db('coffeeDB').collection('coffee');

    app.get('/coffee', async(req,res) => {
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/tea/:id', async(req,res) =>{
      console.log(req)
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(filter);
        res.send(result);
    })

    app.put('/teaCoffee/:id', async(req,res) =>{
      const id = req.params.id;
      const coffee = req.body;
      const filter = {_id: new ObjectId(id)}
      const option = {upsert:true};
      const updateCoffee = {
          $set:{
            name:coffee.name, 
            quantity:coffee.quantity, 
            supplier:coffee.supplier,
            test:coffee.test, 
            category:coffee.category, 
            details:coffee.details, 
            photo:coffee.photo,
          }
      }
      const result = await coffeeCollection.updateOne(filter,updateCoffee, option);
      res.send(result);

    })

    app.post('/coffee', async(req, res) =>{
        const coffee = req.body;
        console.log(coffee)
        const result = await coffeeCollection.insertOne(coffee);
        res.send(result);
    })

    app.delete('/coffee/:id', async(req,res) => {
        const id = req.params.id;
        console.log('delete', id)
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(query)
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();f
  }
}
run().catch(console.dir);


//
app.get('/', (req,res)=>{
    res.send('server is running')
})

app.listen(port, ()=>{
    console.log('server is running at port', port)
})