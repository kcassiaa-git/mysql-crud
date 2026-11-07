import express from 'express';
import mysql from 'mysql2/promise';

const app = express ();

app.use(express.json());

const port = 3000;
const pool = mysql.createPool({ //conexão com o sistema
    host: 'localhost', //onde estamos hospedados
    user: "root", //nome do meu usuário
    password: '1234', //minha senha
    database: 'usuarios',
    port: 3306, //minha porta
    connectionLimit: 10, //limite de conexões simultâneas
    queueLimit: 0, //limite da fila
})

//framework.verbo ('/função anônima', )
app.get('/users', async (req, res) => {
    try{
        const [rows] = await pool.query( //await: "essa função pode demorar, espere a respota para você continuar"
        `SELECT * FROM users;` 
        );
        return res.status(200).json({
            msg: "Sucesso ao retornar usuários",
            data: rows
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            messagem: "Erro no servidor, tente novamente!"
        })
        
    }
    
});


app.post('/users', async(req,res) => {
    try {
    const {name, email} = req.body;

    const [result] = await pool.query(
        `INSERT INTO users (id, name, email)
             VALUES (null, ?, ?)`,
             [name, email]
    );

     return res.status(201).json({
         message : "Usuário criado com sucesso!"
     })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            messagem: "Erro no servidor, tente novamente!"
        })
    }
});

app.delete('/users/:id', async(req,res) => {
    try{
    const {id} = req.params;

    const [result] = await pool.query(
        `DELETE FROM users WHERE id = ?`,
          [id]
    );

        return res.status(201).json({
                message: "Usuário deletado com sucesso!"
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            messagem: "Erro no servidor, tente novamente!"
        })
    }
})

//PUT

app.put('/users/:id', async(req,res) => {
    try{
    const {id} = req.params; // requisição do parametros
    const {name, email} = req.body; 

    const [result] = await pool.query( //query = comando SQL
        `UPDATE users SET name = ?, email= ?
             WHERE id = ?`,
             [name, email, id]
    )
    
    return res.status(200).json({
            message : "Usuário atualizado!" })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            messagem: "Erro no servidor, tente novamente!"
        })
    }
})


app.listen(port, () => {
    console.log (`Servidor rodando na porta ${port}`);
})
