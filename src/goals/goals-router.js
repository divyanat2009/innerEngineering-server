const express = require('express');
const xss = require('xss');
const path = require('path');
const GoalsService = require('./goals-service.js');
const { requireAuth } = require('../middleware/jwt-auth.js');

const goalsRouter = express.Router();
const jsonParser = express.json();

goalsRouter
    .route('/:id')
    .get(requireAuth, (req, res, next)=>{
        const knexInstance=req.app.get('db');
        GoalsService.getAllGoalsByUserId(
            knexInstance, req.params.id
        )
        .then(goals=>{           
            res.json(goals)
        })
        .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next)=>{
        //providing user_id default           
        const { emotional=0, physical=0, energy=0, spiritual=0 } = req.body;
        let newgoal = { emotional, physical, energy, spiritual };          
        //checking for null and valid number
        for(const [key,value] of Object.entries(newgoal)){        
            if(value<-1 || value > 11){
              return res.status(400).json({
                error: { message : `${key} must be between 1-10` }
              });
            }
        }//end of for checking for null
        //add user_id
        newgoal = {...newgoal, user_id:req.params.id}
        GoalsService.insertGoals(
            req.app.get('db'),
            newgoal
        )
        .then(goals=>{
            res
                .status(201)
                .json(goals)
        })
        .catch(next)
    })
module.exports = goalsRouter;