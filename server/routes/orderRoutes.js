import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/OrderModel.js';
import User from '../models/userModel.js';
import Product from '../models/ProductModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';
import nodemailer from 'nodemailer';

const orderRouter =express.Router()

orderRouter.get(
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = (page - 1) * limit;
    const seller = req.query.seller || '';
    const sellerFilter = seller ? { seller } : {};

    const orders = await Order.find({ ...sellerFilter }).populate(
      'user',
      'name'
    ).skip(startIndex)
    .limit(limit);;
    res.send(orders);
  })
);

//Fetches summary data for orders, users, and products.
orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // Fetch total orders, total sales, and daily orders
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    // Fetch total number of users
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    //Fetch daily orders and sales
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

     // Fetch sales by payment method
    const salesByPaymentMethod = await Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          totalSales: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
    ]);
  // Fetch number of users by month
    const usersByMonth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

     // Fetch product categories
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category.main',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories , salesByPaymentMethod , usersByMonth });
  })
);


// Route for users to view their own orders
orderRouter.get(
  '/my',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = (page - 1) * limit;
    const orders = await Order.find({ user: req.user._id }).skip(startIndex)
     .limit(limit);
    res.send(orders);
  })
);
// Route Admin to view all orders
orderRouter.get(
  '/AllOrder',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = (page - 1) * limit;
    const orders = await Order.find({}).skip(startIndex)
     .limit(limit);
    res.send(orders);
  })
);

// Route to fetch total orders for user
orderRouter.get('/totalOrders', isAuth, expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const totalOrders = await Order.countDocuments({ user: userId });
    res.json({ totalOrders });
 
})
);

//Route to fetch complete order 
orderRouter.get('/completeOrder' , isAuth , expressAsyncHandler(async(req , res)=>{
  const userId = req.user._id;
  const completeOrder = await Order.countDocuments({user : userId , isDelivered : true })
  res.send(completeOrder)
}))


//router placeorder
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if(req.body.orderItems.length === 0){
        res.status(400).send({ message: 'Cart is empty' });
      }
    else{
      const { shippingAddress } = req.body; 
      const { fullName, address, city, postalCode, country } = shippingAddress;
      if (!fullName || !address || !city || !postalCode || !country) {
        res.status(400).send({ message: 'Veuillez fournir une adresse de livraison valide' });
        return;
      }
      const sellers = new Set(req.body.orderItems.map(item => item.seller));
      if (sellers.size > 1) {
        res.status(400).send({ message: 'Un vendeur ne peut pas acheter un produit d\'autre vendeur' });
        return;
      }
      // Créer une nouvelle commande
      const order = new Order({
        seller: req.body.orderItems[0].seller,
        orderItems: req.body.orderItems,
        shippingAddress ,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });

      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: 'Nouvelle commande créée avec succès', order: createdOrder});
    }
  })
);
//router find order
orderRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      
      const order = await Order.findById(req.params.id);
      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message: 'Order not found' });
      }
    })
  );

//Route cash payments  
orderRouter.get('/:id/cashpay', isAuth , expressAsyncHandler(async(req , res)=>{
  const order = await Order.findById(req.params.id)
  if(order && order.isCashPayment){
    res.send({order})
  }
  else{
    res.status(400).send({message : "Order not payed"})
  }
}))

orderRouter.post('/:id/cashpay' , isAuth , expressAsyncHandler(async (req, res)=> {
  const order = await Order.findById(req.params.id);
  if (order ) {
    order.isCashPayment = true;
    const productDetails = `
        <table style="width:90%%; border-collapse: collapse;">
          <thead>
            <tr  style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Produit</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Quantité</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px;">${item.name}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${item.qty}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${item.price} TND</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    let config = {
      service: 'gmail', 
      auth: {
          user: process.env.NODEJS_GMAIL_APP_USER,   
          pass: process.env.NODEJS_GMAIL_APP_PASSWORD
         
      },
    }
    let transporter = nodemailer.createTransport(config);

let message = {
from: 'jarraykais1@gmail.com', 
to:`${req.user.email}`, 
subject: `Succès de la commande`, 
html: ` 
<h1>Confirmation de commande</h1>
<p>Bonjour,</p>
<p>Votre commande a été traitée avec succès.</p>
<h2>Détails de la commande:</h2>
<p><strong>Code de commande:</strong> ${order._id}</p>
<p><strong>Total:</strong> ${order.totalPrice} TND</p>
<p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('fr-TN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Africa/Tunis',
      })}</p>
${productDetails}
<p><strong>Méthode de paiement:</strong>Paiement en espèces</p>
<p>Merci pour votre achat !</p> 

`,
};
transporter.sendMail(message, (error, info) => {
if (error) {
console.error('Erreur lors de l\'envoi de l\'email: ', error);
return res.status(500).json({ msg: "Erreur lors de l'envoi de l'email de confirmation." });
} else {
console.log('Email envoyé: ' + info.response);
}
});
    const updatedOrder = await order.save();
    res.send({ message: 'Order Paid in Cash', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
}));


// routes for Order update by admin
orderRouter.put('/:id' , isAuth , isAdmin , expressAsyncHandler(async(req, res)=>{
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = req.body.isDelivered || order.isDelivered;
    order.packaging = req.body.packaging;
    order.onTheRoadBeforeDelivering = req.body.onTheRoadBeforeDelivering;
    const updatedOrder = await order.save();
    res.send({ message: 'Order status updated', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
}))

//route por modifier shipping-address
orderRouter.put('/:orderId/shipping', isAuth , expressAsyncHandler(async(req , res)=>{
  const orderId = req.params.orderId;
  const { fullName, address, city, postalCode, country } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404).send({ message: 'Order not found' });
  } else if (order.onTheRoadBeforeDelivering || order.isDelivered) {
    res.status(400).send({ message: 'Cannot edit shipping address once the order is on the road for delivery' });
  } else {

  order.shippingAddress = {
    fullName,
    address,
    city,
    postalCode,
    country
  };
  await order.save();

  res.status(200).json({ message: 'Adresse de livraison mise à jour avec succès', order: order });
}
}));


// delete order
orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.deleteOne();
      res.send({ message: 'Order Deleted', order: deleteOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);


export default orderRouter;


