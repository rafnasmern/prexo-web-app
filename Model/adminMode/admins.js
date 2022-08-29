const mongoose=require("mongoose")

const adminSchema=mongoose.Schema({
   email:{
    type:String,
    default:"prexoadmin@dealsdray.com"
   },
   password:{
    type:String,
    default:"prexoadmin@dealsdray.com"
   }

    
})

const admin=mongoose.model("admin",adminSchema)
module.exports={
    admin:admin
}