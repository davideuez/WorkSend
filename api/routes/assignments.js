const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Assignment = require('../models/assignment');


// Ritorna l'intera lista di assignments presenti

router.get('/', (req, res, next) => {
  Assignment.find()
    .select('_id title description deadline url')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        assignments: docs.map(doc => {
          return {
            id: doc._id,
            title: doc.title,
            description: doc.description,
            deadline: doc.deadline,
            url: doc.url,
            request: {
              type: 'GET',
              description: 'GET_SINGLE_ASSIGNMENT_BY_ID',
              url: 'https://worksend.herokuapp.com/assignments/' + doc._id
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

// Crea un' assignment

router.post('/:class_Id', (req, res, next) => {

  const assignmentInfo = new Assignment({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    deadline: new Date(req.body.deadline),
    url: req.body.url,
    classId: req.params.class_Id
  });

  assignmentInfo.save()
    .then(result => {
      res.status(201).json({
        message: "Successfully added the assignment " + result.title,
        createdClass: {
          title: result.title,
          description: result.description,
          deadline: result.deadline,
          url: result.url,
          _id: result._id,
          request: {
            type: 'GET',
            description: 'GET_ASSIGNMENT_INFO',
            url: 'https://worksend.herokuapp.com/assignments/' + result._id
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

// Ritorna l' assignment con l'id passato come parametro

router.get('/:assignmentId', (req, res, next) => {
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
            description: 'GET_ALL_ASSIGNMENTS',
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

//Returns all assignments of a specific class

router.get('/:classId/all', (req, res, next) => {
  const id = req.params.classId;
  Assignment.find({
    classId: id
  })
    .select('_id title description deadline url')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          class: doc,
          request: {
            type: 'GET',
            description: 'GET_ALL_ASSIGNMENTS',
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


// Modifica l'assignment tramite l'id passato come parametro

router.patch('/:assignmentId', (req, res, next) => {
  const id = req.params.assignmentId
  const updateOps = {}

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Assignment.update({
      _id: id
    }, {
      $set: updateOps
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Assignment successfully updated',
        request: {
          type: 'GET',
          description: 'GET_MODIFIED_ASSIGNMENT',
          url: 'https://worksend.herokuapp.com/assignments/' + id
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

router.delete('/:assignmentId', (req, res, next) => {
  const id = req.params.assignmentId
  Assignment.remove({
      _id: id
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Assignment successfully deleted'
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