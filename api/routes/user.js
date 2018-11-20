const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

// Crea un'utente

router.post('/signup', (req, res, next) => {

  User.find({
      email: req.body.email
    }).exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "E-mail already exists!"
        });
      } else {

        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              err: err
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
                  message: "Succesfull POST requests to /users",
                  createdClass: {
                    _id: result.id,
                    email: result.email,
                    password: result.password,
                    request: {
                      type: 'GET',
                      description: 'GET_USER_INFO',
                      url: 'https://worksend.herokuapp.com/users/' + result._id
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