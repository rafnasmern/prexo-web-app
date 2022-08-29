const express = require("express")
const router = express.Router()
// user controller 
const botController = require("../../Controller/bot-controller/bot-controller")
// Multer 
const { cloudinary } = require("../../utils/cloudinary")
const upload = require("../../utils/multer")
/********************************************************************************************* */
/* Get Assigned Bag */
router.post("/getAssignedBag",async(req,res,next)=>{
    try {
        console.log("called");
        let data=await botController.getAssignedBag()
        if(data){
            res.status(200).json({
                data:data
            })
        }
       
    } catch (error) {
      next(error)  
    }
})
/* Get Bag Items */
router.post("/getAssignedBagItems/:id",async(req,res,next)=>{
    try {
        let data=await botController.getAssignedBag(req.params.id)
        if (data.length !=0) {
            res.status(200).json({
                data: data,
                message: "Successfully Get All Data"
            })
        }
        else {
            res.status(201).json({
                data: data,
                message: "Bag is Empty"
            })
        }
    } catch (error) {
      next(error)  
    }
})

/********************************************************************************** */
module.exports = router;