import express from 'express';
import expressAsyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { generateToken, isAuth, isAdmin, baseUrl } from '../utils.js';
import User from '../models/userModel.js';
import { upload } from './uploadRouter.js';
import fs from 'fs';
import nodemailer from 'nodemailer';

const userRouter = express.Router();
userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

// routes admin get all users
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const users = await User.find({}).skip(startIndex)
    .limit(limit);
    res.send(users);
  })
);
userRouter.get(
  '/top-sellers',
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .sort({ 'seller.rating': -1 })
      .limit(3);
    res.send(topSellers);
  })
);

userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);


//Signup users Routes
userRouter.post('/signup',upload.single('profilePicture') , expressAsyncHandler(async (req, res) => {
  const { name, email, password, telephone , Country} = req.body;
  const profilePicture = req.file ? req.file.path : null;
  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
  }
      // Créer un nouveau utilisateur avec le chemin de l'image de profil
      const user = new User({
          name,
          email,
          password: bcrypt.hashSync(password, 8),
          profilePicture,
          telephone,
          Country ,
      });
      // Enregistrez le nouvel utilisateur dans la base de données
      const createdUser = await user.save();
      res.status(201).json(createdUser);
}));

// Route for seller signup
userRouter.post('/sellerSignup' , 
upload.fields([{ name: 'profilePicture'}, { name: 'logo' }]),
 expressAsyncHandler(async (req, res) => {
  const { name, email, password , telephone , sellerName , sellerAdresse, description , Country } = req.body;
  const profilePicture = req.files['profilePicture'][0].path // Chemin de l'image téléchargée
  const logo = req.files['logo'][0].path 
  // Check if the user already exists

  const existingUser = await User.findOne({ $or: [
    { email },
    { name: req.body.name }, 
  ]});
  if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
  }
  
  // Create a new user
  const seller = new User({
      name : name  ,
      email ,
      password :bcrypt.hashSync(password , 8),
      profilePicture ,
      Country, 
      telephone ,
      isAdmin: false,
      isSeller: true,
      seller: {
        nameBrand: sellerName,
        adresse: sellerAdresse, 
        logo ,
        description,
        rating: 0 ,
        numReviews: 0,
    }
  });
  console.log(seller)
  // Save the user to the database
  const createdUser = await seller.save();
  res.status(201).json(createdUser);
}));


// Route for user signin
userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
 
    // Check if user exists and if the password is correct
    if (user &&  (bcrypt.compareSync(req.body.password, user.password))) {
        const token = generateToken(user); // Générer le token JWT
 
        // Enregistrez le token JWT dans un cookie nommé 'token'
        res.cookie('token', token, { 
            httpOnly: true, // Empêche JavaScript côté client d'accéder au cookie
            maxAge: 43200000 // Durée de validité du cookie en millisecondes (12 heures)
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture : user.profilePicture,
            telephone : user.telephone ,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
            token: token
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
}));

//forgot Password
userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email  });
    
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      
      user.resetToken = token;
      await user.save();
    
      let config = {
        service: 'gmail', // your email domain
        auth: {
            user: process.env.NODEJS_GMAIL_APP_USER,   // your email address
            pass: process.env.NODEJS_GMAIL_APP_PASSWORD // your password
        },
      }
      
      let transporter = nodemailer.createTransport(config);

      let message = {
        from: 'jarraykais1@gmail.com', // sender address
        to:`${user.email}`, // list of receivers
        subject: `Reset Password`, // Subject line
        html: ` 
        <p>Please Click the following link to reset your password:</p> 
        <a href="${baseUrl()}/reset-password/${token}"}> Reset Password</a>
        `,
    };
    transporter.sendMail(message).then((info) => {
      return res.status(200).json(
          {
              msg: "We sent reset password link to your email.",
          }
      )
        })
      } else {
        res.status(404).send({ message: 'User not found' });
      }

  })
)

//reset password
userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.headers.token, process.env.JWT_SECRET || 'somethingsecret',async (err, decode) => {
      if (err) {
        console.log('first')
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        const user = await User.findOne({ resetToken: req.headers.token });
        console.log( req.headers.token)
        if (user) {
          if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();
            res.send({
              message: 'Password reseted successfully',
            });
          }
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      }
    });
  })
);




userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.profilePicture = req.body.profilePicture || user.profilePicture ;
      user.telephone = req.body.telephone || user.telephone ;
      if (user.isSeller) {
        user.seller.nameBrand = req.body.sellerName || user.seller.nameBrand;
        user.seller.logo = req.body.sellerLogo
        user.seller.description = req.body.sellerDescription || user.seller.description;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture : updatedUser.profilePicture,
        telephone :updatedUser.telephone,
        isAdmin: updatedUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(updatedUser),
      });

    }
  })
);


//Route admin update users
userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name === user.name ? user.name : req.body.name;
      user.email = req.body.email === user.email ? user.email : req.body.email;
      user.isSeller = Boolean(req.body.isSeller)
      user.isAdmin = Boolean(req.body.isAdmin)
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);


// delete users
userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (user) {
      // Vérifiez si l'utilisateur est admin
    if (user.isAdmin && req.user.isAdmin) {
      return res.status(403).send({ message: "Admin users cannot be deleted by other admin users" });
    }

      const deletedUser = await user.deleteOne();
      if (user.profilePicture) {
        // Suppression de l'image de profil du dossier de stockage
        fs.unlinkSync(user.profilePicture);
    }
    if (user.seller.logo) {
      fs.unlinkSync(user.seller.logo);
    }
      res.status(200).send({ message: 'User deleted successfully', user: deletedUser });
    } else {
      // Si l'utilisateur n'existe pas, renvoyez une erreur 404
      res.status(404).send({ message: 'User not found' });
    }
  })
);

export default userRouter