const { mongoose } = require('./index');

const checkDatePayload = function(value) {
    return value > this.payload.releasedAt;
};

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 5,
        max: 255,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    price: {
        type: Number,
        min: 1000,
        max: 1000000000,
        required: true
    },
    colors: [{
        type: String,
        required: true,
        min: 3,
        max: 20
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    payload: {
        expiredAt: {
            type: Date,
            required: true,
            validate: [checkDatePayload, 'Expired date must greater than released date!']
        },
        releasedAt: {
            type: Date,
            default: new Date()
        }
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;