const { getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} = require("../Controllers/adminOrdersController");
const express = require("express");
const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);
module.exports = router;