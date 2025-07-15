const express= require('express');
const app = express(); 



app.get('/', (req, res) => {
  res.send('Hello, World!');    
});

app.get('/about/:id/:name/:password', (req, res) => {
    console.log(req.params);
    res.send(`ID: ${req.params.id}, Name: ${req.params.name}, Password: ${req.params.password}`);
   
    });

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}
);

