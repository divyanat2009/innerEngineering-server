const knex = require('knex');
const app = require('../src/app');
const { makeUsersArray } = require('./users.fixtures.js');
const { makeQuotesArray } = require('./quotes.fixtures.js');
const { token } = require('morgan');
require('dotenv').config();

describe(`Quotes endpoint /api/quotes`,()=>{
    let db;
    before('make knex instance',()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
          });
          app.set('db', db)
    });

    after(`disconnect from db`,()=>db.destroy());
    before('clean the table', () => db.raw('TRUNCATE ie_quotes, ie_users RESTART IDENTITY CASCADE'));
    afterEach('cleanup',() => db.raw('TRUNCATE ie_quotes, ie_users RESTART IDENTITY CASCADE'))

    context(`/api/quotes/8`, () => {
        
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjgsImlhdCI6MTYxNDcwNDIxMCwic3ViIjoiam9uZG9lMSJ9.DqlOHgs4C8AUgxhoPDf8dHr1xXZRbpvfW7-ko9WUrtQ"
        it(`GET/api/quotes/8, should respond with 200 and a list of quotes`, () => {
          global.supertest(app)
            .get('/api/quotes/8')
            .set('Authorization', `bearer ${token}` )
            .expect(200,[
                {
                    id: 4,
                    content: 'My religion is very simple. My religion is kindness.',
                    author: 'Dalai Lama',
                    key_search_words: null
                  },
                  {
                    id: 5,
                    content: 'When you practice gratefulness, there is a sense of respect toward others.',
                    author: 'Dalai Lama',
                    key_search_words: null
                  }
            ]);       
          
        });
         
        it(`POST /api/quotes/8`, () => {
          global.supertest(app)
              .post('/api/quotes/8')
              .set('Authorization', `bearer ${token}`)
              .send( 
                {
                    id: 4,
                    content: 'My religion is very simple. My religion is kindness.',
                    author: 'Dalai Lama',
                    key_search_words: null
                  },
                  {
                    id: 5,
                    content: 'When you practice gratefulness, there is a sense of respect toward others.',
                    author: 'Dalai Lama',
                    key_search_words: null
                  } 
                   )
              .expect(201, 
                  {
                    id: 4,
                    content: 'My religion is very simple. My religion is kindness.',
                    author: 'Dalai Lama',
                    key_search_words: null
                  },
                  {
                    id: 5,
                    content: 'When you practice gratefulness, there is a sense of respect toward others.',
                    author: 'Dalai Lama',
                    key_search_words: null
                  }
                  );
              });
        });    


});