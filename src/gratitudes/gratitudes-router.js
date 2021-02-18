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
    .route('/')
    .get(requireAuth, (req, res, next)=>{
        const knexInstance=req.app.get('db');
        GratitudesService.getAllEntriesByUserId(
          knexInstance, req.user.id
        )
        .then(gratitudes=>{
           res.json(gratitudes.map(serializedGratitude))
        })
        .catch(next)
    })

    .post(requireAuth, jsonParser, (req, res, next)=>{
        const {content} = req.body;
        const newGratitude = {content}
        if(!content){
            return res.status(400).json({
                error: { message : `Missing content in request body`}
            });
        }
        newGratitude.user_id = req.user.id
        //const numberOfEntries = req.body.length;
        //let newGratitudes = [];
        //for(let i=0; i<numberOfEntries; i++){         
        //    if(req.body[i].content==null){
        //       return res.status(400).json({
        //         error: { message : `Missing content in request body`}
            
        
        //add in the user_id
        //eventually user_id will be part of req.body
        //let newGratitude = {...req.body[i],user_id};
        //newGratitudes = [...newGratitudes, newGratitude]
           
        GratitudesService.insertGratitudes(
            req.app.get('db'),
            newGratitudes
        )
        .then(gratitudes=>{
            res
               .status(201)
               .location(path.posix.join(req.originalUrl + `/${gratitude.id}`))
               .json(serializedGratitude(gratitudes))
        })
        .catch(next)
    });    
       
module.exports = gratitudesRouter;