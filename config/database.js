const mongoose = require('mongoose');
const dbConnection=()=>{
    mongoose.connect(process.env.DB_url).then(() => {
      console.log('Database connection successful');
    }).catch((err) => {
      console.error('Database connection error:', err);
    });
};
module.exports=dbConnection;