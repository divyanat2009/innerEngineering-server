module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV:process.env.NODE_ENV || 'development',
    DATABASE_URL:'postgres://fspqgcdulllhtv:e3d675bc1050701d4f8d9a50ea8838e0987ee2e332d5f7614d6456af29e7c58b@ec2-34-230-167-186.compute-1.amazonaws.com:5432/d2fje472pkkbpp?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory',
    //DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/innerengineering',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/innerengineering-test'
}