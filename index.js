const express = require('express')
const app = express()
const xFrameOptions = require('x-frame-options')
  
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors=require('cors')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqnwo.mongodb.net/themeManagement?retryWrites=true&w=majority`;

const port = 3000


console.log(process.env.DB_USER,process.env.DB_PASS)




app.use(cors())
app.use(express.json())

  
app.use(xFrameOptions())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("themeManagement").collection("theme");
  app.post('/addTheme',(req,res)=>{
    console.log(req.body)
    collection.insertOne(req.body)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
  })
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
    


  app.patch('/updateOne/:id',(req,res)=>{
   
    console.log('data',req.body)
    // console.log(ObjectId(req.params.id))
    const id={_id: ObjectId(req.params.id)}
   
      console.log('id',id)
      collection.updateOne(id,
        {
          $set:{
          event:{
            themeName:req.body.themeName,
            fork:req.body.fork,
            LastCommit:req.body.LastCommit,
            fullName:req.body.fullName,
            star:req.body.star,
            create:req.body.create,
            readMe:req.body.readMe
           
          }}
        })
        .then(result=>{res.send(result.modifiedCount>0)
          console.log(result)})
   
  
    
  })
  const updateCollection = client.db("themeManagement").collection("updateTest");
  app.post('/updateTest',(req,res)=>{
    console.log(req.body)
    updateCollection.insertOne(req.body)
  })
  // app.patch('/update',(req,res)=>{
  //   console.log(req.body.q.b)
  //   updateCollection.updateMany({}, {
  //     $set:{
  //       p:{a:req.body.q.b}
       
  //     }
      
  //   })
   

    
    
  // })
  app.delete('/deleteAll',(req,res)=>{
    console.log('delete')
    updateCollection.deleteMany({})
  })


  
  
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT||port)