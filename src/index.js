import express from 'express';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log(
  `Server is running on PORT: ${PORT}`,
));


export default server;
