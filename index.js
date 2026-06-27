import express from "express"
import { cadastro, login } from "./src/controllers/autenticacao.js";
import { obterAdmins, obterColaboradores, obterUsuarios } from "./src/controllers/usuarios.js";
import { criarProjeto } from "./src/controllers/projetos.js";
import { criarSprint } from "./src/controllers/sprints.js";

const app = express();
app.use(express.json());

app.post("/login", login);

app.post('/cadastro', cadastro)

app.post('/projeto', criarProjeto)

app.post('/sprint', criarSprint)

app.get('/usuarios', obterUsuarios)
app.get('/usuarios/colaboradores', obterColaboradores)
app.get('/usuarios/admins', obterAdmins)


app.listen(3000, function(){

    console.log("porta 3000")

});
