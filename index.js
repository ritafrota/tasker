import express from "express"
import { cadastro, login } from "./src/controllers/autenticacao.js";
import { obterAdmins, obterColaboradores, obterUsuarios } from "./src/controllers/usuarios.js";
import { adicionarUsuarioProjeto, criarProjeto, obterDetalhesProjeto, obterProjetos, removerUsuarioProjeto, trocarTechlead } from "./src/controllers/projetos.js";
import { criarSprint } from "./src/controllers/sprints.js";
import { criarTarefa } from "./src/controllers/tarefas.js";
import { autenticacaoMiddleware, ehAdminMiddleware } from "./src/middlewares/autorizacoes.js";

const app = express();
app.use(express.json());


// Autenticação
app.post("/login", login);
app.post('/cadastro', autenticacaoMiddleware, ehAdminMiddleware, cadastro)

// Projeto
app.get('/', autenticacaoMiddleware, obterProjetos)
app.post('/projeto', autenticacaoMiddleware, ehAdminMiddleware, criarProjeto)
app.get('/projeto/:id', autenticacaoMiddleware, obterDetalhesProjeto)
app.patch('/projeto/:id/usuarios', autenticacaoMiddleware, ehAdminMiddleware, adicionarUsuarioProjeto)
app.delete('/projeto/:id/usuarios', autenticacaoMiddleware, ehAdminMiddleware, removerUsuarioProjeto)

app.patch('/projeto/:id/techlead', autenticacaoMiddleware, ehAdminMiddleware, trocarTechlead)


// Sprint
app.post('/sprint', autenticacaoMiddleware, ehAdminMiddleware, criarSprint)

// Tarefa
app.post('/tarefa', autenticacaoMiddleware, ehAdminMiddleware, criarTarefa)

// Get Usuarios
app.get('/usuarios', autenticacaoMiddleware, ehAdminMiddleware,obterUsuarios)
app.get('/usuarios/colaboradores', autenticacaoMiddleware, ehAdminMiddleware, obterColaboradores)
app.get('/usuarios/admins', autenticacaoMiddleware, ehAdminMiddleware, obterAdmins)


app.listen(3000, function(){

    console.log("servidor rodando na porta 3000...")

});
