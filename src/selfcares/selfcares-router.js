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
    content:xss(selfcare.content),
    type:selfcare.type,
    rating:selfcare.rating,
    date_modified:selfcare.date_modified
});

selfcaresRouter
    .route('/:id')
    .get(requireAuth, (req, res, next)=>{
        const knexInstance=req.app.get('db');
        SelfCaresService.getAllSelcaresByUserId(
            knexInstance, req.params.id
        )
        .then(selfcares=>{           
            res.json(selfcares.map(serializedSelfCare))
        })
        .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next)=>{
        const {content, type, rating} = req.body;
        let newSelfCare = {content, type, rating};
        //const newSelfCare={user_id: req.params.id, content:content, type:type, rating:rating}
        for(const [key,value] of Object.entries(newSelfCare)){
            if(value==null){
                return res.status(400).json({
                    error: { message : `Missing '${key}' in request body` }
            });
        }

    }
        //providing user_id default
        /*const numberOfEntries = req.body.length;
        const validTypes = ['emotional', 'spiritual', 'physical','energy'];

        let newSelfCares = [];
        for(let i=0; i<numberOfEntries; i++){
            let { content, type, rating } = req.body[i];
            let newSelfCare = { content, type, rating };
            //checking for null
            for(const [key,value] of Object.entries(newSelfCare)){
                if(value==null){
                    return res.status(400).json({
                        error: { message : `Missing '${key}' in request body` }
                });
            }
        }//end of for checking for null

            //checking for valid types and ratings
        if(type){
           if(!validTypes.includes(type)){
              return res.status(400).json({
                error: { message : `Type must be physical, energy, spiritual, emotional` }
              });
            }
        }
        if(rating){
           if(rating<0 || rating > 11){
              return res.status(400).json({
                error: { message : `Rating must be between 1-10` }
            });
          }
        }
        //add user_id, eventually will be part of req.body
        newSelfCare = {...req.body[i], user_id};
        newSelfCares = [...newSelfCares, newSelfCare];

        };//end for create newSelfCares array*/
        newSelfCare={...newSelfCare, user_id:req.params.id}
        SelfCaresService.insertSelfCares(
            req.app.get('db'),
            newSelfCare
        )
        .then(selfcares=>{
            res
               .status(201)
               .json(serializedSelfCare(selfcares))
        })
        .catch(next)
    });

module.exports = selfcaresRouter;