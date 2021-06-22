const express = require("express");
const app = express();
app.use(express.json()); 


var cors = require('cors');
app.use(cors());


app.listen(process.env.PORT || 3000);



const brasil = '{ "name":"Brasil", "type":"Brasilia"}';
const argentina = '{ "name":"Argentina", "type":"Buenos Aires" }';
const colombia = '{ "name":"Colombia", "type":"Bogotá"}';
const chile = '{ "name":"Chile", "type":"Santiago"}';
const uruguai = '{ "name":"Uruguai", "type":"Montevideu"}';



const pais = [ JSON.parse(brasil), 
                  JSON.parse(argentina),
                  JSON.parse(colombia),
                  JSON.parse(chile),
                  JSON.parse(uruguai),
               
];


app.get('/',
    function(req, res){
        res.send("Bem-vindo à América do Sul!"); 
    }
);


app.get('/pais',
    function(req, res){
        res.send(pais.filter(Boolean)); 
                                             
    }
);


app.get('/pais/:id',
    function(req, res){
        const id = req.params.id - 1;
        const paises = pais[id];

        if (!paises){
            res.send("Pais não encontrado");
        } else {
            res.send(paises);
        }
    }
)

app.post('/pais', 
    (req, res) => {
        console.log(req.body.paises); 
        const paises = req.body.paises;
        pais.push(paises); 
                                 
        res.send("Inserir pais!")
    }
);

app.put('/pais/:id',
    (req, res) => {
        const id = req.params.id - 1;
        const paises = req.body.paises;
        pais[id] = paises;        
        res.send("Paises atualizados!")
    }
)

app.delete('/pais/:id', 
    (req, res) => {
        const id = req.params.id - 1;
        delete pais[id];

        res.send("Pais removido!");
    }
);

/*
  Daqui para baixo, uso o banco de dados MongoDB
*/

const mongodb = require('mongodb')


const connectionString = "mongodb+srv://admin:Covid-19@cluster0.rmmao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
};

(async()=>{
    const client = await mongodb.MongoClient.connect(connectionString, options);
    const db = client.db('myFirstDatabase');
    const pais = db.collection('pais');
    console.log(await pais.find({}).toArray());

    app.get('/database',
        async function(req, res){
        // res.send(pais);
        res.send(await pais.find({}).toArray());
    }
);

app.get('/database/:id',
    async function(req, res){
        const id = req.params.id;
        const paises = await pais.findOne(
            {_id : mongodb.ObjectID(id)}
        );
        console.log(paises);
        if (!paises){
            res.send("pais não encontrado");
        } else {
            res.send(paises);
        }
    }
);

app.post('/database', 
    async (req, res) => {
        console.log(req.body);
        const paises = req.body;
        
        delete paises["_id"];

        pais.insertOne(paises);        
        res.send("criar um pais!");
    }
);

app.put('/database/:id',
    async (req, res) => {
        const id = req.params.id;
        const paises = req.body;

        console.log(paises);

        delete paises["_id"];

        const num_pais = await pais.countDocuments({_id : mongodb.ObjectID(id)});

        if (num_pais !== 1) {
            res.send('Ocorreu um erro por conta do número de paises');
            return;
        }

        await pais.updateOne(
            {_id : mongodb.ObjectID(id)},
            {$set : paises}
        );
        
        res.send("pais atualizada com sucesso!")
    }
)

app.delete('/database/:id', 
    async (req, res) => {
        const id = req.params.id;
        
        await pais.deleteOne({_id : mongodb.ObjectID(id)});

        res.send("pais removido com sucesso!");
    }
);

})();
