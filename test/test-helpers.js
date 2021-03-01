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
            type:"energy",
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
	const preppedUsers = users.map((user) => ({
		...user,
		password: bcrypt.hashSync(user.password, 1),
	})
    );
	return db
		.into('ie_users')
		.insert(preppedUsers)
		.then(() => {
			// update the auto sequence to stay in sync
			db.raw(
                `SELECT setval('ie_users_id_seq', coalesce(max(id),1), false) FROM ie_users`,
                 [users[users.length - 1].id]);
		});
}
 
  function cleanTables(db) {
    return db.raw(
      `TRUNCATE
      ie_selfcares,
      ie_gratitudes,
      ie_users,
      ie_moods,
      ie_goals      
      RESTART IDENTITY CASCADE`
    )
  };

  function seedTable(db, users, gratitudes,selfcares, moods, goals ) {
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('ie_gratitudes').insert(gratitudes)
      //update auto sequence to match forced id values
      await trx.raw(
        `SELECT setval('ie_gratitudes_id_seq', coalesce(max(id),1), false) FROM ie_gratitudes`,
        [gratitudes[gratitudes.length - 1]]
      )   
      await trx.into('ie_selfcares').insert(selfcares)
      await trx.raw(
        `SELECT setval('ie_selfcares_id_seq, ?)`,
        [selfcares[selfcares.length - 1].id]
      )
      await trx.into('ie_moods').insert(moods)
      await trx.raw(
        `SELECT setval('ie_moods_id_seq, ?)`,
        [moods[moods.length - 1].id]
      )
      await trx.into('ie_goals').insert(goals)
      await trx.raw(
        `SELECT setval('ie_goals_id_seq, ?)`,
        [goals[goals.length - 1].id]
      )
     
    });  
}


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