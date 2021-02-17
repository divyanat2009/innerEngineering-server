const GoalsService ={
    getAllGoals(knex){
      return knex.select('*').from('ie_goals')
    },
    getAllGoalsByUser(knex, user_id){
        return knex('ie_goals')
            .where({ user_id })
    },

    insertGoals(knex, newgoal){
        return knex 
            .insert(newgoal)
            .into('ie_goals')
            .returning('*')
            .then(rows=>{
                return rows[0];
        });
    }
}
module.exports = GoalsService;