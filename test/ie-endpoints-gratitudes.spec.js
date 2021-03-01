const knex = require('knex');
const app = require('../src/app');
require('dotenv').config();
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('Gratitude Endpoints', function() {
    let db; 
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
  
describe.only(`GET /api/gratitudes`, () => {
    context(`given no gratitudes `, () => {
        beforeEach('insert users', () => 
        helpers.seedUsers(
            db,
            testUsers
        )
    )
    it(`responds with 200 and an empty list`, () => {
        return supertest(app)
        .get(`/api/gratitudes`)
        .set('Authorization', makeAuthHeader(testUsers[0]))
        .expect(200, [])
        })
    })  
    context(`given there are gratitudes in the db`, () => {
        const testGratitudes = helpers.makeGratitudesArray();
        beforeEach("insert gratitudes", () => {
          return db.into("ie_gratitudes").insert(testGratitudes);
        });    
    it(`responds w 200 and all of the gratitudes`, () => {      
            return supertest(app)
            .get('/api/gratitudes')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(200, testGratitudes) 
        })
    })
})

describe(`POST /api/gratitudes`, () => {
    beforeEach('insert entries', () => 
    helpers.seedUsers(
        db,
        testUsers
    )
)
    
    it(`creates an entry responding w 201 and the new entry`, () => {
        const testUser = testUsers[0]
        const newAppt = {
               content:"The sunset view from my condo",
               user_id:1
            }
            return supertest(app)
            .post('/api/gratitudes/1')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(newAppt)
            .expect(res => {
                expect(res.body.content).to.eql(newGratitude.content)
                expect(res.body.user_id).to.eql(testUser.id)
            })
            .then(res => 
                    supertest(app)
                        .get(`/api/gratitudes/${res.body.id}`)
                        .set('Authorization', makeAuthHeader(testUsers[0]))
                        .expect(res.body)
                        )
        })
    })
});
})//end describe endpoint


       