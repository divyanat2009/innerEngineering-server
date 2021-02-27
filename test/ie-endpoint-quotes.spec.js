const knex = require('knex');
const app = require('../src/app');
const { makeQuotesArray } = require('./quotes.fixtures.js');
require('dotenv').config();

describe(`ie endpoint /api/quotes`,()=>{
    let db;
    before('make knex instance',()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
          });
          app.set('db', db)
    });
    

    describe(`GET /api/quotes`,()=>{
        context(`Given no quotes`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                .get('/api/quotes')
                .expect(200,[])
            })
        })//end context no quotes

        context(`Given quotes in the db`,()=>{            
            const testquotes = makeQuotesArray();        

            it(`responds with all quotes`,()=>{
                return supertest(app)
                    .get('/api/quotes')
                    .expect(200, testquotes)
            })//end it with quotes in db
        })//end context quotes in db       
    })//end describe GET

})//end of describe endpoint /quotes