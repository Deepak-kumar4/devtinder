const express= require('express');
const app = express(); 



app.get('/', (req, res) => {
  res.send('Hello, World!');    
});

app.post('/data', (req, res) => {
  res.json({ message: 'Data received' });   
});
app.put('/data', (req, res) => {    
    res.json({ message: 'Data updated' });
    });
app.delete('/data', (req, res) => {    
    res.json({ message: 'Data deleted' });
}); 

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}
);

