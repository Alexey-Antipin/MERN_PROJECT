const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  contact: {type: Types.ObjectId, ref: "Contact"}
})

module.exports = model("User", schema);