const express = require('express');
const xss = require('xss');
const path = require('path');
const SelfCaresService = require('./selfcares-service.js');
const {requireAuth} = require('../middleware/jwt-auth');

const selfcaresRouter = express.Router();
const jsonParser = express.json();

const serializedSelfCare = selfcare =>({
    id:selfcare.id,
    user_id:selfcare.user_id,
    content:selfcare.content,
    type:selfcare.type,
    rating:selfcare.rating,
    date_modified:selfcare.date_modified
});

selfcaresRouter
    .route('/:id')
    .get(requireAuth, (req, res, next)=>{
        const user_id= req.params.id;
        SelfCaresService.getAllSelcaresByUserId(
             req.app.get('db'),
             user_id
           )
        .then(selfcares=>{
          if(selfcares.length===0){
            return res.status(404).json({
              error: {message: `Selfcares with that username or id do not exist`}
            });
          }                
          res.json(selfcares.map(serializedSelfCare)) 
        })
        .catch(next)
    })  
      
    .post(requireAuth, jsonParser, (req, res, next)=>{      
        const {user_id, content, type, rating} = req.body;
        let newSelfcare={ user_id, content, type, rating };
                
        if(!content){
          return res.status(400).json({
            error: { message : `Missing content in request body`}
        });
        }        
        SelfCaresService.insertSelfCares(
            req.app.get('db'),
            newSelfcare
        )
        .then(selfcares=>{          
            res
               .status(201)                            
               .json(serializedSelfCare(selfcares[0]))
        })
        .catch(next)
    }); 

module.exports = selfcaresRouter;