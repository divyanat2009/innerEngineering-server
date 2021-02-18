const express = require('express');
const xss = require('xss');
const MoodsService = require('./moods-service.js');
const { requireAuth } = require('../middleware/jwt-auth');
const { id } = require('date-fns/locale');

const moodsRouter = express.Router();
const jsonParser = express.json();

const serializedMoods = moods =>({
  id:moods.id,
  user_id:moods.user_id,
});

moodsRouter
  .route('/:id')
  .get(requireAuth, (req, res, next)=>{
    const knexInstance= req.app.get('db');
    MoodsService.getAllMoodsByUser(
       knexInstance, req.params.id
     )
  .then(moods=>{           
    res.json(moods)
    })
  .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next)=>{
   //providing user_id default
   const { mood_level, energy_level } = req.body;
   let newMood = { mood_level, energy_level }; 
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

    //add user_id
    newMood.user_id=req.params.id;

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