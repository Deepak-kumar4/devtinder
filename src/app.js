const express= require('express');
const app = express(); 

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get("/test",(req,res)=>{
    res.send("this is test")
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}
);

