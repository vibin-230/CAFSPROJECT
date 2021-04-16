const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String },
    add_date: { type: Date },
    sell_date: { type: Date },
    id_code: { type: String },
    base_price: { type: Number },
    sell_price: { type: Number },
    quantity_in_hand: { type: Number },
  },
  { timestamps: true }
);

module.exports = {
  productSchema: mongoose.model("product", productSchema),
};
