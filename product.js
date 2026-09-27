const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

const DATA_DIR = path.resolve(__dirname, "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

router.get("/", async (req, res) => {
  try {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
    await fs.promises.access(PRODUCTS_FILE, fs.constants.F_OK);

    const raw = await fs.promises.readFile(PRODUCTS_FILE, "utf-8");
    const products = raw.trim() ? JSON.parse(raw) : [];

    return res.status(200).json({ message: "File already exists", products });
  } catch {
    try {
      await fs.promises.writeFile(PRODUCTS_FILE, "[]");
      return res.status(201).json({ message: "File created" });
    } catch (writeErr) {
      console.error("error writing file", writeErr);
      return res.status(500).json({ message: "Failed to create file" });
    }
  }
});

const isValidProduct = (product) =>
  Boolean(
    product &&
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.desc === "string" &&
    typeof product.price === "number" &&
    product.price >= 0,
  );

// //add product into file
router.post("/", async (req, res) => {
  if (!isValidProduct(req.body)) {
    return res.status(400).json({ message: "Invalid product data format" });
  }

  const newProduct = {
    id: req.body.id,
    name: req.body.name,
    desc: req.body.desc,
    price: req.body.price,
  };

  try {
    let products = [];
    try {
      const productsRead = await fs.promises.readFile(PRODUCTS_FILE, "utf8");
      products = productsRead.trim() ? JSON.parse(productsRead) : [];
    } catch (readErr) {
      if (readErr.code !== "ENOENT") throw readErr;
      products = []; // file doesn't exist yet
    }

    if (products.some((p) => p.id === newProduct.id)) {
      return res.status(409).json({ message: "Product id already exists" });
    }

    products.push(newProduct);
    await fs.promises.writeFile(
      PRODUCTS_FILE,
      JSON.stringify(products, null, 2),
    );

    res
      .status(201)
      .json({ message: "Product added successfully!", newProduct });
  } catch (error) {
    console.error("error adding product", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// read all products into file
router.get("/", async (req, res) => {
  try {
    const productsRead = await fs.promises.readFile(PRODUCTS_FILE, "utf8");
    res.status(200).json({ message: JSON.parse(productsRead) });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error while trying to read the file", error });
  }
});

//read one product from file
router.get("/:name", async (req, res) => {
  try {
    const keyWord = req.params.name;
    const productsRead = await fs.promises.readFile(PRODUCTS_FILE, "utf8");
    const products = JSON.parse(productsRead);
    const result = products.filter((product) =>
      product.name.toLowerCase().includes(keyWord.toLowerCase()),
    );
    if (result.length > 0) {
      res.status(200).json({ message: "product founded successfully!", result });
      //   return result;
    } else {
      res
        .status(404)
        .json({ message: "there is no product with this name."});
    }
  } catch (error) {
    res.status(500).json({ message: "error finding product", error });
  }
});

//edit product from file
router.put("/:id", async (req, res) => {
  if (!isValidProduct(req.body)) {
    return res.status(400).json({ message: "Invalid product data format" });
  }
  try {
    const productId = req.params.id;
    let updatedFields = req.body;    
    const productsRead = await fs.promises.readFile(PRODUCTS_FILE, "utf-8");
    let products = JSON.parse(productsRead);
    let found = false;
    products = products.map((product) => {
      if (product.id === productId) {
        found = true;
        return { ...product, ...updatedFields, id: product.id };
      }
      return product;
    });

    if (!found) {
      return res.status(404).json({ message: `Product with id = ${productId} not found` });
    }
    await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return res.status(200).json({message : `Product with id = ${productId} updated successfully!.`})
  } catch (error) {
    console.log("error while updating the product", error);
  }
});
// delete product from file
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const productsRead = await fs.promises.readFile(PRODUCTS_FILE, "utf-8");
    let products = JSON.parse(productsRead);
    const found = products.some((product) => product.id === productId);
    if (!found) {
      return res.status(404).json({ message: `Product with id = ${productId} not found` });
    }
    const updatedProducts = products.filter(
      (product) => {
        
        return product.id !== productId;
      }
    );
    await fs.promises.writeFile(PRODUCTS_FILE,JSON.stringify(updatedProducts, null, 2));
      
    return res.status(200).json({
      message: `Product with id = ${productId} deleted successfully!.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error while deleting the product", error });
  }
});

module.exports = router;
