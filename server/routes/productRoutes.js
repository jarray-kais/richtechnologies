import expressAsyncHandler from "express-async-handler";
import express from "express";
import cron from "node-cron";
import { isAdmin, isAuth, isSellerOrAdmin } from "../utils.js";
import { upload } from "./uploadRouter.js";
import Product from "../models/ProductModel.js";
import dotenv from "dotenv";
import { Client } from "@elastic/elasticsearch-serverless";
import fs from "fs";
dotenv.config();

const client = new Client({
  node: process.env.URL,
  auth: {
    apiKey: process.env.apiKey,
  },
});
const productRouter = express.Router();

// check promotions daily at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    // Find products with expired promotions
    const products = await Product.find({
      "promotion.endDate": { $lt: new Date() },
    });

    // If there are no products to update, return early
    if (products.length === 0) {
      console.log("No promotions to update.");
      return;
    }

    // Prepare bulk operations
    const bulkOps = products.map((product) => ({
      updateOne: {
        filter: { _id: product._id },
        update: { $unset: { promotion: "" } },
      },
    }));

    // Perform bulk update
    const result = await Product.bulkWrite(bulkOps);

    console.log(
      `Checked promotions. Updated ${result.modifiedCount} products.`
    );
  } catch (error) {
    console.error("Error checking promotions:", error);
  }
});

//Route pour obtenir les brand de chaque maincategory
productRouter.get(
  "/brand",
  expressAsyncHandler(async (req, res) => {
    const mainCategory = req.query.mainCategory;
    let brands ;
    if(mainCategory) {
      const decodedMainCategory = decodeURIComponent(mainCategory);
      console.log(decodedMainCategory);
    brands = await Product.distinct("brand", {
      "category.main": decodedMainCategory,
    });
  }else{
  brands = await Product.distinct("brand")
    
  }
    res.send(brands);
  })
);
//Route pour obtenir les main-catégories
productRouter.get(
 "/maincategories",
 expressAsyncHandler(async (req, res) => {
   const mainCategories = await Product.distinct("category.main");

   res.send(mainCategories);
 })
);
//Route pour obtenir les sous-catégories d'une catégorie spécifique
productRouter.get(
  "/:mainCategory/subcategories",
  expressAsyncHandler(async (req, res) => {
    const mainCategory = req.params.mainCategory;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = (page - 1) * limit;

    const subCategories = await Product.distinct("category.sub", {
      "category.main": mainCategory,
    });
    res.send(subCategories);
  })
);
productRouter.get(
  "/main/:mainCategory/:subCategory?",
  expressAsyncHandler(async (req, res) => {
    const { mainCategory, subCategory } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = (page - 1) * limit;

    if (!subCategory) {
      // Si subCategory n'est pas défini, retourner les sous-catégories
      const mainCategoryProduct = await Product.find({
        "category.main": mainCategory,
      }).sort({ rating: -1 })
      .skip(startIndex)
      .limit(limit);
      res.send(mainCategoryProduct);
    } else {
      // Si subCategory est défini, retourner les produits
      const products = await Product.find({
        "category.main": mainCategory,
        "category.sub": subCategory,
      })
        .sort({ rating: -1 })
        .skip(startIndex)
        .limit(limit);
      res.send(products);
    }
  })
);
//Route to handle search

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const {
      query,
      category,
      brand,
      minPrice,
      maxPrice,
      page = 1,
      pageSize = 16,
    } = req.query;


    if (!query) {
      return res.status(400).send({ message: 'Query parameter is required' });
    }

    const from = (page - 1) * pageSize;

    try {
      const searchParams = {
        index: 'ecommerce',
        body: {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query,
                    fields: [
                      'name^1',
                      'description',
                      'brand^3',
                      'category.main^2',
                      'category.sub^2',
                    ],
                    fuzziness: 'AUTO',
                  },
                },
              ],
              filter: [],
            },
          },
          highlight: {
            fields: {
              name: {},
              description: {},
              brand: {},
              'category.main': {},
              'category.sub': {},
            },
          },
          from,
          size: parseInt(pageSize, 10),
        },
      };

      if (category) {
        const categoryList = category.split(','); 
        searchParams.body.query.bool.filter.push({
          bool: {
            should: categoryList.map((category) => ({
              bool: {
                should: [
                  { term: { "category.main": category } },
                  { term: { "category.sub": category } }
                ]
              }
            }))
          }
        });
      }
      if (brand) {
        const  brandList = brand.split(',');
        searchParams.body.query.bool.filter.push({
          bool: {
            should: brandList.map((brand) => ({
              term: { brand: brand }
            }))
          }
        });
      }

      if (minPrice || maxPrice) {
        const priceFilter = {};
        if (minPrice) priceFilter.gte = minPrice;
        if (maxPrice) priceFilter.lte = maxPrice;
        searchParams.body.query.bool.filter.push({
          bool: {
            should: [
              { range: { price: priceFilter } },
              { range: { 'promotion.discountedPrice': priceFilter } },
            ],
          },
        });
      }

      const searchResult = await client.search(searchParams);
      const hits = searchResult.hits.hits;
      const ids = hits.map(hit => hit._id);
      const products = await Product.find({ _id: { $in: ids } });

      const productMap = {};
      products.forEach((product) => {
        productMap[product._id] = product;
      });

      const searchResultsWithFullDocuments = hits.map(hit => ({
        ...hit,
        fullDocument: productMap[hit._id],
      }));

      res.send({
        results: searchResultsWithFullDocuments,
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
      });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).send({ message: 'Error searching products' });
    }
  })
);
// Route to handle suggestions
productRouter.get('/suggest', expressAsyncHandler(async (req, res) => {
  let { query } = req.query;
  console.log('Query:', query);

  if (typeof query !== 'string') {
    return res.status(400).send({ message: 'Query parameter must be a string' });
  }


  query = query.toLowerCase();
  const mappings = await client.indices.getMapping({ index: 'ecommerce_suggest' });
console.log('Index Mappings:', mappings);


    // Search Elasticsearch
    const result = await client.search({
      index: 'ecommerce_suggest',
      body: {
        suggest: {
          name_suggestion: {
            prefix: query,
            completion: {
              field: 'name.suggest'
            }
          },
          description_suggestion: {
            prefix: query,
            completion: {
              field: 'description.suggest'
            }
          },
          main_suggestion: {
            prefix: query,
            completion: {
              field: 'category.main.suggest'
            }
          },
          sub_suggestion: {
            prefix: query,
            completion: {
              field: 'category.sub.suggest'
            }
          },
          brand_suggestion: {
            prefix: query,
            completion: {
              field: 'brand.suggest' 
            }
          }
        }
      }
    });

    // Log the entire result object
    console.log('Elasticsearch Result:', result.suggest);

    // Log the suggest section
    const suggestSection = result.suggest || {};
    console.log('Suggest Section:', suggestSection);

    // Extract suggestions
    const suggestions = {
      name: (suggestSection.name_suggestion?.[0]?.options?.map(option => option.text) || []),
      description: (suggestSection.description_suggestion?.[0]?.options?.map(option => option.text) || []),
      description: (suggestSection.description_suggestion?.[0]?.options?.map(option => option.text) || []),
      brand: (suggestSection.brand_suggestion?.[0]?.options?.map(option => option.text) || []),
      main: (suggestSection.main_suggestion?.[0]?.options?.map(option => option.text) || []),
      sub: (suggestSection.sub_suggestion?.[0]?.options?.map(option => option.text) || []),
    };

    console.log('Extracted Suggestions:', suggestions);

    res.json(suggestions);
  
}));







