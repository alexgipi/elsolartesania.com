import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {type:String, default: null},
  username: {type: String, default: null},
  email: {type: String, required: true},
  password: {type:String, required: true},
  role:{
    type: String,
    default:'customer'
  },
  address:{
    type: String,
    default: null
  }
},{ timestamps: true});

export const User = mongoose.model('User', UserSchema);