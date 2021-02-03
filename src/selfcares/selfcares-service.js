const SelfCaresService ={
    getAllSelfCares(knex){
        return knex.select('*').from('ie_selfcares')
    },

    insertSelfCares(knex, newSelfCares){
        return knex 
            .insert(newSelfCares)
            .into('ie_selfcares')
            .returning('*')
            .then(rows=>{
                return rows;
            })
    }
}

module.exports = SelfCaresService;