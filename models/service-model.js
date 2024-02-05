const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
  service: { type: String, required: true },
  description: { type: String, required: true },
   price: { type: String, required: false },
  provider: { type: String, required: true },
  irame:{ type: String, required:false },
  payment:{type: Array, required:false}
});

const Service = new model("Service", serviceSchema);

module.exports = Service;
