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
    Assignment.find({
        _id: id
      })
      .exec()
      .then(docs => {
        if (docs.length < 1) {
          res.status(404).json({
            message: 'Assignment not found!'
          });
        } else {
          res.status(200).json({
              message: 'Assignment found: '
          })
        }
      });
});

module.exports = router;