import mongoose from "mongoose"

//variable to check is database is connected or not
let isConnected = false;

export const connectDB = async () =>{
    //to prevent the strictQuery actions
    mongoose.set("strictQuery",true)
    if(!process.env.MONGODB_URL)return console.log("MongoDB url not found");
    if(isConnected)return console.log("Already connected to the database")
    
    //if not connected then connect to the database
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected=true;
        console.log("Connected to Mongodb");
    } catch (error) {
        console.error(error)
    }

}
