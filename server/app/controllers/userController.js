const express = require('express')
const User = require('./../models/user')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const userController = {
    getAllUsers: (req, res) => {
        User.find().select('_id username firstname lastname email role')
        .then(result => {
            if (result) {
                return res.status(200).json({ data: result, status: true });
            } else {
                return res.status(400).json({ message: "Bad Request", status: false });
            }
        })
        .catch(err => res.status(400).json({ message: "Internal Server Err" }));
    },
    updateRole: (req, res) => {
        const { id, role } = req.body;
        User.findByIdAndUpdate(id,
            { role },
            {
                returnDocument: "after" // Return the updated document
            }
        )
        .then(result => {
            if (result) {
                    res.status(200).json({ message: "Role updated",  success: true});
                }
            else {
                res.status(500).json({message: "User information not updated yet"})
            }
        })
        .catch(err => console.error(err))
    },
    getUserById: (req, res) => {
        User.findOne({_id: new mongoose.Types.ObjectId(req.params.id)})
        .then(result => {
            if (result) {
                    res.status(200).json({result, status: true });
                }
            else {
                res.json({message: "user not found"})
            }
        })
        .catch(err => console.error(err))
    },
    updateUser: (req, res) => {
        const { firstname, lastname, email } = req.body;
        User.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(req.userId)},
            { firstname: firstname, lastname: lastname, email: email },
            {
                returnDocument: "after" // Return the updated document
                }
        )
        .then(result => {
            if (result) {
                    res.status(200).json({user: result, message: "user information updated",  success: true});
                }
            else {
                res.status(500).json({message: "user information not updated yet"})
            }
        })
        .catch(err => console.error(err))
    },
    changePassword: (req, res) => {
        const {password, newPassword} = req.body;
        const id = req.userId
        console.log(req.body)
        if (!password || !newPassword) {
            return res.status(400).json({
                message: 'Password and new password are required',
            });
        }
        User.findOne(
            {_id: new mongoose.Types.ObjectId(id)}
        )
        .then(result => {
            if (!result) {
                console.log("User not found");
                return res.status(404).json({
                    message: 'User not found',
                });
            }
            const isMatch = bcrypt.compareSync(password, result.password)
            console.log(isMatch)
            if (!isMatch) {
               res.status(400).json({
                    message: 'The old password is incorrect',
                })
            }
            else {
                const salt = bcrypt.genSaltSync(10);
                const newHashPassword = bcrypt.hashSync(newPassword, salt);
                result.password = newHashPassword;
                const newUser = new User(result);
                newUser.save()
                    .then(result => {
                        res.status(200).json({success: true, message: 'Password changed successfully'})
                    })
                    .catch(err => res.status(500).json({message: 'Error changing password'}))
            }

        })
        .catch(err =>{
            console.error("Error finding user:", err);
            res.status(500).json({
                success: false,
                message: 'Error finding user',
                error: err.message,
            });
        });
    },
    checkPassword: (req, res) => {
        const {password} = req.body;
        const id = req.userId
        console.log(req.body)
        if (!password) {
            return res.status(400).json({
                message: 'Password is required',
            });
        }
        User.findOne(
            {_id: new mongoose.Types.ObjectId(id)}
        )
        .then(result => {
            if (!result) {
                console.log("User not found");
                return res.status(404).json({
                    message: 'User not found',
                });
            }
            const isMatch = bcrypt.compareSync(password, result.password)
            if (!isMatch) {
               res.status(400).json({
                    success: false,
                    message: 'The password is incorrect',
                })
            }
            else {
                res.status(200).json({success: true, message: 'Password is correct'})
            }
        })
        .catch(err =>{
            console.error("Error finding user:", err);
            res.status(500).json({
                success: false,
                message: 'Error finding user',
                error: err.message,
            });
        });
    },
    checkUsername: (req, res) => {
        const {username} = req.body;
        console.log(req.body)
        if (!username) {
            return res.status(400).json({
                message: 'Username is required',
            });
        }
        User.findOne(
            {username: username}
        )
        .then(result => {
            if (!result) {
                console.log("User not found");
                return res.status(404).json({
                    message: 'User not found',
                });
            }
                res.status(200).json({success: true, message: 'Valid username', result: result.username});
        })
        .catch(err =>{
            console.error("Error finding user:", err);
            res.status(500).json({
                success: false,
                message: 'Error finding user',
                error: err.message,
            });
        });
    },
    forgotPassword: (req, res) => {
        const {username, newPassword} = req.body;
        if (!username || !newPassword) {
            return res.status(400).json({
                message: 'Password and new password are required',
            });
        }
        User.findOne(
            {username: username}
        )
        .then(result => {
            if (!result) {
                console.log("User not found");
                return res.status(404).json({
                    message: 'User not found',
                });
            }
            else {
                const salt = bcrypt.genSaltSync(10);
                const newHashPassword = bcrypt.hashSync(newPassword, salt);
                result.password = newHashPassword;
                const newUser = new User(result);
                newUser.save()
                    .then(result => {
                        res.status(200).json({success: true, message: 'Password changed successfully'})
                    })
                    .catch(err => res.status(500).json({message: 'Error changing password'}))
            }
        })
        .catch(err =>{
            console.error("Error finding user:", err);
            res.status(500).json({
                success: false,
                message: 'Error finding user',
                error: err.message,
            });
        });
    },
    deleteUser: (req, res) => {
        // const {id} = req.body;
        User.findOneAndDelete(
            {_id: new mongoose.Types.ObjectId(req.userId)},
        )
        .then(result => {
            if (result) {
                    res.status(200).json({user: result, message: "user deleted",  success: true});
                }
            else {
                res.status(500).json({message: "User not deleted yet"})
            }
        })
        .catch(err => console.error(err))
    },
    deleteUserByAdmin: (req, res) => {
        const {id} = req.body;
        User.findOneAndDelete(
            {_id: id},
        )
        .then(result => {
            if (result) {
                    res.status(200).json({user: result, message: "User deleted",  success: true});
                }
            else {
                res.status(500).json({message: "User not deleted yet"})
            }
        })
        .catch(err => console.error(err))
    },
    getUserCount: (req, res) => {
        User.countDocuments()
            .then(totalCount => {
                res.status(200).json({
                    data: totalCount, 
                    success: true,
                });
            })
            .catch(err => res.status(500).json(err));
    }
}

module.exports = userController;