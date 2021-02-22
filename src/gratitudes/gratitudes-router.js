const express = require('express');
const xss = require('xss');
const path = require('path');
const GratitudesService = require('./gratitudes-service.js');
const { requireAuth } = require('../middleware/jwt-auth');

const gratitudesRouter = express.Router()
const jsonParser = express.json();

const serializedGratitude = gratitude =>({
    id:gratitude.id,
    user_id:gratitude.user_id,
    content:xss(gratitude.content),
    date_modified:gratitude.date_modified,
});

gratitudesRouter
    .route('/:id')
    .get(requireAuth, (req, res, next)=>{
        const user_id= req.params.id;
        GratitudesService.getAllEntriesByUserId(
             req.app.get('db'),
             user_id
           )
        .then(gratitudes=>{
          if(gratitudes.length===0){
            return res.status(404).json({
              error: {message: `Gratitudes with that username or id do not exist`}
            });
          }                
          res.json(gratitudes.map(serializedGratitude)) 
        })
        .catch(next)
    })  
      
    .post(requireAuth, jsonParser, (req, res, next)=>{      
        const {user_id, content} = req.body;
        let newGratitude={ user_id, content };
        console.log(req.body);              
        if(!content){
          return res.status(400).json({
            error: { message : `Missing content in request body`}
        });
        }        
        GratitudesService.insertGratitudes(
            req.app.get('db'),
            newGratitude
        )
        .then(gratitudes=>{
          console.log(gratitudes);
            res
               .status(201)   
               .location(path.posix.join(req.originalUrl + `/${gratitudes.id}`))            
               .json(serializedGratitude(gratitudes))
        })
        .catch(next)
    });    
       
module.exports = gratitudesRouter;