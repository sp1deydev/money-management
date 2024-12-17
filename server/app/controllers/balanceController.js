const express = require('express');
const Expense = require('../models/expense');
const Income = require('../models/income');

const balanceController = {
    getBalance: async (req, res) => {
      try {
        const userId = req.userId; // Extract userId from query params
    
        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }
    
        // Calculate total income
        const totalIncomeResult = await Income.aggregate([
          { $match: { userId: userId } },
          { $group: { _id: null, totalIncome: { $sum: "$value" } } },
        ]);
    
        const totalIncome = totalIncomeResult[0]?.totalIncome || 0;
    
        // Calculate total expense
        const totalExpenseResult = await Expense.aggregate([
          { $match: { userId: userId } },
          { $group: { _id: null, totalExpense: { $sum: "$value" } } },
        ]);
    
        const totalExpense = totalExpenseResult[0]?.totalExpense || 0;
    
        // Calculate balance
        const balance = totalIncome - totalExpense;
    
        // Return the response
        res.status(200).json({
          userId,
          totalIncome,
          totalExpense,
          balance,
        });
      } catch (error) {
        console.error("Error fetching balance:", error.message);
        res.status(500).json({ message: "Server error" });
      }
    },
    
}

module.exports = balanceController;