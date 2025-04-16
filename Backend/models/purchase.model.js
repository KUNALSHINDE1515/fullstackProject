import mongoose from "mongoose";
const purchaseSchema = new mongoose.Schema({

    userId: {
        type:mongoose.Types.ObjectId,
        ref: "User"
    },
    courseId:{
        type:mongoose.Types.ObjectId,
        ref:"Course"
    }
   
})


export const Purchase = mongoose.model('Purchase', purchaseSchema) // here we are creating a model for the course and exporting it.