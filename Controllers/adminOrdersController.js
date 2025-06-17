const OrderModel = require("../Models/OrderSchema");
const UserModel = require("../Models/UserSchema");


const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find()
            .populate("user", "firstName lastName email")
            .populate("products.product", "name price image")
            .sort({ createdAt: -1 })
            .select("-__v -createdAt -updatedAt");
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found", status: "error" });
        }
        res.status(200).json({ orders, message: "Orders fetched successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}

const getOrderById = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Order ID is required", status: "error" });
    }
    try {
        const order = await OrderModel.findById(id)
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

const updateOrderStatus = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Order ID is required", status: "error" });
    }
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: "Status is required", status: "error" });
    }
    try {
        const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
            .populate("user", "firstName lastName email")
            .populate("products.product", "name price image")
            .select("-__v -createdAt -updatedAt");
        if (!order) {
            return res.status(404).json({ message: "Order not found", status: "error" });
        }
        res.status(200).json({ order, message: "Order status updated successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}

const deleteOrder = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Order ID is required", status: "error" });
    }
    try {
        const order = await OrderModel.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found", status: "error" });
        }
        res.status(200).json({ message: "Order deleted successfully", status: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message, status: "error" });
    }
}


module.exports = {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};
