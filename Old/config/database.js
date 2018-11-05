// config/database.js
module.exports = {
    'connection': {
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'password': process.env.DB_PASSWORD,
        'database': process.env.DB_NAME,
        'port': process.env.DB_PORT
    },
    'users_table': 'users',
    'chat_messages_table': 'chat_messages'
};