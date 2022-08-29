const mongoose=require("mongoose")

const mastersSchema=mongoose.Schema({
    name:{
        type:String
    },
    code:{
        type:String
    },
    type_taxanomy:{
        type:String
    },
    parent_id:{
        type:String
    },
    sort_id:{
        type:String
    },
    from_time:{
        type:String
    },
    to_time:{
        type:String
    },
    prefix:{
        type:String
    },
    display:{
        type:String
    },
    created_at:{
        type:Date
    },
    limit:{
        type:String
    },
    model:{
        type:String
    },
    brand:{
        type:String
    },
    items:{
        type:Array
    },
    status_change_time:{
        type:Date
    },
    actual_items:{
        type:Array
    },
    description:{
        type:String
    }
})
const masters=mongoose.model("masters",mastersSchema)
module.exports={
    masters:masters
}