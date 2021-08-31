
const express = require("express");
const app = express()
const port = 3000
const child = require("child_process")
const path = require("path")
const util = require("util")
// const axios = require("axios")
// const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const router = express.Router()
const Product = require('./models/product')
const DATABASE_URL = 'mongodb+srv://test_user:testpassword@cluster0.pewah.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' ;


// app.use(bodyParser.urlencoded({ extended: true }));

async function insert_data(data,req,res)
{
  mongoose.connect(DATABASE_URL, { useNewUrlParser: true })
  const db = mongoose.connection
  db.on('error', (error) => console.error(error))
  db.once('open', () => console.log('Connected to Database'))

  //console.log(data.name)

  const product = new Product(
  {
    name: data.name,
    image: data.image,
    price: data.price
  })
  
  const newProduct = await product.save()
  console.log(newProduct);
}

const exec = util.promisify(child.exec);
app.use("/public",express.static(path.join(__dirname,'../public')));

app.use('/home', async (req, res) => 
{
    res.sendFile(path.join(__dirname+'/template/form.html'));
})


app.get('/etsy/:url' , async (req, res) =>
{
    var parameters = req.params ; // json object
    console.log(parameters);
    var url = parameters.url;
    console.log(url);
    console.log("python working");
    // var url = `https://www.etsy.com/listing/517347262/miniature-house-brass-model-kit?ref=pla_sameshop_listing_top-1`;

    const { stdout, stderr } = await exec(`python ${path.join(__dirname,'/script/scrape.py')} ${url}`)

    if(stderr) 
    {
        return res.send({error:stderr.toString()})
    }
    
    const awat = await JSON.parse(stdout); 
    //awat = await JSON.parse(awat);
    let obj = JSON.parse(awat) ;
    let item = obj[0];
    insert_data(item);
    
    res.send({stdout: awat})   // handling by test.js 
})


app.listen(port, () =>
{
    console.log(`http://localhost:${port}/home`)
})