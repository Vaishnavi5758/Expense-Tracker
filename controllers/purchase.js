const Razorpay = require('razorpay');
const Order =require('../models/order-model');
const userController = require('../controllers/user');
const sequelize = require('../utils/database')
require('dotenv').config();



exports.purchasePremium = async(req, res) =>{
    try{
            var rzp = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET
            })
            console.log('Razorpay id-key object>>>>>>>>>>',rzp);
            const amount =2500;

            rzp.orders.create({amount: amount, currency: "INR"}, async(err, order)=>{
                try{
                    if(err)throw new Error(json.stringify(err));
                    const createdOrder = await  req.user.createOrder({orderid:order.id, status:'PENDING'})
                    console.log('Sequelize createdOrder>>>>>>>>>>>',createdOrder);
                    console.log('Orderid>>>>>>',createdOrder.orderid)
                    return res.status(201).json({orderid: order.id, key_id: rzp.key_id})
                  }catch(err){
                    throw new Error(err)}
                })
                    
                }catch(err){console.log("purchasepremium function error", err)}
    }

    exports.updateTransactionStatus = async (req, res)=>{
            const { payment_id, order_id } = req.body;
            try{
                const order = await Order.findOne({where: {orderid: order_id}})
                const promise1= order.update({paymentid:payment_id, status: 'successful'})
                const promise2= req.user.update({ispremiumuser:true})
                Promise.all([promise1, promise2]).then(() =>{
                    return res.status(202).json({success: true, message: 'Transaction successful'});
                }).catch((err)=>{
                    throw new Error(err);
                })
               
            }catch(err){
                console.log(err);
                res.status(403).json({error: err, message:'Something went wrong in updating transaction'})
            }
        }
            
                

    