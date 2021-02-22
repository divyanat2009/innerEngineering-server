const express = require('express');
const xss = require('xss');
const MoodsService = require('./moods-service.js');
const { requireAuth } = require('../middleware/jwt-auth');
const { id } = require('date-fns/locale');

const moodsRouter = express.Router();
const jsonParser = express.json();


moodsRouter
  .route('/:id')
  .get(requireAuth, (req, res, next)=>{
    const knexInstance= req.app.get('db');
    const user_id= req.params.id;
    MoodsService.getAllMoodsByUser(
       knexInstance, user_id
     )
  .then(moods=>{           
    res.json(moods)
    })
  .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next)=>{   
   const { user_id, mood_level, energy_level } = req.body;
   let newMood = { user_id, mood_level, energy_level }; 
   //checking for null and valid number
   for(const [key,value] of Object.entries(newMood)){
      if(value==null){
        return res.status(400).json({
        error: { message : `Missing '${key}' in request body` }
        });
      }
      if(value<0 || value > 11){
        return res.status(400).json({
        error: { message : `${key} must be between 1-10` }
      });
     }
    }//end of for checking for null

    MoodsService.insertMoods(
      req.app.get('db'),
       newMood
      )
      .then(moods=>{
        res
           .status(201)
           .json(moods)
      })
      .catch(next)
    })
module.exports = moodsRouter;