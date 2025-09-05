import  express  from "express";
import mongoose from "mongoose";
import path from "path";
import comprasRoutes from "./routes/comprasRoutes"
import { error } from "console";

const app = express();

//Middleware para JSON
app.use(express.json());

//Conexão ao MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/shopping-list")
    .then(() => console.log("Conectado ao MongoDB Compass"))
    .catch((erro) => console.error("Erro ao conectar: ", erro));

//Rotas API
app.use("/compras", comprasRoutes);

//Servir front-end da pasta public
app.use(express.static(path.join(__dirname, "../public")));

//Iniciar o servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000")
})
