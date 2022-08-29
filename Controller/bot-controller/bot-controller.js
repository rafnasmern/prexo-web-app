
const { masters } = require("../../Model/mastersModel")

/****************************************************************************** */
module.exports ={
    getAssignedBag:(bagId)=>{
        return new Promise(async (resolve, reject) => {
            let data = await masters.aggregate([{$match:{code:bagId,sort_id:"Issued"}},
            {
                $lookup: {
                    from: "deliveries",
                    localField: "items.awbn_number",
                    foreignField: "tracking_id",
                    as: "delivery"
                }
            },
            {
                $unwind: "$delivery"
            },
            ])
            if (data.length != 0 && data?.items?.length != 0) {
                resolve(data)
            }
            else {
                resolve(data)
            }
        })
    },
    getAssignedBag:()=>{
        return new Promise(async(resolve,reject)=>{
            let data=await masters.find({sort_id:"Issued"})
            console.log(data);
           if(data){
               resolve(data)
           }
        })
    },
    
}