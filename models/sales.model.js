const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  productsOfSale: [
    {
      type: {
        type: String,
        enum: [
          "Con todo",
          "Sin Nada",
          "Solo frutos secos",
          "Solo fruta confitada",
          "Cola de mono",
        ],
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unitPrice: {
        type: Number,
        required: true,
      },
      totalQuantityPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPriceOfSale: {
    type: Number,
    required: true,
  },
  dateOfSale: {
    type: Date,
    default: Date.now,
  },
  paymentState: {
    type: String,
    enum: ["Pagado", "Pendiente"],
    required: true,
  },
});

// Configuración para excluir los campos __v y _id en las respuestas
salesSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

// Creación del modelo basado en el esquema
const Sale = mongoose.model("Sale", salesSchema);

module.exports = Sale;
