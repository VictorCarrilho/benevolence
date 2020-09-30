import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    /* FUNCTION: Buscar um ponto de coleta enviando filtros
       Por enquanto recebemos os items separado por virgula. Podendo ser 
       alterado posteriormente. */
    async indexByFilter (request: Request, response: Response){
        const { pointCity, pointUF, pointItems } = request.query;
        
        /*  Utilizar a virgula como separador da String
            Percorrer cada item e retirar espaço a esqueda e direita
            e transformar em Number */
        const parsedItems = String(pointItems).split(',').map( item => Number(item.trim())); 
        
       
        /* Comando: SELECT DISTINCT(points.pointID), points.* FROM points
                        JOIN point_item ON point_item.pointID = points.pointID
                        WHERE point_item.itemID IN ( arrayItems )
                        AND points.pointCity = varCity
                        AND points.pointUF = varUF        */
        const returnPoints = await knex('points')
            .join('point_item', 'points.pointID', '=', 'point_item.pointID')
            .whereIn('point_item.itemID', parsedItems)
            .where('pointCity', String(pointCity))
            .where('pointUF', String(pointUF))
            .distinct()
            .select('points.*');

        return response.json(returnPoints);        
    }
    
    /* FUNCTION: Buscar um ponto de coleta
       Por estarmos fora do arquivo de rotas, devemos importar as funções
       do 'express' para informar ao TypeScript qual tipo das nossas variaveis */
    async show (request: Request, response: Response){
            const pointID = request.params.pointID;
            const returnPoints = await knex('points').where('pointID', pointID).first();

            if(!returnPoints) {
                return response.status(400).json({message: 'Point not found.'});
            }


            const returnItems = await knex('items')
                                        .join('point_item', 'items.itemID', '=', 'point_item.itemID')
                                        .where('point_item.pointID', pointID)
                                        .select('items.itemTitle');

            return response.json( { returnPoints, returnItems } );
    }

    /* FUNCTION: Cadastrar pontos de coleta 
       Por estarmos fora do arquivo de rotas, devemos importar as funções
       do 'express' para informar ao TypeScript qual tipo das nossas variaveis */
    async create(request: Request, response: Response) {
    
        const data = request.body; //Body recebido pelo WebService
        const trx = await knex.transaction(); // Abrir uma transaction no knex
        
        const pointInfo = {
            pointName: data.pointName,
            pointEmail: data.pointEmail,
            pointWhatsApp: data.pointWhatsApp,
            pointLatitude: data.pointLatitude,
            pointLongitude: data.pointLongitude,
            pointCity: data.pointCity,
            pointUF: data.pointUF,
            pointNumber: data.pointNumber,
            pointImage: 'image-fake'
        }
        
        // IDs inseridos pelo insert (Neste caso retornará somente 1 ID)
        const insertedIDs = await trx('points').insert(pointInfo);
        
        /*  - array de itens de coleta para ser vinculado ao ponto de coleta: data.ITEMS
            - Percorrer o array recebido montar o insert na tabela point)item
            - pointID é retornada no insert do point */
        const pointItems = data.items.map((itemID: number) =>{
            return {
                itemID,
                pointID: insertedIDs[0]
            }
        });
        
        // Inserir o vinculo do ponto de coleta com o item de coleta
        await trx('point_item').insert(pointItems);
        await trx.commit();
        
        return response.json({ 
            success: true,
            info: {
                pointID: insertedIDs[0],
                ... pointInfo
            }            
        });
    }
}


export default PointsController;