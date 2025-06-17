const {
    getAllOrdersByUser,
    getOrderById,
    createOrder,
    cancelOrder,
    changeAddress
} = require("../Controllers/orderController");
const express = require("express");
const router = express.Router();

router.get("/", getAllOrdersByUser);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/cancel/:id", cancelOrder);
router.put("/change-address", changeAddress);