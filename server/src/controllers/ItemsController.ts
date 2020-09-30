import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {

    /* FUNCTION: Listar itens de coleta 
       Por estarmos fora do arquivo de rotas, devemos importar as funções
       do 'express' para informar ao TypeScript qual tipo das nossas variaveis */
    async index (request: Request, response: Response)  {
        const items = await knex('items').select('*'); // SELECT * FROM ITEMS
        
        const serializedItems = items.map(item => {
            return {
                itemID: item.itemID,
                itemTitle: item.itemTitle,
                itemImage: `http://localhost:3333/uploads/${item.itemImage}`
            }
        });
    
        return response.json(serializedItems);
    }



    async create(request: Request, response: Response) {
        const data = request.body; 
        const trx = await knex.transaction();
        
        const itemInfo = {
            itemTitle: data.itemTitle,
            itemImage: data.itemImage
        }
        
        const insertedIDs = await trx('items').insert(itemInfo);
        
        await trx.commit();
        
        return response.json({
            success: true,
            info: {
                itemID: insertedIDs[0],
                ... itemInfo
            }            
        });
    }

    

}

export default ItemsController;