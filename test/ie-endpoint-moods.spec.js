const knex = require('knex');
const app = require('../src/app');
require('dotenv').config();
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('Moods Endpoints', function() {
    let db 
    const { testUsers} = helpers.makeFixtures()

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
            name: 'GET /api/moods/:id',
            path: '/api/moods/1'
        },
        {
            name:'POST /api/moods/:id',
            path: '/api/moods/1'
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
    
      context(`/api/moods/:id`, () => {
        const testUser = testUsers[0];
        it(`should respond with 200 and a list of moods`, () => {
          return supertest(app)
            .get('/api/moods/1')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(200, [
                {
                user_id:testUser.id,
                mood_level:"4",
                energy_level:"5",
                }
              ])
            })        
            it(`POST /api/moods/1`, () => {
                return supertest(app)
                  .post('/api/moods/1')
                  .set('Authorization', makeAuthHeader(testUsers[0]))
                  .send({ 
                    moods:{                        
                        user_id:testUser.id,
                        mood_level:"4",
                        energy_level:"5",                     
                    } 
                   })
                  .expect(201, 
                    {                    
                        user_id:testUser.id,
                        mood_level:"4",
                        energy_level:"5"
                    }
                  );
             });
        });   
      });
})//end of describe /moods endpoint