const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Class = require('../models/class');

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

  classInfo.save()
    .then(result => {
      res.status(201).json({
        message: "Handling POST requests to /classes",
        createdClass: {
          name: result.name,
          description: result.description,
          keyword: result.keyword,
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