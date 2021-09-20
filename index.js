const express = require('express')
const app = express()
  
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors=require('cors')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqnwo.mongodb.net/themeManagement?retryWrites=true&w=majority`;

const port = 3000


console.log(process.env.DB_USER,process.env.DB_PASS)




app.use(cors())
app.use(express.json())

  


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("themeManagement").collection("theme");
  app.post('/addTheme',(req,res)=>{
    console.log(req.body)
    collection.insertOne(req.body)
  })
  app.get('/data',(req,res)=>{
    collection.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })
  app.delete('/delete/:id',(req,res)=>{
    console.log(req.params.id)
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>res.send(result.deletedCount>0))
  })

  app.get('/singleValue/:id',(req,res)=>{
    console.log(ObjectId(req.params.id))
    collection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })
    // app.get('/newsDetails/:id',(req,res)=>{
    //   console.log(ObjectId(req.params.id))
    //   NewsCollection.find({_id:ObjectId(req.params.id)})
    //   .toArray((err, documents) => {
    //     res.send(documents[0])
    //   })
    // })


  

  app.put('/update/:id',(req,res)=>{
    console.log(req.params.id)
    collection.updateOne({_id: ObjectId(req.params.id)})
    
  })
  
 
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT||port)