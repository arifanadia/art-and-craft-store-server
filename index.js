const express = require('express');
const cors = require('cors');
const categories = require('./category.json')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.taokb31.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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
    // await client.connect();
    const craftStoreCollection = client.db('craftStoreDB').collection('craftStore');
    // const craftCategoriesCollection = client.db('craftStoreDB').collection('categories');
    const userCollection = client.db('craftStoreDB').collection('users');


    app.get('/craftItems', async (req, res) => {
      const cursor = craftStoreCollection.find();
      console.log(cursor);
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/craftItems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftStoreCollection.findOne(query);
      res.send(result)
    })

    app.get('/myList/:email', async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const result = await craftStoreCollection.find({ email: email }).toArray();
      res.send(result)
    })




    app.post("/craftItems", async (req, res) => {
      const addCraftItem = req.body;
      console.log('nothing', addCraftItem);
      const result = await craftStoreCollection.insertOne(addCraftItem);
      res.send(result)
    });

    app.put('/updateItem/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const data = {
        $set: {
          image: req.body.image,
          itemName: req.body.itemName,
          subCategory: req.body.subCategory,
          description: req.body.description,
          priceType: req.body.priceType,
          price: req.body.price,
          customize: req.body.customize,
          stock: req.body.stock,
          processTime: req.body.processTime,
          rating: req.body.rating
        }

      }
      const result = await craftStoreCollection.updateOne(query, data, options);
      res.send(result);
    });



    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftStoreCollection.deleteOne(query);
      res.send(result)
    });
    
 

    // categories api

    app.get('/categories', async (req, res) => {
      res.send(categories)
    });


    // user related api
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      console.log(cursor);
      const result = await cursor.toArray();
      res.send(result)
    });

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result)
    });


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('art and craft store are running')
});

app.listen(port, (req, res) => {
  console.log(`art and craft store are running on port : ${port}`);
})
