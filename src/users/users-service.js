const xss = require('xss');
const bcrypt = require('bcrypt');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    getAllUsers(knex) {
      return knex.select('*').from('ie_users')
    }, 
    getById(db, id) {
      return db
        .from('ie_users')
        .select('*')
        .where('id', id)
        .first()
    },
    hasUserWithUserName(db, username) {
      return db('ie_users')
        .where({ username })
        .first()
        .then(user => !!user)
    },
    insertUser(db, newUser) {
      return db
        .insert(newUser)
        .into('ie_users')
        .returning('*')
        .then(([user]) => user)
    },
    validatePassword(password) {
      if (password.length < 8) {
      return 'Password be longer than 8 characters';
      }
      if (password.length > 72) {
      return 'Password be less than 72 characters';
      }
      if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
      }
      if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
      }
      return null;
      },
    hashPassword(password) {
      return bcrypt.hash(password, 12);
      },
    serializeUser(user) {
      return {
        id: user.id,
        username: xss(user.username),    
        fullname: xss(user.fullname),    
        }
      },
    }
    
    module.exports = UsersService;