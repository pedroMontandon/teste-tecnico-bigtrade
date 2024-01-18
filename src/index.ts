import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/seu-banco-de-dados', {});

const conexao = mongoose.connection;

conexao.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
conexao.once('open', () => {
  console.log('Conexão com o MongoDB estabelecida com sucesso!');
});

const server = app.listen(PORT, () => console.log(
  `Server is running on PORT: ${PORT}`,
));

export default server;
