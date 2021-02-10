const UsersService = {
    getAllUsers(knex){
        return knex
        .select('ie_users.id','ie_users.username','ie_users.fullname')
        .from('ie_users')
    },
    insertNewUser(knex, newUser){
        return knex
            .insert(newUser)
            .into('ie_users')
            .returning('*')
            .then(rows=>{
                return rows[0];
            })
    },
    getUserByUserId(knex, id){
        return knex 
            .from('ie_users')
            .select('*')
            .where('id',id)
            .first()
    },
    getUserByUsername(knex, username){
        return knex 
            .select('id','username','password')
            .from('ie_users')
            .where('username',username)
            .first()
    }   
}
module.exports = UsersService;