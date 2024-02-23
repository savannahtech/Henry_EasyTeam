import { Request, Response } from "express";
const StaffMembers = require("../models/StaffMembers");
const router = require("express").Router();

// Create a staff member
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const staffMember = new StaffMembers({ name });
    await staffMember.save();
    res.status(201).json(staffMember);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

// Get all staff members
router.get("/", async (req: Request, res: Response) => {
  try {
    const staffMembers = await StaffMembers.find();
    res.json(staffMembers);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});


module.exports = router;
