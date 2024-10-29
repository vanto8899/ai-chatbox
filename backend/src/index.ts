import app from "./app.js"
import { connectToDatabase } from "./db/connection.js";

// connections and listeners
const PORT = process.env.PORT || 8000;
connectToDatabase()
.then(()=>{
  app.listen(PORT,()=>console.log("Sever open and connected DB!"));
})
.catch((err)=> console.log(err))
