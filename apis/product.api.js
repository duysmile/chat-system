const productController = require('../controllers/product.controller');
const productValidation = require('../validations/product.validation');
const validate = require('express-validation');
const authenMiddleware = require('../middlewares/authentication.middleware');
const router = require('express').Router();

router.use(authenMiddleware.verifyToken);
router.get('', productController.getAll);
router.get('/:id', validate(productValidation.paramId()), productController.getById);
router.delete('/:id', validate(productValidation.paramId()), productController.deleteById);
router.post('', validate(productValidation.createProduct()), productController.create);
router.put('/:id', validate(productValidation.update()), productController.update);

module.exports = router;
