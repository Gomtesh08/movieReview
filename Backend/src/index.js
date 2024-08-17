import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({

 path : './env'

})


app.listen(process.env.PORT || 8000 , (req ,res)=>{

    console.log(`Server is Listening at Port : ${process.env.PORT}`);  

 })