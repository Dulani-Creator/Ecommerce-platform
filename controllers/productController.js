import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export  async function createproduct(req, res) {
    
    if(!isAdmin (req)){
        res.status(403).json ({
            message :"You are not authorized to create product."
        });
        return ;
    }



    try{

       const productData = req.body;
       const product = new Product(productData);

       await product.save();

       res.json(
         {
            message : "Product Created Successfully",
            product : product
         });

    }catch(error){
        console.error("Error creating product:", error);
        return res.status(500).json(
            { message: "Failed to create product" 

            });
    }
    

}

export  async function getProducts(req,res) {
    try{
        const products = await Product.find()
        res.json(products);

    }catch(err){
       console.error(err);
       res.status(500).json({
        message:" Failed to retrieve products",
       });
    }
}


export async function deleteProduct(req,res) {
    try{
        const productId =req.params.productId

        /*if(productId==null){
            res.status(400).json({
                message:"Product id is required"
            });
            return ;
        }*/
        
        await Product.deleteOne({
            productId :productId 

        })

        res.json({
            message:"Prodcut deleted successfully"
        })
    }catch{
        console.error(err);
        res.status(500).json({
            message:"Failed to delete product ",
        });
    }
    
}


export async function updatProduct(req,res) {
    if(!isAdmin(req)){
        res.status(403).json({
            message:"You are not authorized to update a products."
        });
        return ;
    }

    try{
        const productId =  req.params.productId;
        const updateData = req.body;
        await Product.updateOne(
            {productId :productId},
             updateData 
        );
        res.json({
            message:"Product is updated successfully."
        });

    }catch{

        console.error(err);
        res.status(500).json({
            message: "Failed to update product " ,
        });

    }
}

export async function getProductId(req,res) {
    try{
const productId = await Product.findone(
    {
        productId : productId 
    }
)
if(product == null){
    res.status(404).json({
        message :"Product not found."
    });

}else{
    res.json(product);
}

    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Failed to retrieve product by ID",
        });

    
    }
}