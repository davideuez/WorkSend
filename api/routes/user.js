const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Crea un'utente

router.post('/signup', (req, res, next) => {

  User.find({
      email: req.body.email
    }).exec()
    .then(users => {
      if (users.length >= 1) {
        return res.status(409).json({
          message: "E-mail already exists!"
        });
      } else {

        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {

            const userInfo = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });

            userInfo.save()
              .then(result => {
                res.status(201).json({
                  message: "User succesfully created",
                  createdClass: {
                    _id: result.id,
                    email: result.email,
                    password: result.password,
                    request: {
                      type: 'POST',
                      description: 'LOGIN',
                      url: 'https://worksend.herokuapp.com/login'
                    }
                  }
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });

          }
        });
      }
    })
});

// Login e assegnazione JWT

router.post('/login', (req, res, next) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then(users => {
      if (users.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }

      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        if (result) {
          const token = jwt.sign({
              email: users[0].email,
              userId: users[0]._id
            },
            "" + process.env.JWT_KEY, {
              expiresIn: "1h"
            })


          return res.status(200).json({
            message: 'Auth successfull',
            token: token
          });
        }
        return res.status(401).json({
          message: 'Auth failed'
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Elimina un'utente dal database

router.delete('/:userId', (req, res, next) => {

  User.remove({
      _id: req.params.userId
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User successfully deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;