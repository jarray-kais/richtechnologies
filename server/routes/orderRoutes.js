import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/OrderModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';

const orderRouter =express.Router()


//router checkout
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if(req.body.orderItems.length === 0){
        res.status(400).send({ message: 'Cart is empty' });
      }
    else{
      const { shippingAddress } = req.body; // Destructure shippingAddress from req.body
      // Valider les données de la requête
      const { fullName, address, city, postalCode, country } = shippingAddress;
      if (!fullName || !address || !city || !postalCode || !country) {
        res.status(400).send({ message: 'Veuillez fournir une adresse de livraison valide' });
        return;
      }
       //Vérifier si un vendeur ne peut pas acheter un produit d'autre vendeur
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

orderRouter.get(
  '/mine',
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
  // Enregistrer les modifications dans la base de données
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


