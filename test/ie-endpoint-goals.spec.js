const knex = require('knex');
const app = require('../src/app');
require('dotenv').config();
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('Goals Endpoints', function() {
    let db 
    const { testUsers } = helpers.makeFixtures()

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign(
        { user_id: user.id },
         secret,
        { subject: user.username,
          algorithm: 'HS256', }
        )
       return `Bearer ${token}`
    }

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
      })      

describe(`Protected Endpoints`, () => {
    const protectedEndpoints = [      
        {
            name: 'GET /api/goals/:id',
            path: '/api/goals/1'
        },
        {
            name:'POST /api/goals/:id',
            path: '/api/goals/1'
        },
      
    ]
    protectedEndpoints.forEach(endpoint => { 
    describe(endpoint.name, () => {
        it(`responds w 401 'missing bearer token when no basic token`,() => {
            return supertest(app)
                .get(endpoint.path)
                .expect(401, { error: `Missing bearer token` })   
        })
        it(`responds 401 'unauthorized request' when invalid JWT secret`, () => {
            const validUser = testUsers[0]
            const invalidSecret = 'bad-secret'
            return supertest(app)
                .get(endpoint.path)
                .set('Authorization', makeAuthHeader(validUser, invalidSecret))
                .expect(401, { error: `Unauthorized request` })
        })
         it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
             const invalidUser = { username: 'user-not-existy', id: 1 }
             return supertest(app)
                   .get(endpoint.path)
                   .set('Authorization', makeAuthHeader(invalidUser))
                   .expect(401, { error: `Unauthorized request` })
         })
    })
})

context(`/api/goals/8`, () => {
    const testUser = testUsers[0];
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjgsImlhdCI6MTYxNDcwNDIxMCwic3ViIjoiam9uZG9lMSJ9.DqlOHgs4C8AUgxhoPDf8dHr1xXZRbpvfW7-ko9WUrtQ"
    it(`should respond with 200 and a list of goals`, () => {
      global.supertest(app)
        .get('/api/goals/8')
        .set('Authorization', `bearer ${token}` )
        .expect(200,[
          {                    
            emotional: "4",
            spiritual:"7",
            physical:"5",
            energy:"7"                     
          }
        ]);       
      
    })
     
    it(`POST /api/goals/8`, () => {
        global.supertest(app)
          .post('/api/goals/8')
          .set('Authorization', `bearer ${token}`)
          .send({ 
               emotional: "4",
               spiritual:"7",
               physical:"5",
               energy:"7"              
               })
          .expect(201, 
                {   
                    emotional: "4",
                    spiritual:"7",
                    physical:"5",
                    energy:"7"                   
                                
                }
              );
          });
        });

  });
})//end of describe /goal endpoint