const GratitudesService ={
    getAllGratitudes(knex){
        return knex.select('*').from('ie_gratitudes')
    },

    insertGratitudes(knex, newGratitudes){
      return knex
        .insert(newGratitudes)
        .into('ie_gratitudes')
        .returning('*')
        .then(rows=>{
            return rows;
          });
    }

}

module.exports = GratitudesService; 