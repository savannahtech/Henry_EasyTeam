"use strict";
var mongoose = require("mongoose");
var ProductSchema = new mongoose.Schema({
    productName: { type: String, required: true }, // Product name
    category: { type: String, required: true }, // Category / product type
    price: { type: Number, required: true }, // Price
    commissionPercent: { type: Number, required: true }, // Commission percent
}, { timestamps: true });
module.exports = mongoose.model("Product", ProductSchema);
