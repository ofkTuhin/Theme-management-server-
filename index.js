const express = require('express')
const app = express()
  
const { MongoClient } = require('mongodb');

const cors=require('cors')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}theme1234@cluster0.gqnwo.mongodb.net/themeManagement?retryWrites=true&w=majority`;

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
  // perform actions on the collection object
 
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT||port)