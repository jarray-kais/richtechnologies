import mongoose from 'mongoose';

/*  const client = new Client({ node: process.env.URL ,
  auth: {
      apiKey : process.env.apiKey
    },
});  */


const viewedProductSchema = new mongoose.Schema({
  user :{  type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true
            },
  viewedAt: { type: Date, default: Date.now },
}, { _id : false }); 

const promotionSchema = mongoose.Schema({
    discountedPrice: { type: Number, required: true }, 
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true }, 
});
const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        comment: { type: String, required: true },
        rating: { type: Number, required: true },
    },
    {
        timestamps: true 
    }
);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true  },
        category: {
            main: { type: String, required: true  },
            sub: { type: String, required: true }
        },
        brand: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        countInStock: { type: Number, required: true, default: 0 },
        image: [
            {
              url: { type: String, required: true  },
            },
          ],
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        viewedProduct : [viewedProductSchema] , 
        reviews: [reviewSchema], 
        promotion: promotionSchema ,
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true
        }
    },
    {
        timestamps: true 
    }
);

/* async function syncToElastic(doc, operation) {
  let body;
  switch (operation) {
    case 'insert':
    case 'update':
      body = {
        name: doc.name,
        description: doc.description,
        category: {
          main: doc.category.main,
          sub: doc.category.sub
        },
        brand: doc.brand,
        price: doc.price,
        countInStock: doc.countInStock,
        rating: doc.rating,
        promotion: doc.promotion
      };
      await client.index({
        index: 'ecommerce',
        id: doc._id.toString(),
        body,
        refresh: true
      });
      break;
    case 'delete':
      await client.delete({
        index: 'ecommerce',
        id: doc._id.toString(),
        refresh: true
      });
      break;
    default:
    
  }
}

// Add Mongoose hooks for save, update, and delete operations
productSchema.post('save', function(doc) {
 syncToElastic(doc, 'insert');
});

productSchema.post('findOneAndUpdate', function(doc) {
  syncToElastic(doc, 'update');
});

productSchema.pre('remove', function(next) {
  this.model('Product').deleteOne({ _id: this._id }, next);
});

productSchema.post('delete', function(doc, next) {
  syncToElastic(doc, 'delete');
  next();
}); */

productSchema.index({ 'category.main': 1, 'category.sub': 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;


/*  async function syncData() {

  try {
    const dataset = await Product.find()
    
  const operations = dataset.flatMap(doc => [
    { index:  {
        _index: 'ecommerce',
        _id: doc._id // ID du document dans MongoDB
      }
    },
    {
      name: doc.name,
      description: doc.description,
      category: {
        main: doc.category.main,
        sub: doc.category.sub
      },
      brand: doc.brand,
      price: doc.price,
      countInStock: doc.countInStock,
      rating: doc.rating,
      promotion: doc.promotion,
    }
  
  ])

  const bulkResponse = await client.bulk({ refresh: true,body : operations })
  if (bulkResponse.errors) {
    const erroredDocuments = []
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0]
      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          operation: operations[i * 2],
          document: operations[i * 2 + 1]
        })
      }
    })
    console.log(erroredDocuments)
  }

  const count = await client.count({ index: 'ecommerce' })
  console.log(count)
  } catch (error) {
    console.log(error)
  }
  
  }
  syncData();
 */