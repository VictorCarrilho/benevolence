import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

// MapLibs 
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

// ApiLibs
import api from '../../services/api';
import axios from 'axios';

// StyleLibs
import './style.css';
import logo from '../../assets/logo_100x100.png';



interface StateItem {
    itemID: number;
    itemTitle: string;
    itemImage: string;
}

/* Formato que será recebido no axios.get IBGE UFs*/
interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

  
const CreatePoint = () => {
    
    const [items, setItems] = useState<StateItem[]>([]); // Armazenar os items de coleta //
    const [UFs, setUFs] = useState<string[]>([]);        // Armazenar as UFs retornadas do IBGE //
    const [cities, setCities] = useState<string[]>([]);  // Armazenar as cidades retornadas do IBGE //
    const [initialPositionMap, setinitialPositionMap] = useState<[number, number]>([0,0]); // Cordenadas iniciais no Map //

    const [formData, setFormData] = useState({ // Form recebido do onChange dos Inputs na tela //
        pointName: '',
        pointEmail: '',
        pointWhatsApp: '',
        pointNumber: 0
    });

    // Informações selecionadas... UF, Cidade, Itens de Coleta, Posição no Mapa
    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedPositionMap, setSelectedPositionMap] = useState<[number, number]>([0,0]);
    
    const history = useHistory();


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setinitialPositionMap([latitude, longitude]);
            setSelectedPositionMap([latitude, longitude]);
        });
    }, []);


    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);


    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const infoUF = response.data.map(uf => uf.sigla);
            setUFs(infoUF);
        });
    }, []);


    function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
        const UF = event.target.value;
        setSelectedUF(UF);
    }

    useEffect(() => {
        if(selectedUF === '0'){
            return;
        }        
        
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
            .then(response => {
                const cityName = response.data.map(city => city.nome);
                setCities(cityName);
        });

    }, [selectedUF]);

    
    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);   
    }

    function handleMapClick(event: LeafletMouseEvent ){
        setSelectedPositionMap([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleSelectItem(itemID: number) {
        const alreadySelected  = selectedItems.findIndex(item => item === itemID);
        
        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== itemID);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems( [...selectedItems, itemID]);
        }        
    }


    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        const { pointName, pointEmail, pointWhatsApp, pointNumber } = formData;
        const pointUF = selectedUF;
        const pointCity = selectedCity;
        const [ pointLatitude, pointLongitude ] = selectedPositionMap;
        const items = selectedItems;

        const data = {
            pointName,
            pointEmail,
            pointWhatsApp,
            pointNumber,
            pointUF,
            pointCity,
            pointLatitude,
            pointLongitude,
            items
        }

        await api.post('points', data);
        
        alert('Ponto de Coleta criado com sucesso!');
        history.push('/');
    }


    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Benevolence"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text" 
                            id="pointName" 
                            name="pointName" 
                            onChange={handleInputChange} />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <input 
                                type="email" 
                                id="pointEmail" 
                                name="pointEmail"
                                onChange={handleInputChange} />
                        </div>

                        <div className="field">
                            <label htmlFor="name">WhatsApp</label>
                            <input 
                                type="text" 
                                id="pointWhatsApp" name="pointWhatsApp"
                                onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPositionMap} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                        />

                        <Marker position={selectedPositionMap}/>
                    </Map>


                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">Número</label>
                            <input 
                                type="number" 
                                id="pointNumber" 
                                name="pointNumber"
                                onChange={handleInputChange} />
                        </div>

                        <div className="field">
                            <label htmlFor="name">Estado (UF)</label>
                            
                            <select 
                                id="pointUF" 
                                name="pointUF" 
                                value={selectedUF} 
                                onChange={handleSelectedUF} >
                                
                                <option value="0">Selecione uma UF</option>
                                
                                {UFs.map(uf => (
                                    <option 
                                        key={uf} 
                                        value={uf}>
                                            {uf}
                                    </option>
                                ))}
                            </select>
                            
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="name">Cidade</label>

                        <select 
                            id="pointCity" 
                            name="pointCity"
                            value={selectedCity} 
                            onChange={handleSelectedCity} >

                            <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option 
                                        key={city} 
                                        value={city}>
                                            {city}
                                    </option>
                                ))}

                        </select>
                    </div>
                    

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                                key={item.itemID} 
                                onClick={() => handleSelectItem(item.itemID)}
                                className={ selectedItems.includes(item.itemID) ? 'selected' : '' }
                            >
                                <img src={item.itemImage} alt={item.itemTitle}/>
                                <span>{item.itemTitle}</span>
                            </li>
                        ))}                        
                    </ul>
                </fieldset>

            <button type="submit">Cadastrar ponto de coleta</button>

            </form>
        </div>
    );
}

export default CreatePoint;




/* 
    Documentação/Anotações 

    # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- #
    
    # Funcionamento do useEffect
    
    Ao montar o component, desejo realizar a requisição ao WebService
    
    UseEffect: 
        1º parametro: Função que será executada
        2º parametro: Quando sera executada (Variaveis que se for alterada, executar a função novamente)
    Informamos um array vazio [] para que seja executado somente uma vez (Ao abrir a tela) 

    

    # Porque usar INTERFACE
    Sempre que criar uma State para Array ou Objeto
    È necessário informar o tipo da Variavel MANUALMENTE. 
    Por isso criamos uma 'interface' para o array ITEMS por exemplo, e 
    informamos no useState qual o tipo do State que iremos armazenar ali.


    
    # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- # ---- #


    Function: useEffect getCurrentPosition
    Função para carregar a posição inicial do usuário no Map
    

    Function: useEffect items
    Função para buscar os items de coleta cadastrados


    Function: useEffect IBGEUFResponse
    Função para buscar os ESTADOS da API do IBGE


    Function: handleSelectedUF
    Função responsavel por alterar o valor da nossa state UF
    Consequentemente, nosso useEffect também será executado,
    fazendo assim uma requisição para a api de cidades de acordo
    com o UF selecionado 
    
    
    Function useEffect IBGECityResponse
    Ao alterar o valor do selectedUF, buscar as cidades conforme o UF selecionado
    
    
    Function: handleSelectedCity
    Função para selecionar a cidade do ponto de coleta


    Function: handleMapClick
    Função para selecionar um ponto no mapa


    Function: handleInputChange
    Função para armazenar os dados digitados nos Inputs


    Function: handleSelectItem
    Armazenar os itens de coleta selecionados        
    Verificar se o item clicado ja esta dentro do array.
    em caso positivo, a função findIndex irá retornar 0 ou maior.
    em caso negativo, a função findIndex irá retornar -1
    Se ja existe, filtramos todos os items do array, retirando o item clicado. 
    Senão existe, adicionar o item clicado ao array

*/