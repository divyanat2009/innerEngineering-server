const knex = require('knex');
const app = require('../src/app');
require('dotenv').config();
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('Gratitude Endpoints', function() {
    let db; 
    const { testUsers, testGratitudes } = helpers.makeFixtures()

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
            name: 'GET /api/gratitudes/:id',
            path: '/api/gratitudes/1'
        },
        {
            name:'POST /api/gratitudes/:id',
            path: '/api/gratitudes/1'
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
  context(`/api/gratitudes/:id`, () => {
    const testUser = testUsers[0];
     it(`should respond with 200 and a list of gratitudes`, () => {
       return supertest(app)
          .get('/api/gratitudes/1')
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(200, [
                {                
                  user_id:testUser.id,
                  content:"A catch up phone call with mom",
                  date_modified:"January 7th 2021"           
                 },
                 {                  
                  user_id:testUser.id,
                  content:"Passing the tests",
                  date_modified:"January 7th 2021" 
                 },
                 {            
                  user_id:testUser.id,
                  content:"Sunset view from my condo",
                  date_modified:"January 7th 2021" 
                 }
                ]
            );
            })          
              
            it(`POST /api/gratitudes/1`, () => {
                return supertest(app)
                  .post('/api/gratitudes/1')
                  .set('Authorization', makeAuthHeader(testUsers[0]))
                  .send({ 
                    user_id:"1",
                    content:"pilates workout",
                    date_modified:"January 27th 2021",                    
                   })
                  .expect(201, 
                    {                    
                      user_id:"1",
                      content:"pilates workout",
                      date_modified:"January 27th 2021"                        
                    }
                  );
             });
        });   
    });
})//end describe endpoint


       