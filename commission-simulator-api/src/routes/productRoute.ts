import { Request, Response } from "express";
const Product = require("../models/Products");
const router = require("express").Router();


// Create a new product

router.post("/", async (req: Request, res: Response) => {
    try {
      const { name, category, price, commission } = req.body;
      const product = new Product({ name, category, price, commission });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "An error occured" });
    }
  });

// Get all products
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});

// Get a single product
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});

// Update a product
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { name, category, price } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { name, category, price }, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});

// Delete a product
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});


module.exports = router;