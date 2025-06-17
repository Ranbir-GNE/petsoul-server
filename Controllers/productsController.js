const ProductModel = require("../Models/ProductSchema");

const createProduct = async (req, res) => {
    const { name, description, price, category, stock, image } = req.body;
    if (!name || !description || !price || !category || !stock || !image) {
        return res.status(400).json({ message: "All fields are required", status: "error" });
    }
    try {
        const product = await ProductModel.create({
            name,
            description,
            price,
            category,
            stock,
            image,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.status(201).json({ product, message: "Product created successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find()
            .sort({ name: 1 })
            .select("-__v -createdAt -updatedAt");
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found", status: "error" });
        }
        res.status(200).json({ products, message: "Products fetched successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}

const getProductById = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Product ID is required", status: "error" });
    }
    try {
        const product = await ProductModel.findById(id)
            .select("-__v -createdAt -updatedAt");
        if (!product) {
            return res.status(404).json({ message: "Product not found", status: "error" });
        }
        res.status(200).json({ product, message: "Product fetched successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}
const updateProduct = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Product ID is required", status: "error" });
    }
    const { name, description, price, category, stock, image } = req.body;
    try {
        const product = await ProductModel.findByIdAndUpdate(id, {
            name,
            description,
            price,
            category,
            stock,
            image,
            updatedAt: new Date(),
        }, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found", status: "error" });
        }
        res.status(200).json({ product, message: "Product updated successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Product ID is required", status: "error" });
    }
    try {
        const product = await ProductModel.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found", status: "error" });
        }
        res.status(200).json({ message: "Product deleted successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
