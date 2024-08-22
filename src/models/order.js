import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: {type: Schema.ObjectId, ref:'User', default: null},
    orderNumber: Number,
    items: Object,
    email: String,
    shippingAddress: Object,
    billingAddress: Object,
    paymentMethod: String,
},{ timestamps: true});

export const Order = mongoose.model('Order', OrderSchema);