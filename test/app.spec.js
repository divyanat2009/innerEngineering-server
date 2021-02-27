const app = require('../src/app');

describe('App',()=>{
  it('GET/responds with 200 containing "Welcome to Inner Engineering App!',()=>{
    return supertest(app)
    .get('/')
    .expect(200, 'Welcome to Inner Engineering App!')
  });
})