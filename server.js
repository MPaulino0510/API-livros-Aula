import express from 'express';
import dotenv from 'dotenv';
import conectarBanco from './db.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('./public'));
const PORTA = process.env.PORTA
const conexao = conectarBanco();
app.get('/', (req, res)=>{
    res.sendFile("./public/index.html", {root: "./public"})
});

app.get("/livros", async (req, res)=>{
    const sql = "SELECT * FROM livro";
    const resposta = await conexao.query(sql);
    res.json(resposta);
});

app.post("/livros", async (req, res)=>{
    const {titulo, descricao, autor} = req.body;
    const sql = "INSERT INTO livro (titulo, descricao, autor) VALUES (?, ?, ?)";
    const resposta = await conexao.query(sql, [
        titulo, 
        descricao, 
        autor
    ]);
    res.status(201).json({
        id: Number(resposta.insertId),
        mensagem: "Livro cadastrado com sucesso!"
    });
});
app.put("/livros/:id", async (req, res)=>{
    const id = Number(req.params.id);
    const {titulo, descricao, autor} = req.body;
    const sql = 'UPDATE livro SET titulo = ?, descricao = ?, autor = ? WHERE id = ?'
    const resposta = await conexao.query(sql, [
        titulo, 
        descricao, 
        autor,
        id
    ]);
    if(resposta.affectedRows > 0) {
        res.json({mensagem: "Livro atualizado com sucesso"})
    }else{
        res.status(404).json(
            {mensagem: "Livro não encontrado"}
        )
    }
})
app.delete("/livros/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const sql = "DELETE FROM livro WHERE id = ?";
        const resposta = await conexao.query(sql, [id]);

        if (resposta.affectedRows > 0) {
            res.json({ mensagem: "Livro deletado com sucesso" });
        } else {
            res.status(404).json({ mensagem: "Livro não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao deletar livro" });
    }
});

app.listen(PORTA, () =>{
    console.log(`Servidor rodando em hhtp://localhost${PORTA}`);
});