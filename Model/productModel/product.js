const mongoose=require("mongoose")

const productSchema=mongoose.Schema({
    vendor_sku_id:{
        type:String
    },
    brand_name:{
        type:String
    },
    model_name:{
        type:String
    },
    vendor_name:{
        type:String
    },
    muic:{
        type:String,
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    
})

const products=mongoose.model("product",productSchema)
module.exports={
    products:products
}