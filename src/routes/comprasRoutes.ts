import { Router, Request, Response} from "express";
import shoppingitemSchema from "../models/Compras"

const router = Router()

// Rota POST -> Criar uma nova compra

router.post('/', async (req: Request, res: Response) => {
    try{
        const novoCompra = new shoppingitemSchema(req.body);
        const compraSalvo = await novoCompra.save(); //salva no MongoDB
        res.status(201).json(compraSalvo);
    }catch(erro: unknown){
        // Tratamento seguro do erro (unknow)
        if (erro instanceof Error){
            res.status(400).json({erro: erro.message});
        } else {
            res.status(400).json({ erro: String(erro) });
        }
    }
});

//Rot GET -> Listar as compras cadastrados

router.get("/", async (_req: Request, res: Response) => {
    try{
        const compras = await shoppingitemSchema.find(); //buscar todos as compras
        res.json(compras);
    } catch (erro: unknown) {
        if (erro instanceof Error){
            res.status(500).json({ erro: erro.message });
        } else {
            res.status(500).json ({ erro: String(erro) });
        }
    }
});

//Rota PUT - altera os dados das compras

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const comprasAtualizado = await shoppingitemSchema.findByIdAndUpdate(
            id,
            req.body,
            {new: true} //devolve a lista
        );
        
        if(!comprasAtualizado){
            return res.status(404).json({erri: "Cliente não encontrado"});
        }
        res.json(comprasAtualizado);
            } catch (erro: unknown){
                if(erro instanceof Error){
                    res.status(400).json({erro: erro.message});
                } else {
                    res.status(400).json({erro: String(erro)});
                }
            }
        });

// Rota DELETE -> Excluir clientes por ID

router.delete("/:id", async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const comprasAtualizado = await shoppingitemSchema.findByIdAndDelete(id);

        if (!comprasAtualizado) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }
        res.json({ mensagem: "Produto excluído com sucesso "});
    } catch (erro: unknown) {
        if(erro instanceof Error){
            res.status(400).json({ erro: erro.message});
        } else {
            res.status(400).json({ erro: String(erro) });
        }
    }
});

export default router;