const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
  owner: {type: Types.ObjectId, ref: "User"},
  firstname: {type: String},
  telefon: {type:String},
  status: {type:Boolean}
})

module.exports = model("Contact", schema);