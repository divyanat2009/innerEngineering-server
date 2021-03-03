const MoodsService ={
    getAllMoods(knex){
        return knex.select('*').from('ie_moods')
    },
    getAllMoodsByUser(knex, user_id){
        return knex
            .from('ie_moods')
            .where({ user_id })
            .orderBy('date_modified', 'desc')
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