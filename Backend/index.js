import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import courseRoutes from "./routes/course.routes.js"
import fileUpload from 'express-fileupload';
const app = express()
dotenv.config() // here we can  add the path to the .env file if it is not in the root directory


// middleware

app.use(express.json());
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));
const port = process.env.PORT || 3000 // here we can get port from the .env file and if the port in not working then or field use.
const DB_URI = process.env.MONGODB_URI // here we can get the DB_URI from the .env file and if the port in not working then or field use.

try {
    await mongoose.connect(DB_URI) //db dusare contenet mai hota hai is liye ham await use karte hai
    console.log('Connected to succesfully') 
} catch (error) {
    console.log(error) 
}

app.get('/', (req, res) => {
  res.send('Hello Kunal!')
})

// definig routes 

app.use("/api/v1/course", courseRoutes)

// Cloudanary configuration code for get image from cloud
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

app.listen(port, () => {
  console.log(`Server is runiing on port ${port}`)
})
