const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
  google
} = require('googleapis');

const Delivery = require('../models/delivery');
const Assignment = require('../models/assignment');

const driveAPI = require('../../googleApi')

// Crea una delivery

router.post('/:assignmentId', (req, res, next) => {

  const id = req.params.assignmentId;

  const deliveryInfo = new Delivery({
    _id: new mongoose.Types.ObjectId(),
    url: req.body.url,
    assignmentId: id
  });

  Assignment.findById(id)
    .select('_id title description deadline url')
    .exec()
    .then(doc => {
      if (doc) {
        deliveryInfo.save()
          .then(result => {
            res.status(201).json({
              message: "Successfully created the delivery ",
              createdDelivery: {
                url: result.url,
                assignmentId: result.assignmentId,
              }
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      } else
        res.status(404).json({
          message: "I can't find an assignment with this id: " + id
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Ritorna tutti URLs di tutti deliveries di uno specifico assignment

router.get('/:assignmentId/all', (req, res, next) => {
  const id = req.params.assignmentId;

  Assignment.findById(id)
    .select('_id title description deadline url')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          class: doc
        });
      } else
        res.status(404).json({
          message: "I can't find an assignment with this id: " + id
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

});


router.delete('/:deliveryId', (req, res, next) => {

  Delivery.remove({
      _id: req.params.deliveryId
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Delivery successfully deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Ritorna una singola delivery

router.get('/:deliveryId', (req, res, next) => {
  const id = req.params.deliveryId;

  Delivery.findById(id)
    .select('_id url assignmentId')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          class: doc
        });
      } else
        res.status(404).json({
          message: "I can't find a delivery with this id: " + id
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