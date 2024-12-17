const express = require('express');
const Income = require('../models/income');

const incomeController = {
    getAllIncomes: (req, res) => {
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

        let query = Income.find(filters).sort({ createdAt: order }).skip(skip);
    
        if (limit) {
            query = query.limit(limit);
        }

        query
            .then(result => {
                Income.countDocuments(filters)
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
    createIncome: (req, res) => {
        let payload = {...req.body}
        payload.userId = req.userId
        const newIncome = new Income(payload);
        newIncome.save()
            .then(result => res.status(200).json({data: result, success: true,}))
            .catch(err => res.status(500).json({message: 'Internal Server Error'}))
    },
    updateIncome: (req, res) => {
        const { id, value, type, date} = req.body;
        let payload = {
            userId: req.userId,
            value,
            type,
            date,
        }
        Income.findByIdAndUpdate(id, payload, {new: true})
            .then(result => res.status(200).json({data: result, success: true,}))
            .catch(err => res.status(500).json(err))
    },
    deleteIncome: (req, res) => {
        const id = req.query.id;
        if(!id) {
            return res.status(400).json({message: 'Id is required'})
        }
        Income.findByIdAndDelete(id)
            .then(result => res.status(200).json({success: true}))
            .catch(err => res.status(500).json({message: 'Internal Server Error'}))
    },
    getIncomeByType: async (req, res) => {
        try {
            const userId = req.userId;
            // Aggregation pipeline
            const matchStage = userId ? { userId } : {};
            const result = await Income.aggregate([
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
    getIncomeByWeek: async (req, res) => {
        try {
            const { month, year } = req.query; // Lấy month và year từ query parameters
            const userId = req.userId;
    
            if (!userId) {
                return res.status(400).json({ success: false, message: 'userId is required' });
            }
    
            if (!year || !month) {
                return res.status(400).json({ success: false, message: 'month and year are required' });
            }
    
            // Aggregation pipeline
            const pipeline = [
                // Match documents dựa trên userId, year và month
                {
                    $match: {
                        userId,
                        $expr: {
                            $and: [
                                { $eq: [{ $year: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } }, parseInt(year)] },
                                { $eq: [{ $month: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } }, parseInt(month)] }
                            ]
                        }
                    }
                },
                // Chuyển đổi ngày từ string sang Date object
                {
                    $addFields: {
                        dateObj: {
                            $dateFromString: {
                                dateString: "$date",
                                format: "%Y-%m-%d"
                            }
                        }
                    }
                },
                // Nhóm dữ liệu theo năm, tháng và tuần trong tháng
                {
                    $group: {
                        _id: {
                            year: { $year: "$dateObj" },
                            month: { $month: "$dateObj" },
                            weekInMonth: {
                                $ceil: {
                                    $divide: [
                                        { $dayOfMonth: "$dateObj" }, // Ngày trong tháng
                                        7 // Chia cho 7 để xác định tuần trong tháng
                                    ]
                                }
                            }
                        },
                        totalValue: { $sum: "$value" } // Tính tổng giá trị
                    }
                },
                // Sắp xếp theo year, month và tuần trong tháng
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1,
                        "_id.weekInMonth": 1
                    }
                }
            ];
    
            // Thực thi aggregation
            const result = await Income.aggregate(pipeline);
    
            // Định dạng lại kết quả trả về
            const formattedResult = result.map(item => ({
                year: item._id.year,
                month: item._id.month,
                name: `Tuần ${item._id.weekInMonth}`,
                total: item.totalValue
            }));
    
            // Phản hồi kết quả
            res.status(200).json({ success: true, data: formattedResult });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server Error', error });
        }
    },
    getIncomeByDate: async (req, res) => {
        try {
            const { year } = req.query; // Lấy month và year từ query parameters
            const userId = req.userId;
    
            if (!userId) {
                return res.status(400).json({ success: false, message: 'userId is required' });
            }
    
            // Xác định các năm gần đây
            const currentYear = new Date().getFullYear();
            const recentYears = [currentYear, currentYear - 1, currentYear - 2]; // 3 năm gần đây
    
            // Match conditions
            const matchConditions = { userId };
    
            // Lọc theo năm nếu có, nếu không thì lấy 3 năm gần đây
            if (year) {
                matchConditions['$expr'] = {
                    ...(matchConditions['$expr'] || {}),
                    $eq: [{ $year: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } }, parseInt(year)]
                };
            } else {
                // Nếu không có year, lấy dữ liệu trong 3 năm gần đây
                matchConditions['$expr'] = {
                    ...(matchConditions['$expr'] || {}),
                    $in: [{ $year: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } }, recentYears]
                };
            }
    
            // Aggregation pipeline
            const pipeline = [
                // Match documents dựa trên userId và điều kiện lọc
                { $match: matchConditions },
                // Thêm trường dateObj để chuyển đổi từ string thành Date
                {
                    $addFields: {
                        dateObj: {
                            $dateFromString: {
                                dateString: "$date",
                                format: "%Y-%m-%d"
                            }
                        }
                    }
                },
                // Nhóm dữ liệu: nếu có 'year', nhóm theo từng tháng, nếu không nhóm theo năm
                {
                    $group: {
                        _id: year
                            ? { month: { $month: "$dateObj" } } // Nhóm theo tháng nếu có 'year'
                            : { year: { $year: "$dateObj" } }, // Nhóm theo năm nếu không có 'year'
                        totalValue: { $sum: "$value" } // Tính tổng giá trị
                    }
                },
                // Sắp xếp: theo năm hoặc tháng
                {
                    $sort: year
                        ? { "_id.month": 1 } // Sắp xếp theo tháng nếu có 'year'
                        : { "_id.year": 1 } // Sắp xếp theo năm nếu không có 'year'
                }
            ];
    
            // Thực thi aggregation
            const result = await Income.aggregate(pipeline);
    
            // Định dạng lại kết quả
            let formattedResult;
    
            if (year) {
                // Nếu có year → danh sách các tháng
                formattedResult = result.map(item => ({
                    month: `T${item._id.month}`,
                    total: item.totalValue
                }));
            } else {
                // Nếu không có year → danh sách các năm
                formattedResult = result.map(item => ({
                    year: `Năm ${item._id.year}`,
                    total: item.totalValue
                }));
            }
    
            // Trả về kết quả
            res.status(200).json({ success: true, data: formattedResult });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error', error });
        }
    },
}

module.exports = incomeController;