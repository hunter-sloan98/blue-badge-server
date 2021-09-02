const router = require('express').Router(); //Importing Express framework
const { UserModel } = require('../models')  //Importing UserModel to use in our creation endpoint
const { UniqueConstraintError } = require('sequelize/lib/errors') //Fixes errors caused by duplicate unique objects
const jwt = require('jsonwebtoken'); //Brings in the jwt package
const bcrypt = require('bcryptjs'); //Brings in the bcrypt package

//Signup

router.post('/signup', async (req, res) => {
  let{ email, password } = req.body;
  try {
    let User = await UserModel.create({
      email,
      password: bcrypt.hashSync(password, 5)
    });

    let token = jwt.sign({id:User.id}, process.env.JWT_SECRET, {expiresIn: '1d'});//The token variable

    res.status(201).json({
      message: "User Created",
      user: User,
      sessionToken: `Bearer ${token}`
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Please Choose Another email"
      });
    } else {
      res.status(500).json({
        message: 'Signup failed'
      });
    }
  }
});

//Login

router.post('/login', async (req, res) => {
  let { email, password } = req.body;
  try{
    let loginUser = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if(loginUser) {
      let passwordComparison = await bcrypt.compare(password, loginUser.password);

      if(passwordComparison){
        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.status(200).json({
          message: "User Authenticated",
          sessionToken: `Bearer ${token}`
        });
      } else {
        res.status(401).json({
          message: "Incorrect email or password"
        });
      }
    } else {
      res.status(401).json({
        message: "Incorrect email or password"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Login Failed"
    })
  }
});

module.exports = router;