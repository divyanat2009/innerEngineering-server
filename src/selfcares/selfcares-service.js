const SelfCaresService ={
  getAllSelfCares(knex){
    return knex
      .select('*')
      .from('ie_selfcares')
  },
  getAllSelcaresByUser(knex, user_id){
    return knex('ie_selfcares')
        .where({ user_id })
},
  insertSelfCares(knex, newSelfCares){
    return knex 
      .insert(newSelfCares)
      .into('ie_selfcares')
      .returning('*')
      .then(rows=>{
      return rows;
    });
  }
}
module.exports = SelfCaresService;