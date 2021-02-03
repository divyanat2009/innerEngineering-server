const QuotesService ={
    getAllQuotes(knex){
        return knex.select('*').from('ie_quotes')
    },
}
module.exports = QuotesService;