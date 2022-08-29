/* Express */
const express = require("express")
const router = express.Router()
// user controller 
const warehouseOutController = require("../../Controller/warehouseOut/warehouseOutController")
/*******************************************************************************************************************/
/**************************************************Dashboard********************************************************/
router.get("/dashboard",async(req,res,next)=>{
    try {
        let data =await warehouseOutController.dashboard()
        if(data){
            res.status(200).json({
                data:data,
                message:"Success"
            })
        }
    } catch (error) {
        next(error)
    }
})
module.exports = router;