const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
  google
} = require('googleapis');

const Class = require('../models/class');
const User = require('../models/user')
const userClass = require('../models/userClass');

const driveAPI = require('../../googleApi')

// Ritorna l'intera lista di classi presenti

router.get('/', (req, res, next) => {
  Class.find()
    .select('name description keyword _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        classes: docs.map(doc => {
          return {
            name: doc.name,
            description: doc.description,
            keyword: doc.keyword,
            _id: doc._id,
            request: {
              type: 'GET',
              description: 'GET_SINGLE_CLASS_BY_ID',
              url: 'https://worksend.herokuapp.com/classes/' + doc._id
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

router.post('/', (req, res, next) => {

  const classInfo = new Class({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    keyword: req.body.keyword
  });

  const userClassInfo = new userClass({
    _id: new mongoose.Types.ObjectId(),
    classId: classInfo._id,
    user_email: req.body.email,
    role: 'Professor'
  });

  User.find({
      email: userClassInfo.user_email
    })
    .exec()
    .then(users => {
      if (users.length < 1) {
        return res.status(404).json({
          message: 'User email not found'
        });
      } else {
        classInfo.save()
          .then(result => {

            userClassInfo.save()
              .then()
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });

            driveAPI.classFolder();

            res.status(201).json({
              message: "Handling POST requests to /classes",
              createdClass: {
                name: result.name,
                description: result.description,
                keyword: result.keyword,
                professor: userClassInfo.user_email,
                _id: result._id,
                request: {
                  type: 'GET',
                  description: 'GET_CLASS_INFO',
                  url: 'https://worksend.herokuapp.com/classes/' + result._id
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

router.post('/join/:classId', (req, res, next) => {
  const id = req.params.classId;
  const key = req.body.keyword;

  const userClassInfo = new userClass({
    _id: new mongoose.Types.ObjectId(),
    classId: id,
    user_email: req.body.email,
    role: 'Student'
  });

  User.find({
      email: userClassInfo.user_email
    })
    .exec()
    .then(users => {
      if (users.length < 1) {
        return res.status(404).json({
          message: 'User email not found'
        });
      } else {
        Class.findById(id)
          .select('name keyword _id')
          .exec()
          .then(doc => {
            if (doc) {
              if (doc.keyword == key) {

                userClassInfo.save()
                  .then()
                  .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      error: err
                    });
                  });

                res.status(200).json({
                  message: 'You join successfully the class',
                  class: doc,
                  request: {
                    type: 'GET',
                    description: 'GET_ALL_CLASSES',
                    url: 'https://worksend.herokuapp.com/classes'
                  }
                });
              } else {
                res.status(401).json({
                  message: 'Wrong key entered'
                });
              }
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


// Modifica la classe tramite l'id passato come parametro

router.patch('/:classId', (req, res, next) => {
  const id = req.params.classId
  const updateOps = {}

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Class.update({
      _id: id
    }, {
      $set: updateOps
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Classe aggiornata con successo',
        request: {
          type: 'GET',
          description: 'GET_MODIFIED_CLASS',
          url: 'https://worksend.herokuapp.com/classes/' + id
        }
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