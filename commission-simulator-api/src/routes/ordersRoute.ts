import { Request, Response } from "express";
const Orders = require("../models/Orders");
const router = require("express").Router();

// Create an order
router.post("/", async (req: Request, res: Response) => {
    try {
      const { products, staffMember } = req.body;
      const order = new Orders({ products, staffMember });
      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
  });
  
  // Get all orders
  router.get("/", async (req: Request, res: Response) => {
    try {
      const orders = await Orders.find();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
  });

//   router.post('/simulate-commissions', async (req: Request, res: Response) => {
//     try {
//         // Extract data from the request
//         const { startDate, endDate, staffMember } = req.body;

//         // Fetch orders from the database within the specified date range
//         const orders = await Orders.find({ 
//             date: { $gte: startDate, $lte: endDate } 
//         }).populate('products');

//         let totalCommissions = 0;
//         const dailyCommissions: { [date: string]: { ordersCount: number, sumCommissions: number } } = {};

//         // Iterate through orders
//         orders.forEach(order => {
//             // Filter products related to the staff member and calculate commissions
//             const staffMemberProducts = order.products.filter(product => product.staffMember === staffMember);
//             let orderCommission = 0;

//             staffMemberProducts.forEach(product => {
//                 orderCommission += product.price * (product.commissionPercent / 100);
//             });

//             // Update total commissions
//             totalCommissions += orderCommission;

//             // Update daily commissions
//             const orderDate = order.date.toISOString().split('T')[0];
//             if (!dailyCommissions[orderDate]) {
//                 dailyCommissions[orderDate] = { ordersCount: 0, sumCommissions: 0 };
//             }
//             dailyCommissions[orderDate].ordersCount++;
//             dailyCommissions[orderDate].sumCommissions += orderCommission;
//         });

//         // Return the result
//         res.json({ totalCommissions, dailyCommissions });
//     } catch (error) {
//         console.error('Error simulating commissions:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

module.exports = router;