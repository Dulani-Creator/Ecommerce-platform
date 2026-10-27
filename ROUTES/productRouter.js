import express from "express";
import { createproduct, deleteProduct, getProducts, updatProduct ,getProductId} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/",getProducts);
productRouter.get("/search",
    (req,res)=>{
        res.json({
            message :"Searching !!"
        })
    }
)

productRouter.post("/",createproduct);
productRouter.delete("/:productId",deleteProduct);
productRouter.put("/:productId",updatProduct);

productRouter.get("/:productId",getProductId)



export default productRouter;