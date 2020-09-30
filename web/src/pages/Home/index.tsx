import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './style.css';
import logo from '../../assets/logo_100x100.png';

const Home = () => {
    return(
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Benevolence" />
                </header>

                <main>
                    <h1>O Marketplace que deixa o mundo melhor.</h1>
                    <p>Ajudamos pessoas a ajudar pessoas. </p>
                    
                    <Link to="/create-point">
                        <span> <FiLogIn /> </span>
                        <strong>Cadastrar ponto/campanha</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
};

export default Home;