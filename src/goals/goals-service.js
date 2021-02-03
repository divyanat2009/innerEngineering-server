const GoalsService ={
    getAllGoals(knex){
      return knex.select('*').from('ie_goals')
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