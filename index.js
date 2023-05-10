const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
console.log(process.env.DB_PASS)
//middleware
app.use(cors());
app.use(express.json());

//
app.get('/', (req,res)=>{
    res.send('server is running')
})

app.listen(port, ()=>{
    console.log('server is running at port', port)
})