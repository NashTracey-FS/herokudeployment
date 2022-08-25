const mongoose = require('mongoose')
require('dotenv').config()

async function dbConnect(){
    mongoose.connect(
        process.env.db_url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true, 
            

        }
    )
    .then(()=>{
        console.log("Connected to MongoDB succesfully!")
    })
    .catch((err) =>{
        console.log("Unable to connect to MongoDB!")
        console.log(err)
    })
}

module.exports =dbConnect;