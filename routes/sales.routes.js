const express = require("express");
const router = express.Router();
const Sale = require("../models/sales.model"); // Asegúrate de que la ruta sea correcta

const PERPAGE = 10;

// Endpoint para obtener todas las ventas
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint para obtener las ventas por pagina
router.get("/:page", async (req, res) => {
  try {
    const page = parseInt(req.params.page ?? "1", 10);
    const skip = (page - 1) * PERPAGE;

    const totalSales = await Sale.countDocuments({})

    if (totalSales === 0) {
      return {
        sales: [],
        info: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          perPage: 0,
        },
      };
    }

    if (skip >= totalSales) {
      throw new Error(404, "No se ha encontrado la página.");
    }

    const sales = await Sale.find().skip(skip).limit(PERPAGE);

    const totalPages = Math.ceil(totalSales / PERPAGE);

    const response = {
      sales: sales,
      info: {
        currentPage: page,
        totalPages,
        totalItems: totalSales,
        perPage: PERPAGE,
      },
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint para obtener una venta por ID
router.get("/:id", getSale, (req, res) => {
  res.json(res.sale);
});

// Endpoint para crear una nueva venta
router.post("/", async (req, res) => {
  const sale = new Sale({
    clientName: req.body.clientName,
    productsOfSale: req.body.productsOfSale,
    totalPriceOfSale: req.body.totalPriceOfSale,
    paymentState: req.body.paymentState,
  });

  try {
    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Endpoint para actualizar una venta por ID
router.put("/:id", getSale, async (req, res) => {
  if (req.body.clientName != null) {
    res.sale.clientName = req.body.clientName;
  }
  if (req.body.productsOfSale != null) {
    res.sale.productsOfSale = req.body.productsOfSale;
  }
  if (req.body.totalPriceOfSale != null) {
    res.sale.totalPriceOfSale = req.body.totalPriceOfSale;
  }
  if (req.body.isPendingToPaid != null) {
    res.sale.isPendingToPaid = req.body.isPendingToPaid;
  }

  try {
    const updatedSale = await res.sale.save();
    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);

    if (!deletedSale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json({ message: "Venta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la venta:", error.message);
    res
      .status(500)
      .json({ message: "Error al eliminar la venta", error: error.message });
  }
});

// Middleware para obtener una venta por ID
async function getSale(req, res, next) {
  let sale;
  try {
    sale = await Sale.findById(req.params.id);
    if (sale == null) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.sale = sale;
  next();
}

module.exports = router;
