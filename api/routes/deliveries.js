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
  Assignment.findById(id)
    .select('_id title description deadline url')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          message: "Delivery created"
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

//Returns all the URLs of all deliveries of a specific assignment

router.get('/:assignmentId/all', (req, res, next) => {
  const id = req.params.assignmentId;
  Assignment.findById(id)
    .select('_id title description deadline url')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          class: doc,
          request: {
            type: 'GET',
            description: 'GET_ALL_DELIVERIES',
            url: 'https://worksend.herokuapp.com/assignments'
          }
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


router.delete('/:assignmentId', (req, res, next) => {

  Delivery.remove({
      _id: req.params.userId
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

module.exports = router;