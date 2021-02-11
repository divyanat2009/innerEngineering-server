const knex = require('knex');
const app = require('../src/app');
require('dotenv').config();

describe('Test api endpoints', () => {

    before('make knex instance', () => {
        const db =knex({
            client: 'pg',
            connection:DATABASE_URL,
          })
          
          app.set('db',db)
      })

    context(`testing users endpoints`, () => {
      
        it(`/api/users should respond with 200 and a list of users`, () => {
        return supertest(app)
          .get('/api/users')
          .expect(200, 
            [
                { id: 1, username: 'dBeckham', fullname: 'David Beckham' },
                { id: 2, username: 'rizA', fullname: 'Riz Ahmed' },
                { id: 3, username: 'dtarg', fullname: 'Danaerys Targeryan' },
                { id: 4, username: 'uragnar', fullname: 'Uhtred Ragnarson' },
                { id: 5, username: 'jondoe1', fullname: 'Jon Doe' },
                { id: 6, username: 'davidg', fullname: 'David G' },
                { id: 8, username: 'jondoe2', fullname: 'Jon Doe' },
                { id: 12, username: 'jondoe3', fullname: 'Jon Doe' },
                { id: 9, username: 'jondoe4', fullname: 'Jon Doe' },
                { id: 17, username: 'jondoe8', fullname: 'Jon Doe' },
                { id: 18, username: 'jondoe9', fullname: 'Jon Doe' },
                { id: 19, username: '', fullname: '' },
                { id: 21, username: 'jpndoe7', fullname: 'Jon Doe' },
                { id: 29, username: 'jondoe6', fullname: 'Jon Doe' },
                { id: 35, username: 'test', fullname: 'test' },
                { id: 37, username: 'jondoe5', fullname: 'Jon Doe' }
              ]
                
            )
      })

      it(`/api/users/1 should respond with 200 and jondoe3`, () => {
        return supertest(app)
          .get('/api/users/1')
          .expect(200, 
            {
                "id": 1,
                "username": "jondoe3",
                "fullname": "Jon Doe"
            },
            )
      })

      it(`/api/users/checkuser/jondoe3 authentication should respond with 200`, () => {
        return supertest(app)
          .post('/api/users/checkuser/jondoe3')
          .send({"password": "password"})
          .expect(200)
      })

      it(`/api/users/checkuser/jondoe3 anuthorized should respond with 401`, () => {
        return supertest(app)
          .post('/api/users/checkuser/jondoe3')
          .send({"password": "passwords"})
          .expect(401)
      })
    })

})