const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://charanreddy19:charan19@nodeexpressprojects.shll3.mongodb.net/
    ?retryWrites=true&w=majority&appName=NodeExpressProjects`)
.then((res)=>{
    console.log("Database Connected !!!")
    console.log(res);
})
.catch((err)=>{
    console.log(err);
})