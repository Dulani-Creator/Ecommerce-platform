import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createproduct(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "You are not authorized to create product."
        });
    }

    try {
        const productData = req.body;
        const product = new Product(productData);

        await product.save();

        return res.json({
            message: "Product Created Successfully",
            product
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ message: "Failed to create product" });
    }
}

export async function getProducts(req, res) {
    try {
        const products = await Product.find();
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to retrieve products"
        });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { productId } = req.params;

        await Product.deleteOne({ productId });

        return res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to delete product"
        });
    }
}

export async function updatProduct(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "You are not authorized to update a products."
        });
    }

    try {
        const { productId } = req.params;
        const updateData = req.body;

        await Product.updateOne({ productId }, updateData);

        return res.json({
            message: "Product is updated successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to update product"
        });
    }
}

export async function getProductId(req, res) {
    try {
        const { productId } = req.params;
        const product = await Product.findOne({ productId });

        if (product == null) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to retrieve product by ID"
        });
    }
}