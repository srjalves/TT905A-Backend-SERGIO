const express = require('express');
const app = express();
app.use(express.json());

//Permissões
 var cors = require('cors');
 app.use(cors());

 app.listen(process.env.PORT || 3000);

 app.get('/', function (req, res){
        res.send("Bem-Vindo!");
     }
 ); 

 app.get('/', function (req, res){
        res.send("Bem-vindo mais uma vez!");
 });

const paises = [
    {nome: "Brasil", organizador:"Brasília"},
    {nome: "Argentina", orgnizador:"Buenos Aires"},
    {nome: "Colombia", orgnizador:"Bogotá"},
    {nome: "Chile", orgnizador:"Santiago"},
    {nome: "Uruguai", orgnizador:"Montevidéu"},
]

app.get('/paises', function(req, res){
        //res.send(mensagens);
        res.send(paises.filter(Boolean));
    } 
);
app.get('/paises/:id', function(req, res){
        const id = req.params.id - 1;
        const paises = paises[id];

        if (!paises){
            res.send("País não identificado!");
        } else {
            res.send(paises);
        }
    }
);

app.post('/paises', 
    (req, res) => {
        console.log(req.body.paises);
        const paises = req.body.paises;
        paises.push(paises);
        res.send("Inserir País!")
    }
);

app.delete('/paises/:id', 
    (req, res) => {
        const id = req.params.id - 1;
        delete paises[id];
        res.send("País removido!");
    }
);   

app.put('/paises/:id',
    (req, res) => {
        const id = req.params.id - 1;
        console.log(req.body.paises);
        const paises = req.body.paises;
        paises[id] = paises;        
        res.send("Países Atualizados!")
    }
);
