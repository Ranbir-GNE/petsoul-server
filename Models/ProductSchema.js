const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        _id: ObjectId,
        name: String,
        description: String,
        price: Number,
        category: String,
        stock: Number,
        image: String, 
        createdAt: Date,
        updatedAt: Date,
    });
module.exports = mongoose.model('Product', ProductSchema);
