const express = require('express');
const Goal = require('../models/goal');

const goalController = {
    getAllGoals: (req, res) => {
        const page = parseInt(req.query.page) || 1; 
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const order = req.query.order === 'desc' ? -1 : 1;
        const skip = limit ? (page - 1) * limit : 0;
        let filters = {
            userId: req.userId
        };

        //search by name
        const { name } = req.query
        if(name) {
            filters.name = { $regex: name }
        }

        let query = Goal.find(filters).sort({ createdAt: order }).skip(skip);
    
        if (limit) {
            query = query.limit(limit);
        }

        query
            .then(result => {
                Goal.countDocuments(filters)
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
    createGoal: (req, res) => {
        let payload = {...req.body}
        payload.userId = req.userId
        const newGoal = new Goal(payload);
        newGoal.save()
            .then(result => res.status(200).json({data: result, success: true,}))
            .catch(err => res.status(500).json({message: 'Internal Server Error'}))
    },
    updateGoal: (req, res) => {
        const { id, name, targetAmount, currentAmount, deadline} = req.body;
        let payload = {
            userId: req.userId,
            name,
            targetAmount,
            currentAmount,
            deadline,
        }
        Goal.findByIdAndUpdate(id, payload, {new: true})
            .then(result => res.status(200).json({data: result, success: true,}))
            .catch(err => res.status(500).json(err))
    },
    deleteGoal: (req, res) => {
        const id = req.query.id;
        if(!id) {
            return res.status(400).json({message: 'Id is required'})
        }
        Goal.findByIdAndDelete(id)
            .then(result => res.status(200).json({success: true}))
            .catch(err => res.status(500).json({message: 'Internal Server Error'}))
    },
}

module.exports = goalController;