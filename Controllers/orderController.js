const OrderModel = require('../Models/OrderModel');
const UserModel = require('../Models/UserSchema');

const getAllOrdersByUser = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required", status: "error" });
    }
    try {
        const orders = await OrderModel.find({ user: userId })
            .populate("user", "firstName lastName email")
            .populate("products.product", "name price image")
            .sort({ createdAt: -1 })
            .select("-__v -createdAt -updatedAt");
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user", status: "error" });
        }
        res.status(200).json({ orders, message: "Orders fetched successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}

const getOrderById = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.authorization;
    if (!id || !userId) {
        return res.status(400).json({ message: "Order ID & User ID are required", status: "error" });
    }
    try {
        const order = await OrderModel.findById(id).where('user').equals(userId)
            .populate("user", "firstName lastName email")
            .populate("products.product", "name price image")
            .select("-__v -createdAt -updatedAt");
        if (!order) {
            return res.status(404).json({ message: "Order not found", status: "error" });
        }
        res.status(200).json({ order, message: "Order fetched successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}

const createOrder = async (req, res) => {
    const { userId, products, totalAmount } = req.body;
    if (!userId || !products || !totalAmount) {
        return res.status(400).json({ message: "User ID, products, and total amount are required", status: "error" });
    }
    try {
        const newOrder = new OrderModel({
            user: userId,
            products,
            totalAmount,
            status: "Pending"
        });
        const savedOrder = await newOrder.save();
        res.status(201).json({ order: savedOrder, message: "Order created successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}

const cancelOrder = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.authorization;

    if (!id || !userId) {
        return res.status(400).json({ message: "Order ID & User ID are required", status: "error" });
    }
    try {
        const order = await OrderModel.findByIdAndUpdate(id, { status: "Cancelled" }, { new: true, runValidators: true })
            .where('user').equals(userId)
            .populate("user", "firstName lastName email")
            .populate("products.product", "name price image")
            .select("-__v -createdAt -updatedAt");
        if (!order) {
            return res.status(404).json({ message: "Order not found", status: "error" });
        }
        res.status(200).json({ order, message: "Order cancelled successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}

const changeAddress = async (req, res) => {
    const userId = req.headers.authorization;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required", status: "error" });
    }
    const { address } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "Address required", status: "error" });
    }
    try {
        const user = await UserModel.findByIdAndUpdate(userId, { address }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: "User not found", status: "error" });
        }
        res.status(200).json({ user, message: "Address updated successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}

module.exports = {
    getAllOrdersByUser,
    getOrderById,
    createOrder,
    cancelOrder,
    changeAddress
}