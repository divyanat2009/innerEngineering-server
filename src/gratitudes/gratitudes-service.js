const GratitudesService ={
  getAllGratitudes(knex){
      return knex
        .select('*')
        .from('ie_gratitudes')
  },
  getAllEntriesByUserId(knex, user_id){
    return knex
        .from('ie_gratitudes')
        .where({ user_id })
  },
  getSomeGratitudes(knex, page){  
    const resultsPerPage = 9;
    const offset = resultsPerPage * (page - 1);
    const from = `2020-05-18T00:00:00Z`;
    const to = `1960-01-32T23:59:59Z`;
     return knex
       .select('*')
       .from('ie_gratitudes')
       .whereBetween('date_modified',[from,to])
       .orderBy([
          { column: 'date_modified', order: 'DESC' },
        ])
       .limit(resultsPerPage)
       .offset(offset)
  },

  getSpecificDateGratitude(knex, date){
    const from = `${date}T00:00:00Z`;
    const to = `${date}T23:59:59Z`;
    return knex
      .select('*')
      .from('ie_gratitudes')
      .whereBetween('date_modified', [from,to])
      .orderBy([
        { column: 'date_modified', order: 'DESC' },
      ])
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