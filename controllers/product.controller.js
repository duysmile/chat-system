const Constants = require('../common/constants');
const ResponseSuccess = require('../helpers/resonse.helper');
const { ObjectId } = require('mongodb');
const Product = require('../models/product');
const User = require('../models/user');

const getAll = async function(req, res, next) {
    try {
        const products = await Product.find({ isAvailable: true }).lean();
        const userIds = products.map(function(product) { 
            return ObjectId(product.userId);
        });
        
        const users = await User.find({ _id: { $in: userIds } }).lean();
        const productsWithUsers = products.map(function(product) {
            const index = users.findIndex(function(user) {
                return user._id.toString() === product.userId.toString();
            });
            return {...product, user: users[index]};
        });

        return ResponseSuccess('Get list products successfully', productsWithUsers, res);
    } catch(error) {
        return next(error);
    }
};

const create =  async function(req, res, next) {
    try {
        const {
            name,
            userId,
            price,
            colors,
            isAvailable,
            payload
        } = req.body;
        const existedUser = await User.findOne({ _id: ObjectId(userId) }).countDocuments();
        if (!existedUser) {
            return next(new Error('UserID is not existed!'));
        }
        const existedNameProduct = await Product.findOne({ name }).lean();
        if (existedNameProduct) {
            return next(new Error('Name of roduct is existed!'));
        }
        const product = new Product({
            name,
            price,
            colors,
            isAvailable,
            payload,
            userId: ObjectId(userId)
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
        const user = await User.findOne({ _id: ObjectId(product.userId) }).lean();
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
            userId,
            price,
            colors,
            isAvailable,
            payload
        } = req.body;

        const existedUser = await User.findOne({ _id: ObjectId(userId) }).countDocuments();
        if (!existedUser) {
            return next(new Error('UserID is not existed!'));
        }
        
        const existedNameProduct = await Product.findOne({ name, _id: { $ne: ObjectId(id)} }).lean();
        if (existedNameProduct) {
            return next(new Error('Name of roduct is existed!'));
        }
        
        let newProduct = {
            name,
            userId,
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
