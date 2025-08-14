let mysql =  require('mysql')
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mapta'
})

db.connect((error)=>{
    if(error) console.log(error)
    else console.log('terhubner')
})

module.exports = db