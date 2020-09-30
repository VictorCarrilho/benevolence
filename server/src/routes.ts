import express from 'express';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const ObjPointsController = new PointsController();
const ObjItemsController = new ItemsController();


routes.get('/', (request, response) => {
    return response.json({ message: 'Hello World' });
});


/* 
    index -> Listar todos os items
    show -> Listar somente um item especifico 
    create -> Criar um item 
    update -> atualizar um item 
    delete -> deletar um item 
*/

routes.get('/items', ObjItemsController.index);
routes.post('/items', ObjItemsController.create);

routes.post('/points', ObjPointsController.create);
routes.get('/points/:pointID', ObjPointsController.show);
routes.get('/points', ObjPointsController.indexByFilter);

export default routes;