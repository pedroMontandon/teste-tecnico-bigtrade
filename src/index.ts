import mongoose from 'mongoose';
import App from "./app";

const PORT = process.env.PORT || 3000;
const appInstance = new App();
appInstance.start(PORT);

// COLOCAR O BANCO DE DADOS AQUI
mongoose.connect('mongodb://localhost/meu-banco-de-dados', {});

const conexao = mongoose.connection;
 
conexao.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
conexao.once('open', () => {
  console.log('Conexão com o MongoDB estabelecida com sucesso!');
});

const server = appInstance.app.listen(PORT, () => console.log(
  `Server is running on PORT: ${PORT}`,
));

export default server;
