import mongoose, {Schema, Document} from "mongoose";

// Interface que define a estrutura Cliente

export interface ICompras extends Document {
    nome: string;
    preco: number;
    quantidade:number;
    criadoEm: Date
}

// Definindo o esquema (estrutura do documento no MongoDB)

const shoppingitemSchema: Schema = new Schema({
    nome: {type: String, required: true }, //campo obrigatrio
    preco: { type: Number, required: true},
    quantidade: {type: Number, required: true},
    criadoEm: {type: Date, default: Date.now } //Data automática
});

//Exportar modelo para ser usado

export default mongoose.model<ICompras>("Compras", shoppingitemSchema)