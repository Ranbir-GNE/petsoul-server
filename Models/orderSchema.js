const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    _id: ObjectId,
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    products: [
        {
            productId: { type: ObjectId, ref: 'Product' },
            quantity: Number,
            price: Number,
        }
    ],
    totalAmount: Number,
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: String,
    createdAt: Date,
    updatedAt: Date,
    completedAt: Date,
});

module.exports = mongoose.model("Order", OrderSchema);

