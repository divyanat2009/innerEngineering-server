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
        const knexInstance=req.app.get('db');
        GratitudesService.getAllEntriesByUserId(
          knexInstance, req.params.id
        )
        .then(gratitudes=>{
           res.json(gratitudes.map(serializedGratitude))
        })
        .catch(next)
    })

    .post(requireAuth, jsonParser, (req, res, next)=>{
        const {content} = req.body;
        console.log(req.body);              
        if(!content){
          return res.status(400).json({
            error: { message : `Missing content in request body`}
        });
        }        
        let newGratitude={ content }
        console.log(newGratitude);
        // //const numberOfEntries = req.body.length;
        // //let newGratitudes = [];
        // for(let i=0; i<numberOfEntries; i++){         
        //     if(req.body[i].content==null){
        //       return res.status(400).json({
        //         error: { message : `Missing content in request body`}
        //       });
        //     }  
        // //add in the user_id
        //  let newGratitude = {...req.body[i],user_id:req.params.id};
        //         newGratitudes = [...newGratitudes, newGratitude]
        //         console.log(newGratitudes);

        //add user
        newGratitude = {...newGratitude, user_id:req.params.id }
        GratitudesService.insertGratitudes(
            req.app.get('db'),
            newGratitude
        )
        .then(gratitudes=>{
          console.log(gratitudes);
            res
               .status(201)               
               .json(serializedGratitude(gratitudes))
        })
        .catch(next)
    });    
       
module.exports = gratitudesRouter;