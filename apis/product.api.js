const productController = require('../controllers/product.controller');
const productValidation = require('../validations/product.validation');
const validate = require('express-validation');

exports.load = function(app) {
    app.get('/api/v1/products', productController.getAll);
    app.get('/api/v1/products/:id', validate(productValidation.paramId()), productController.getById);
    app.delete('/api/v1/products/:id', validate(productValidation.paramId()), productController.deleteById);
    app.post('/api/v1/products', validate(productValidation.createProduct()), productController.create);
    app.put('/api/v1/products/:id', validate(productValidation.update()), productController.update);
};
