const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const entrySchema = new Schema({
  uid: {type: String, required: true},
  cards: {type: Array, required: true},
  notes: { type: String, required: false },
},{timestamps: {createdAt: 'created_at'}})

module.exports = mongoose.model("Entry", entrySchema)


