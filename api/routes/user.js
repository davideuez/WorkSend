const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

// Ritorna l'intera lista di utenti

router.get('/', (req, res, next) => {
  User.find()
    .select('_id email')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            _id: doc._id,
            email: doc.email,
            request: {
              type: 'GET',
              description: 'GET_ALL_USERS',
              url: 'https://worksend.herokuapp.com/users/'
            }
          }
        })
      }
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Crea una classe

router.post('/signup', (req, res, next) => {

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

});

// Ritorna la classe con l'id passato come parametro

router.get('/:classId', (req, res, next) => {
  const id = req.params.classId;
  Class.findById(id)
    .select('name description keyword _id')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          class: doc,
          request: {
            type: 'GET',
            description: 'GET_ALL_CLASSES',
            url: 'https://worksend.herokuapp.com/classes'
          }
        });
      } else
        res.status(404).json({
          message: 'Non ho trovato una classe con questo id'
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

});

// Elimina la classe in base all' id passato come parametro

router.delete('/:classId', (req, res, next) => {
  const id = req.params.classId
  Class.remove({
      _id: id
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Classe cancellata con successo'
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