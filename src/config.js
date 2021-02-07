module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV:process.env.NODE_ENV || 'development',
    //DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/innerengineering',
    DATABASE_URL:'postgres://yecqtrejnkehwi:1ec4aa896457a86e13fca006584e01488cf822e3f9b8a00e56063c1a0a99b222@ec2-54-211-77-238.compute-1.amazonaws.com:5432/d30sh0bavq74qt?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/innerengineering-test'
}