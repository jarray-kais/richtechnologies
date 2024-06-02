import express from 'express';
import axios from 'axios';
import Order from '../models/OrderModel.js';
import { isAuth } from '../utils.js';



const FlouciRouter = express.Router()

FlouciRouter.post('/payment/:id' ,isAuth , async(req, res)=>{
    const url = "https://developers.flouci.com/api/generate_payment"
    const id = req.params.id
    const {totalPrice} = req.body 
    console.log(id)

    if (!totalPrice || isNaN(totalPrice)) {
        return res.status(400).json({ message: 'Le montant total est requis et doit être un nombre.' });
    }
    const payload = {
    "app_token": process.env.FLOUCI_JETON_PUBLIC, 
    "app_secret": process.env.FLOUCI_JETON_PRIVE,
    "amount": totalPrice * 100,
    "accept_card": "true",
    "session_timeout_secs": 1200,
    "success_link": "http://localhost:5000/success",
    "fail_link": "http://localhost:5000/fail",
    "developer_tracking_id": "5faa840a-a0ff-4aaa-af14-9e240c05b792"
    }
    try {
        const result = await axios.post(url, payload);
        res.send(result.data)
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la génération du paiement');
    }
});

FlouciRouter.post('/verify/:id/:payment_id',isAuth,async(req,res)=>{
    const id = req.params.id
    const payment_id = req.params.payment_id
    const url = `https://developers.flouci.com/api/verify_payment/${payment_id}`
    try {
        const result = await axios.get(url , {
            headers : {
                'Content-Type': 'application/json' , 
                'apppublic':process.env.FLOUCI_JETON_PUBLIC ,
                'appsecret': process.env.FLOUCI_JETON_PRIVE
            }
        })
        if(result.data.result.status){
            const order = await Order.findById(id);
            if(order){
                order.isPaid = true ,
                order.paidAt = Date.now()
                const updatedOrder = await order.save()
                console.log('Payment success details:', result.data);
                return res.send({massage : 'payment reussit' , order : updatedOrder}) 
                
            }
            else {
                return res.status(400).json({message : 'commande non trouvée'})
            }
        
           }
           else {
            console.log('Payment failure details:', result.data);
            return res.status(400).json({ message: 'Échec du paiement' });
        }
        
    } catch (error) {
        

        res.status(400).json({msg : 'la commande  n\'est pas encore payée'})
    }
    
})

export default FlouciRouter