const express= require('express');
const app = express(); 

app.use("/",function(req,res,next){
  console.log("Handling the route user");
  res.send("Hello from user route");
  next();
  
},function(req,res,next){
  console.log("Handling the route user 2");
  res.send("Hello from user route 2");
  next();
},
function(req,res,next){
  console.log("Handling the route user 3"); 
  res.send("Hello from user route 3");
});


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}
);

