const express = require('express');
const Expense = require('../models/expense');

const expenseController = {
    getAllExpenses: (req, res) => {
        const page = parseInt(req.query.page) || 1; 
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const order = req.query.order === 'desc' ? -1 : 1;
        const skip = limit ? (page - 1) * limit : 0;
        let filters = {
            userId: req.userId
        };

        //search by name
        // const { name } = req.query
        // if(name) {
        //     filters.name = { $regex: name }
        // }

        let query = Expense.find(filters).sort({ createdAt: order }).skip(skip);
    
        if (limit) {
            query = query.limit(limit);
        }

        query
            .then(result => {
                Expense.countDocuments(filters)
                    .then(totalCount => {
                        const totalPages = limit ? Math.ceil(totalCount / limit) : 1;
                        res.status(200).json({
                            data: result,
                            meta: {
                                totalCount, 
                                totalPages, 
                                currentPage: limit ? page : 1,
                                limit: limit || 'all',
                            },
                            success: true,
                        });
                    })
                    .catch(err => res.status(500).json({message: 'Internal Server Error'}));
            })
            .catch(err => res.status(500).json({message: 'Internal Server Error'}));
    },
    createExpense: (req, res) => {
        let payload = {...req.body}
        payload.userId = req.userId
        const newExpense = new Expense(payload);
        newExpense.save()
            .then(result => res.status(200).json({data: result, success: true,}))
            .catch(err => res.status(500).json({message: 'Internal Server Error'}))
    },
    updateExpense: (req, res) => {
        const { id, value, type, date, note} = req.body;
        let payload = {
            userId: req.userId,
            value,
            type,
            date,
            note,
        }
        Expense.findByIdAndUpdate(id, payload, {new: true})
            .then(result => res.status(200).json({data: result, success: true,}))
            .catch(err => res.status(500).json(err))
    },
    deleteExpense: (req, res) => {
        const id = req.query.id;
        if(!id) {
            return res.status(400).json({message: 'Id is required'})
        }
        Expense.findByIdAndDelete(id)
            .then(result => res.status(200).json({success: true}))
            .catch(err => res.status(500).json({message: 'Internal Server Error'}))
    },
    getExpenseByType: async (req, res) => {
        try {
            const userId = req.userId;
            // Aggregation pipeline
            const matchStage = userId ? { userId } : {};
            const result = await Expense.aggregate([
                { $match: matchStage }, //Filter by userId
                {
                    $group: {
                        _id: "$type", // Group by the `type` field
                        total: { $sum: "$value" }, // Sum the `value` field for each type
                    }
                },
                { $sort: { _id: 1 } }
            ]);
            const formattedResult = result.map(item => ({
                type: item._id,
                total: item.total
            }));
    
            res.status(200).json({ success: true, data: formattedResult });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error', error });
        }
    },
    getExpenseByWeek: async (req, res) => {
        try {
            const { userId } = req; // Retrieve userId from query parameters
    
            if (!userId) {
                return res.status(400).json({ success: false, message: 'userId is required' });
            }
    
            // Aggregation pipeline
            const pipeline = [
                // Match documents by userId
                {
                    $match: { userId }
                },
                // Add a `dateObj` field to convert string to Date
                {
                    $addFields: {
                        dateObj: {
                            $dateFromString: {
                                dateString: "$date",
                                format: "%Y-%m-%d" // Adjust format to match your date strings
                            }
                        }
                    }
                },
                // Group by year, month, and week within the month
                {
                    $group: {
                        _id: {
                            year: { $year: "$dateObj" },
                            month: { $month: "$dateObj" },
                            weekInMonth: {
                                $ceil: {
                                    $divide: [
                                        { $dayOfMonth: "$dateObj" }, // Day of the month
                                        7 // Week size
                                    ]
                                }
                            }
                        },
                        totalValue: { $sum: "$value" }
                    }
                },
                // Sort by year, month, and week within the month
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1,
                        "_id.weekInMonth": 1
                    }
                }
            ];
    
            // Execute aggregation
            const result = await Expense.aggregate(pipeline);
    
            // Respond with the result
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server Error', error });
        }
    },
    getExpenseByDate: async (req, res) => {
        try {
            const { month, year } = req.query; // Retrieve month, and year from query parameters
            const userId = req.userId;

            if (!userId) {
                return res.status(400).json({ success: false, message: 'userId is required' });
            }
    
            // Match conditions based on query parameters
            const matchConditions = { userId };
    
            if (month) {
                matchConditions['$expr'] = {
                    ...(matchConditions['$expr'] || {}),
                    $eq: [{ $month: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } }, parseInt(month)]
                };
            }
    
            if (year) {
                matchConditions['$expr'] = {
                    ...(matchConditions['$expr'] || {}),
                    $eq: [{ $year: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } }, parseInt(year)]
                };
            }
    
            // Aggregation pipeline
            const pipeline = [
                // Match documents by userId and optionally by month/year
                { $match: matchConditions },
                // Add a `dateObj` field to convert string to Date
                {
                    $addFields: {
                        dateObj: {
                            $dateFromString: {
                                dateString: "$date",
                                format: "%Y-%m-%d" // Adjust format to match your date strings
                            }
                        }
                    }
                },
                // Group by year and month
                {
                    $group: {
                        _id: {
                            year: { $year: "$dateObj" },
                            month: { $month: "$dateObj" }
                        },
                        totalValue: { $sum: "$value" }
                    }
                },
                // Sort by year and month
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1
                    }
                }
            ];
    
            // Execute aggregation
            const result = await Expense.aggregate(pipeline);
    
            // Respond with the result
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error', error });
        }
    },
}

module.exports = expenseController;