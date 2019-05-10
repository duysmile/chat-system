const Constants = require('../common/constants');
const ResponseSuccess = require('../helpers/resonse.helper');
const { ObjectId } = require('mongodb');

const getAll = async function(req, res, next) {
    try {
        const productCollection = req.db.collection('products');
        const userCollection = req.db.collection('users');
        const products = await productCollection.find({ isAvailable: true }).toArray();
        const userIds = products.map(function(product) { 
            return ObjectId(product.userId);
        });
        
        const users = await userCollection.find({ _id: { $in: userIds } }).toArray();
        const productsWithUsers = products.map(function(product) {
            const index = users.findIndex(function(user) {
                return user._id.toString() === product.userId.toString();
            });
            return {...product, user: users[index]};
        })

        return ResponseSuccess('Get list products successfully', productsWithUsers, res);
    } catch(error) {
        return next(error);
    }
};

const create =  async function(req, res, next) {
    try {
        const productCollection = req.db.collection('products');
        const userCollection = req.db.collection('users');
        const {
            name,
            userId,
            price,
            colors,
            isAvailable,
            payload
        } = req.body;
        const existedUser = await userCollection.findOne({ _id: ObjectId(userId) });
        if (!existedUser) {
            return next(new Error('UserID is not existed!'));
        }
        const existedNameProduct = await productCollection.findOne({ name });
        if (!existedNameProduct) {
            return next(new Error('Name of roduct is existed!'));
        }
        const result = await productCollection.insertOne({
            name,
            price,
            colors,
            isAvailable,
            payload,
            userId: ObjectId(userId)
        });
        return ResponseSuccess('Create product successfully', result.ops, res);
    } catch (error) {
        return next(error);
    }
};

const getById = async function(req, res, next) {
    try {
        const { id } = req.params;
        const productCollection = req.db.collection('products');
        const userCollection = req.db.collection('users');
        const product = await productCollection.findOne({ _id: ObjectId(id) });
        if (!product) {
            return next(new Error('ProductID is not existed!'));
        }
        const user = await userCollection.findOne({ _id: ObjectId(product.userId) });
        const productWithUser = {...product, user};

        return ResponseSuccess('Get product by Id successfully', productWithUser, res);
    } catch (error) {
        return next(error);
    }
};

const update = async function(req, res, next) {
    try {
        const { id } = req.params;
        const productCollection = req.db.collection('products');
        const userCollection = req.db.collection('users');
        const {
            name,
            userId,
            price,
            colors,
            isAvailable,
            payload
        } = req.body;

        const existedUser = await userCollection.findOne({ _id: ObjectId(userId) });
        if (!existedUser) {
            return next(new Error('UserID is not existed!'));
        }
        
        const existedNameProduct = await productCollection.findOne({ name, _id: { $ne: ObjectId(id)} });
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

        const updateInfo = { $set: newProduct };

        const result = await productCollection.findOneAndUpdate({ _id: ObjectId(id) }, updateInfo);
        if (!result.value) {
            return next(new Error('ProductId is not existed!'));
        }

        return ResponseSuccess('Update product successfully!', result.value, res);
    } catch (error) {
        return next(error);
    }
};

const deleteById = async function(req, res, next) {
    try {
        const { id } = req.params;
        const productCollection = req.db.collection('products');
        const result = await productCollection.findOneAndDelete({ _id: ObjectId(id) });
        
        if (!result.value) {
            return next(new Error('ProductID is not existed!'));
        }

        return ResponseSuccess('Get product by Id successfully', result.value, res);
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
