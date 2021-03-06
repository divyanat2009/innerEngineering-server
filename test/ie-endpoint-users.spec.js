const knex = require('knex');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const helpers = require('./test-helpers');


describe('Users Endpoints', function() {
  let db;
  const { testUsers } = helpers.makeFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db)
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert ie_users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )
      const requiredFields = ['fullname', 'username', 'password'];
      requiredFields.forEach(field => {
      const registerAttemptBody = {
        fullname: 'test fullname',
        username: 'test username',      
        password: 'test password',
      };

    it(`responds with 400 required error when '${field}' is missing`, () => {
      delete registerAttemptBody[field]
      return supertest(app)
        .post('/api/users')
        .send(registerAttemptBody)
        .expect(400, {
          error: `Missing '${field}' in request body`,
        });
    });
})
    it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
      const userShortPassword = {
        fullname: 'test fullname',
        username: 'test user_name',        
        password: '1234567'
      };
      return supertest(app)
        .post('/api/users')
        .send(userShortPassword)
        .expect(400, { error: `Password be longer than 8 characters` })
      });
    it(`responds 400 'Password be less than 72 characters' when long password`, () => {
      const userLongPassword = {
        fullname: 'test fullname',
        username: 'test username',
        password: '*'.repeat(73)
        
      };
      return supertest(app)
          .post('/api/users')
            .send(userLongPassword)
            .expect(400, { error: `Password be less than 72 characters` })
      });
    it(`responds 400 error when password starts with spaces`, () => {
          const userPasswordStartsSpaces = {
            fullname: 'test fullname',
            username: 'test username',          
            password: ' 1Aa!2Bb@'
          };
          return supertest(app)
            .post('/api/users')
            .send(userPasswordStartsSpaces)
            .expect(400, { error: `Password must not start or end with empty spaces` })
      });
    it(`responds 400 error when password ends with spaces`, () => {
          const userPasswordEndsSpaces = {
            fullname: 'test fullname',
            username: 'test username',            
            password: '1Aa!2Bb@ '
          };
          return supertest(app)
            .post('/api/users')
            .send(userPasswordEndsSpaces)
            .expect(400, { error: `Password must not start or end with empty spaces` })
        });

    it(`responds 400 error when password isn't complex enough`, () => {
          const userPasswordNotComplex = {
            fullname: 'test fullname',
            username: 'test username',            
            password: '11AAaabb'
          };
          return supertest(app)
            .post('/api/users')
            .send(userPasswordNotComplex)
            .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
        });
    it(`responds 400 'User name already taken' when username isn't unique`, () => {
            const duplicateUser = {
              fullname: 'test fullname',
              username: testUser.username,
              password: '11AAaa!!'
              
            };
          return supertest(app)
                .post('/api/users')
                .send(duplicateUser)
                .expect(400, { error: `Username already taken` })
            });
    context(`Happy path`, () => {
        it(`responds 201, serialized user, storing bcryped password`, () => {
          const newUser = {
            fullname: 'test fullname',
            username: 'test username',
            password: '11AAaa!!'
          };
          return supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect(res => {
                expect(res.body).to.have.property('id')
                expect(res.body.username).to.eql(newUser.username)
                expect(res.body.fullname).to.eql(newUser.fullname)
                expect(res.body).to.not.have.property('password')
                expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
            })
            .expect(res =>
                  db
                  .from('ie_users')
                  .select('*')
                  .where({ id: res.body.id })
                  .first()
                  .then(row => {
                    expect(row.username).to.eql(newUser.username)
                    expect(row.fullname).to.eql(newUser.fullname)
            return bcrypt.compare(newUser.password, row.password)
                    })
                  .then(compareMatch => {
                  expect(compareMatch).to.be.true
            })
          );
        });
      });
    });
  });
});