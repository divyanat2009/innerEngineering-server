const MoodsService ={
    getAllMoods(knex){
        return knex.select('*').from('ie_moods')
    },

    insertMoods(knex, newMood){
        return knex 
            .insert(newMood)
            .into('ie_moods')
            .returning('*')
            .then(rows=>{
                return rows[0];
        });
    }
}

module.exports = MoodsService;