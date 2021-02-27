const bcrypt = require('bcrypt');

function makeUsersArray(){
    return[
        {
            id:1,
            fullname:"David Beckham",
            username:"dbeckham",
            password:"password",
            date_created:"2029-01-22T16:28:32.615Z" 
        },
        {
            id:2,
            fullname:"Riz Ahmed",
            username:"rizA",
            password:"password",
            date_created:"2029-01-22T16:28:32.615Z" 
        },
    ];
}

function makeGratitudesArray(){
    return[
        {
            id:1,
            user_id:1,
            content:"I kept my cool with the assinments",
            date_modified:"2029-01-22T16:28:32.615Z"           
        },
        {
            id:2,
            user_id:1,
            content:"A catch up phone call with mom",
            date_modified:"2029-01-22T16:28:32.615Z"           
        },
        {
            id:3,
            user_id:1,
            content:"Seeing the Neel grow",
            date_modified:"2029-01-22T16:28:32.615Z"           
        },
        {
            id:4,
            user_id:2,
            content:"The yummy food I ate for dinner last night",
            date_modified:"2029-01-22T16:28:32.615Z"          
        },
    ];
};

function makeGoalsArray(){
    return[
        {
            id:1,
            user_id:1,
            emotional: 4,
            spiritual:7,
            physical:5,
            energy:7         
        },
        {
            id:2,
            user_id:2,
            emotional: 3,
            spiritual:8,
            physical:3,
            energy:2         
        }
    ];
};

function makeSelfCaresArray(){
    return[
         {
            id:1,
            user_id:1,
            content:"Did 15 minutes of breathing exercise",
            type:"intellectual",
            rating:5,
            date_modified:"2029-01-22T16:28:32.615Z"           
        },
        {
            id:2,
            user_id:1,
            content:"Read a book",
            type:"emotional",
            rating:5,
            date_modified:"2029-01-22T16:28:32.615Z"           
        },
        {
            id:3,
            user_id:1,
            content:"Filled out my daily gratitude",
            type:"spiritual",
            rating:2,
            date_modified:"2029-01-22T16:28:32.615Z"           
        },    
    ];
};

function makeMoodsArray(){
    return[
        {
            id:1,
            user_id:2,
            date_modified:"2020-01-22T16:28:32.615Z",
            mood_level:5,
            energy_level:4
           
        },
        {
            id:2,
            user_id:2,
            date_modified:"2020-01-23T16:28:32.615Z",
            mood_level:3,
            energy_level:5
           
        },
        {
            id:3,
            user_id:2,
            date_modified:"2020-01-22T16:28:32.615Z",
            mood_level:2,
            energy_level:3
           
        },
    ];
};

function makeFixtures() {
    const testUsers = makeUsersArray();
    const testGratitudes = makeGratitudesArray(testUsers);
    const testSelfcares = makeSelfCaresArray(testUsers);
    const testGoals = makeGoalsArray(testUsers);
    const testMoods = makeMoodsArray(testUsers);
    return { testUsers, testGratitudes, testSelfcares, testMoods, testGoals};
};

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
      .then(() =>
        db.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
      )
    );
  };

  function cleanTables(db) {
    return db.raw(
      `TRUNCATE
      selfcares,
      gratitudes,
      users,
      moods,
      goals
      RESTART IDENTITY CASCADE`
    )
  };

  function seedTable(db, users, selfcares, gratitudes, moods, goals) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
      }))
    return db.transaction(async trx => {
      await trx.into('users').insert(preppedUsers)
      await trx.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
      )
      await trx.into('selfcares').insert(selfcares)      
      await trx.raw(
                `SELECT setval('selfcares_id_seq', ?)`,
                [selfcares[selfcares.length - 1].id],
              )
      await trx.into('gratitudes').insert(gratitudes)
      await trx.raw(
               `SELECT setval('gratitudes_id_seq', ?)`,
               [gratitudes[gratitudes.length - 1].id],
       )
       await trx.into('moods').insert(moods)
       await trx.raw(
                `SELECT setval('moods_id_seq', ?)`,
                [moods[moods.length - 1].id],
        )   
       await trx.into('goals').insert(goals)
       await trx.raw(
                `SELECT setval('goals_id_seq', ?)`,
                [goals[goals.length - 1].id],
        )   
    });
};

module.exports = {
    seedUsers,
    makeFixtures,
    seedTable,
    makeUsersArray,
    makeGratitudesArray,
    makeSelfCaresArray,
    makeGoalsArray,
    makeMoodsArray,
    cleanTables,        
};  