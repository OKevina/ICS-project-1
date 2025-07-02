// server/src/controllers/productController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- Multer Configuration for Local Storage ---
const uploadsDir = path.join(__dirname, "../../public/uploads/product-images");

// Ensure the upload directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: fieldname-timestamp-random.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

// Configure Multer for image uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png, gif) are allowed!"), false);
    }
  },
});

// Middleware to handle single image upload
// 'productImage' is the field name from your frontend form
exports.uploadProductImage = upload.single("productImage");

// --- Controller Functions ---

// Get all products (for Products and Inventory pages)
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products." });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Failed to fetch product." });
  }
};

// Add a new product (used by AddProductForm.js)
exports.addProduct = async (req, res) => {
  try {
    // Assuming req.userData is set by an authentication middleware
    if (req.userData.role !== "FARMER") {
      // If a file was uploaded by multer, it needs to be cleaned up on auth failure
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(403)
        .json({ message: "Forbidden: Only farmers can add products." });
    }

    // Extract other fields from req.body (parsed by multer from form-data)
    const { name, description, price, stock, categoryId } = req.body;
    let imageUrl = null;

    if (req.file) {
      // If a file was uploaded, construct the URL path
      imageUrl = `/uploads/product-images/${req.file.filename}`;
    }

    // Validate incoming data
    if (!name || !description || !price || stock === undefined || !categoryId) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({
          message:
            "All required fields (name, description, price, stock, categoryId) must be provided.",
        });
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ message: "Price must be a positive number." });
    }
    if (isNaN(stock) || parseInt(stock) < 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ message: "Stock must be a non-negative integer." });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Invalid category ID provided." });
    }

    // Create the product in the database
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl: imageUrl, // Use the generated URL or null if no file uploaded
        categoryId,
      },
    });

    res
      .status(201)
      .json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    // If there was a file uploaded by multer, and Prisma operation failed, delete the file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error adding product:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return res
        .status(409)
        .json({ message: "A product with this name already exists." });
    }
    res.status(500).json({ message: "Failed to add product." });
  }
};

// Update product details (e.g., stock from Inventory.js)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  // Get other data from req.body
  const { name, description, price, stock, categoryId, removeImage } = req.body;
  let newImageUrl = null; // This will store the updated image URL or null

  try {
    // Fetch the existing product to get its current image URL
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    const oldImagePath = existingProduct?.imageUrl
      ? path.join(__dirname, "../../public", existingProduct.imageUrl)
      : null;

    // --- Image Handling Logic ---
    if (req.file) {
      // A new file was uploaded: delete the old one if it exists
      if (oldImagePath && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      newImageUrl = `/uploads/product-images/${req.file.filename}`;
    } else if (removeImage === "true" && oldImagePath) {
      // Frontend requested to remove the image and an old one exists
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      newImageUrl = null; // Set image URL to null in DB
    } else {
      // No new file, no request to remove: keep the existing image URL
      newImageUrl = existingProduct?.imageUrl || null;
    }

    // --- Prepare data for Prisma update, only include if defined ---
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    // Always update imageUrl based on image handling logic
    updateData.imageUrl = newImageUrl;

    // Validate data types for update
    if (
      updateData.price &&
      (isNaN(updateData.price) || updateData.price <= 0)
    ) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      } // Clean up new file on validation failure
      return res
        .status(400)
        .json({ message: "Price must be a positive number if provided." });
    }
    if (updateData.stock && (isNaN(updateData.stock) || updateData.stock < 0)) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      } // Clean up new file on validation failure
      return res
        .status(400)
        .json({ message: "Stock must be a non-negative integer if provided." });
    }
    if (updateData.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: updateData.categoryId },
      });
      if (!categoryExists) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        } // Clean up new file on validation failure
        return res
          .status(400)
          .json({ message: "Invalid category ID provided." });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    // If a new file was uploaded but Prisma operation failed, delete the new file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error updating product:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product not found." });
    }
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return res
        .status(409)
        .json({ message: "A product with this name already exists." });
    }
    res.status(500).json({ message: "Failed to update product." });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    // Assuming req.userData is set by an authentication middleware
    if (req.userData.role !== "FARMER" && req.userData.role !== "ADMIN") {
      return res.status(403).json({
        message: "Forbidden: Only farmers or admins can delete products.",
      });
    }

    const { id } = req.params;

    // Get the product to retrieve its image URL before deletion
    const productToDelete = await prisma.product.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    // Delete the product from the database
    await prisma.product.delete({
      where: { id },
    });

    // If an image URL exists, delete the image file from local storage
    if (productToDelete?.imageUrl) {
      const imagePath = path.join(
        __dirname,
        "../../public",
        productToDelete.imageUrl
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the file
        console.log(`Deleted image file: ${imagePath}`);
      } else {
        console.warn(`Image file not found at: ${imagePath} for product ${id}`);
      }
    }

    res.status(204).json({ message: "Product deleted successfully." }); // 204 No Content is standard for successful deletion
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product not found." });
    }
    // Handle potential foreign key constraint errors if products are linked to orders/cart items
    if (error.code === "P2003") {
      return res
        .status(409)
        .json({
          message:
            "Cannot delete product: It is linked to existing orders or cart items.",
        });
    }
    res.status(500).json({ message: "Failed to delete product." });
  }
};
