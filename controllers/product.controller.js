const Constants = require('../common/constants');
const ResponseSuccess = require('../helpers/resonse.helper');
const { ObjectId } = require('mongodb');
const Product = require('../models/product');
const User = require('../models/user');

const getAll = async function(req, res, next) {
    try {
        const products = await Product.find({ isAvailable: true })
            .populate('user', '-password')
            .lean();

        return ResponseSuccess('Get list products successfully', products, res);
    } catch(error) {
        return next(error);
    }
};

const create =  async function(req, res, next) {
    try {
        const {
            name,
            user,
            price,
            colors,
            isAvailable,
            payload
        } = req.body;
        const existedUser = await User.findOne({ _id: ObjectId(user) }).lean();
        if (!existedUser) {
            return next(new Error('UserID is not existed!'));
        }
        
        const product = new Product({
            name,
            price,
            colors,
            isAvailable,
            payload,
            user: ObjectId(user)
        });
        const resultCreateProduct = await product.save();
        return ResponseSuccess('Create product successfully', resultCreateProduct.toObject(), res);
    } catch (error) {
        return next(error);
    }
};

const getById = async function(req, res, next) {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: ObjectId(id) }).lean();
        if (!product) {
            return next(new Error('ProductID is not existed!'));
        }
        const user = await User.findOne({ _id: ObjectId(product.user) }).lean();
        const productWithUser = {...product, user};

        return ResponseSuccess('Get product by Id successfully', productWithUser, res);
    } catch (error) {
        return next(error);
    }
};

const update = async function(req, res, next) {
    try {
        const { id } = req.params;
        const {
            name,
            user,
            price,
            colors,
            isAvailable,
            payload
        } = req.body;

        const existedUser = await User.findOne({ _id: ObjectId(user) }).lean();
        if (!existedUser) {
            return next(new Error('UserID is not existed!'));
        }
        
        let newProduct = {
            name,
            user,
            price,
            colors,
            isAvailable,
            payload
        };

        Object.keys(newProduct).forEach(function(key) {
            if (newProduct[key] === undefined) {
                delete newProduct[key];
            }
        });

        const product = await Product.findOneAndUpdate({ _id: ObjectId(id) }, newProduct, { new:true, overwrite: true }).lean();
        if (!product) {
            return next(new Error('ProductId is not existed!'));
        }

        return ResponseSuccess('Update product successfully!', product, res);
    } catch (error) {
        return next(error);
    }
};

const deleteById = async function(req, res, next) {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndDelete({ _id: ObjectId(id) }).lean();
        
        if (!product) {
            return next(new Error('ProductID is not existed!'));
        }

        return ResponseSuccess('Get product by Id successfully', product, res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAll,
    create,
    getById,
    update,
    deleteById
};
