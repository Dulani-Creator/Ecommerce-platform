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

        return res.status(201).json({
            message: "Product Created Successfully",
            product
        });
    } catch (error) {
        console.error("Error creating product:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Product with this ID already exists" });
        }
        return res.status(500).json({ message: "Failed to create product" });
    }
}

export async function getProducts(req, res) {
    try {
        const products = await Product.find();
        return res.json(products);
    } catch (error) {
        console.error("Error retrieving products:", error);
        return res.status(500).json({
            message: "Failed to retrieve products"
        });
    }
}

export async function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "You are not authorized to delete a product."
        });
    }

    try {
        const productId = req.params.productId || req.body?.productId;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const result = await Product.deleteOne({ productId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
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
        const productId = req.params.productId || req.body?.productId;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const updateData = req.body;
        const result = await Product.updateOne({ productId }, updateData);

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.json({
            message: "Product is updated successfully."
        });
    } catch (error) {
        console.error("Error updating product:", error);
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
        console.error("Error retrieving product:", error);
        return res.status(500).json({
            message: "Failed to retrieve product by ID"
        });
    }
}

export async function searchProducts(req, res) {
    try {
        const key = req.params.key || req.query.q || req.query.query || req.query.key;
        if (!key || key.trim() === "") {
            return res.json({
                message: "Searching !!"
            });
        }

        const products = await Product.find({
            $or: [
                { name: { $regex: key, $options: "i" } },
                { description: { $regex: key, $options: "i" } },
                { category: { $regex: key, $options: "i" } },
                { altName: { $regex: key, $options: "i" } }
            ]
        });

        return res.json(products);
    } catch (error) {
        console.error("Error searching products:", error);
        return res.status(500).json({ message: "Failed to search products" });
    }
}

// Aliases for consistent naming
export const createProduct = createproduct;
export const updateProduct = updatProduct;
