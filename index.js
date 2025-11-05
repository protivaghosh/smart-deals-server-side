const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// SmartDbUser
// protivaghosh12345
const uri = "mongodb+srv://SmartDbUser:protivaghosh12345@cluster0.1wh8t.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('Rudrik Ghosh server is running...............')
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
     
    const database = client.db("simple_database");
    const productsCollection = database.collection("products");

     // GET route: fetch all products
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    });

     app.get('/products/:id', async(req, res)=>{
       const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result = await productsCollection.findOne(query)
       res.send(result);
    })
    


     // post route
    app.post('/products',async (req, res)=> {
           const newProducts = req.body;
           const result = await productsCollection.insertOne(newProducts)
           res.send(result);
    });

    // patch route
    app.patch('/products/:id', async(req, res) =>{
      const id = req.params.id;
      const updateProducts =req.body;
       const query = {_id: new ObjectId(id)}
       const update ={
              $set: {
                name : updateProducts.name,
                Price: updateProducts.price
              }
       }
       const result = await productsCollection.deleteOne(query, update)
       res.send(result);
       
    })

    //delete routes
    app.delete('/products/:id', async(req, res)=>{
       const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result = await productsCollection.deleteOne(query)
       res.send(result);
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //  await client.close()
   }
}

run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
