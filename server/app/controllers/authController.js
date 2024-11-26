const express = require('express');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const _const = require('../config/constants');
const mongoose = require('mongoose');


const createToken = (id, role) => {
    return jwt.sign({ id, role }, _const.JWT_ACCESS_KEY, {
      expiresIn: 3 * 24 * 60 * 60,
    });
}


const authController = {
    signup: (req, res, next) => {
        const salt = bcrypt.genSaltSync(10);
        console.log(req.body);
        const newUser = {
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, salt),
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          role: req.body.role,
        };
        User.findOne({username: req.body.username})
            .then(result => {
                if (result) {
                    res.json({message: "username exists"})
                }
                else {
                    const user = new User(newUser);
                    user.save() 
                        .then(result => {
                            res.status(200).json({success: true, message: 'User saved successfully'})
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({message: 'Error saving user from sever'})
                        }
                        )
                }
            })
            .catch(err => console.error(err))
    },
    login: (req, res, next) => {
        const user = {
          username: req.body.username,
          password: req.body.password,
        };
        User.findOne({username: req.body.username})
            .then(result => {
                if (result) {
                    const auth = bcrypt.compareSync(user.password, result.password)
                    if(auth) {
                        const token = createToken(result._id, result.role);
                        res.header('Authorization', token);
                        res.cookie('jwt_token', token);
                        res.status(200).json({ user: result, token, success: true, message: "success" });
                    }
                    else {
                        res.json({message: 'incorrect password'});
                    }
                }
                else {
                    res.json({message: "username notfound"})
                }
            })
            .catch(err => console.error(err))
    },
    logout: (req, res, next) => {
        res.cookie('jwt_token', '', {maxAge: 1});
        req.session.destroy((err) => {
            console.log(err);
        })
        res.json({message: 'logout'});
    },
    getUser: (req, res, next) => {
        User.findOne({_id: new mongoose.Types.ObjectId(req.userId)})
        .then(result => {
            if (result) {
                    res.status(200).json({user: result, success: true, massage: "Get user successfully" });
                }
            else {
                res.json({ message: "id notfound", success: false})
            }
        })
        .catch(err => console.error(err))
    },
}

module.exports = authController;