//route find deal products
productRouter.get(
  "/deal",
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const dealProducts = await Product.find({
      "promotion.endDate": { $gt: new Date() },
    })
      .populate("promotion", "promotion.discountedPrice  promotion.endDate")
      .skip(startIndex)
      .limit(limit);
    res.send(dealProducts);
  })
);
productRouter.get(
  "/deal5stars",
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const dealProducts = await Product.find({
      "promotion.endDate": { $gt: new Date() },
      rating: 5,
    })
      .skip(startIndex)
      .limit(limit);
    res.send(dealProducts);
  })
);
//router admin find all products
productRouter.get(
  "/all",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    // Calcul de l'index de début
    const startIndex = (page - 1) * limit;

    // Récupération des produits pour la page donnée
    const products = await Product.find().skip(startIndex).limit(limit);

    if (products) {
      res.send(products);
    } else {
      res.status(404).send({ message: "Products Not Found" });
    }
  })
);
//route to fetch user view history
productRouter.get(
  "/history",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const startIndex = (page - 1) * limit;
    const userId = req.user._id;
    console.log(userId);
    const history = await Product.find({ "viewedProduct.user": userId })
      .select("name image rating numReviews viewedProduct")
      .populate({ path: "viewedProduct.user", select: "viewedAt" })
      .skip(startIndex)
      .limit(limit);
    res.send(history);
  })
);
//router featured products
productRouter.get(
  "/featured",
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const featuredProducts = await Product.find({ rating: 5 })
      .populate("seller", "name")
      .populate("promotion", "discountedPrice")
      .skip(startIndex)
      .limit(limit);
    res.send(featuredProducts);
  })
);

