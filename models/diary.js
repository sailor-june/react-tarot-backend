const entrySchema = require ('./entry')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    uid:{type:String, required:true},
    username: {type:String, required:true}
  },{timestamps: {createdAt: 'created_at'}})
  
  module.exports = mongoose.model("diary", diarySchema)