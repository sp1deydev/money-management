const express = require('express');
const Product = require('../models/product');

const productController = {
    getAllProducts: (req, res) => {
        Product.find()
            .then(result => res.status(200).json({data: result}))
            .catch(err => res.status(500).json(err))
    },
    getProdutById: (req, res) => {
        Product.findById(req.params.id)
            .then(result => res.status(200).json({data: result}))
            .catch(err => res.status(500).json(err))
    },
    createProduct: (req, res) => {
        // console.log(req.file)
        req.body.image = req.file.path;
        const product = new Product(req.body);
        product.save()
            .then(result => res.status(200).json({data: result}))
            .catch(err => res.status(500).json(err))
    },
    deleteProduct: (req, res) => {
        const id = req.params.id;
        Product.findByIdAndDelete(id)
            .then(result => res.status(200).json('Delete product successfully'))
            .catch(err => res.status(500).json(err))
    },
    updateProduct: (req, res) => {
        const id = req.params.id;
        const { name, price, description, quantity } = req.body;
        const image = req.file.path;
        Product.findByIdAndUpdate(id, { name, price, description, image, quantity }, {new: true})
            .then(result => res.status(200).json(result))
            .catch(err => res.status(500).json(err))
    }
}

module.exports = productController;