import express from "express";
import {
    createproduct,
    deleteProduct,
    getProducts,
    updatProduct,
    getProductId,
    searchProducts
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/search", searchProducts);
productRouter.get("/search/:key", searchProducts);

productRouter.post("/", createproduct);

productRouter.delete("/", deleteProduct);
productRouter.delete("/:productId", deleteProduct);

productRouter.put("/", updatProduct);
productRouter.put("/:productId", updatProduct);

productRouter.get("/:productId", getProductId);

export default productRouter;