//product of seller
productRouter.get(
  "/:id/seller",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const sellerorAdminId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const products = await Product.find({ seller: sellerorAdminId })
      .skip(startIndex)
      .limit(limit);
    if (products) {
      res.send(products);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

const findSimilarProducts = async (product, page, limit) => {
  const startIndex = (page - 1) * limit;
  const similarProducts = await Product.find({
    "category.main": product.category.main,
    _id: { $ne: product._id },
  })
    .sort({ rating: -1 })
    .skip(startIndex)
    .limit(limit);
  return similarProducts;
};

//router similar product
productRouter.get(
  "/:id/similar",
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
   
    const product = await Product.findById(productId);
    console.log(product);
    if (product) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const similarProducts = await findSimilarProducts(product, page, limit);
      
      res.send(similarProducts);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

//find product by id
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "seller.nameBrand seller.logo seller.rating seller.numReviews"
    )
    if (!product) {
      return res.status(404).send({ message: "Product Not Found" });
    }
    res.send(product);
 
  })
);
//Route pour obtenir les produits d'une sous-catégorie spécifique :
productRouter.get(
  "/:mainCategory/:subCategory",
  expressAsyncHandler(async (req, res) => {
    const mainCategory = req.params.mainCategory;
    const subCategory = req.params.subCategory;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = (page - 1) * limit;
    const products = await Product.find({
      "category.main": mainCategory,
      "category.sub": subCategory,
    })
      .sort({ rating: -1 })
      .skip(startIndex)
      .limit(limit);

    res.send(products);
  })
);



//create new product
productRouter.post(
  "/new",
  isAuth,
  isSellerOrAdmin,
  upload.array("image", 5),
  expressAsyncHandler(async (req, res) => {
    const {
      name,
      description,
      mainCategory,
      subCategory,
      brand,
      price,
      countInStock,
    } = req.body;
    const image = req.files.map((file) => ({ url: file.path }));
    const product = new Product({
      seller: req.user._id,
      name,
      description,
      category: {
        main: mainCategory,
        sub: subCategory,
      },
      brand,
      price,
      countInStock,
      image: image.map((image, index) => ({
        url: image.url,
      })),
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  })
);

//route promotion
productRouter.post(
  "/:id/promotion",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    const promotion = {
      discountedPrice: req.body.discountedPrice || product.discountedPrice,
      endDate: req.body.endDate || product.endDate,
      originalPrice: product.price,
    };

    // Vérifiez si la promotion existante est expirée
    if (product.promotion && new Date(product.promotion.endDate) < new Date()) {
      product.promotion = null; // Supprimer la promotion
    } else {
      product.promotion = promotion;
      
    }

    const updatedProduct = await product.save();
    res.status(201).send(updatedProduct);
  })
);

//route review
productRouter.post(
  "/:id/review",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }
    }

    const review = {
      name: req.user.name,
      profilePicture: req.user.profilePicture,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length; 

    const updatedProduct = await product.save();
    res.status(201).send(updatedProduct);
  })
);

// route to save product view
productRouter.post(
  "/:id/view",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const userId = req.user._id;
    const product = await Product.findById(productId);
    // console.log(userId)
    if (!product) {
      res.status(404).send({ message: "Product Not Found" });
    } else {
      const viewIndex = product.viewedProduct.findIndex(
        (view) => view.user.toString() === userId.toString()
      );
      if (viewIndex !== -1) {
        product.viewedProduct[viewIndex].viewedAt = Date.now();
      } else {
        // Add a new view entry if the user hasn't viewed the product before
        product.viewedProduct.push({ user: userId, viewedAt: Date.now() });
      }
    }
    await product.save();

    res.status(201).send({ message: "Product viewed", product });
  })
);
//route update product
productRouter.put(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  upload.array("image", 5),
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.category.main = req.body.mainCategory || product.category.main;
    product.category.sub = req.body.subCategory || product.category.sub;
    product.brand = req.body.brand || product.brand;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.description = req.body.description || product.description;
    if (req.files && req.files.length > 0) {
      // Supprimez les anciennes images
      if (product.images && product.images.length > 0) {
        product.images.forEach((image) => {
          fs.unlink(image.url, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Successfully deleted ${image.url}`);
            }
          });
        });
      }

      // Mettez à jour le tableau d'images avec les nouveaux chemins
      product.image = req.files.map((file) => ({ url: file.path }));
    }

    const updatedProduct = await product.save();

    res.send({ message: "Product Updated", product: updatedProduct });
  })
);

//delete product
productRouter.delete(
  "/:id/product",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      if (product.image && product.image.length > 0) {
        product.image.forEach((image) => {
          fs.unlink(image.url, (err) => {
            if (err) {
              console.error(`Error deleting ${image.url}:`, err);
            } else {
              console.log(`Successfully deleted ${image.url}`);
            }
          });
        });
      }

      const deleteProduct = await product.deleteOne();
      res.send({ message: "Product Deleted", product: deleteProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
//seller or admin delete her product
productRouter.delete(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      if (product.image && product.image.length > 0) {
        product.image.forEach((image) => {
          fs.unlink(image.url, (err) => {
            if (err) {
              console.error(`Error deleting ${image.url}:`, err);
            } else {
              console.log(`Successfully deleted ${image.url}`);
            }
          });
        });
      }

      const deleteProduct = await product.deleteOne();
      res.send({ message: "Product Deleted", product: deleteProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

export default productRouter;
