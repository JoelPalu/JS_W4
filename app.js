import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.get('/api/v1/cats', (req, res) => {
  const cat = {
    cat_id: 1,
    name: 'Fluffy',
    birthdate: '2015-05-20',
    weight: 4.2,
    owner: 'John Doe',
    image: 'https://placekitten.com/200/300',
  };
  res.json(cat);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
