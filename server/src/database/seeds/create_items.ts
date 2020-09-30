import Knex from 'knex';

export async function seed(knex: Knex){
    await knex('items').insert([
        { itemTitle: 'Leite', itemImage: 'leite.png' },
        { itemTitle: 'Agasalho', itemImage: 'agasalho.png' },
        { itemTitle: 'Cesta Basica', itemImage: 'cesta_basica.png' },
        { itemTitle: 'Cobertor', itemImage: 'cobertor.png' }
    ]);
}