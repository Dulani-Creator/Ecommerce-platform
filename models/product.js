import mongosoose from "mongoose";

const productSchema = new mongosoose.Schema(
 {
   
    productId : {
       type :String,
       required : true,
       Unique : true
     },
    name : {
        type : String,
        required : true,  
    },
    altName :{
        type:[String],
        default : [],
        required : true
    },
    description : {
        type : String,
        required : true
    },
    images : {
        type : [String],
        default : [],
        required : true
    },
    price : {
        type : Number,
        required : true 
   },
   labelPrice:{
    type : Number,
    required : true         
   },
   category : {     
    type : String,
    required : true 
   }
}
) 

const Product = mongosoose.model("Product", productSchema);
export default Product;