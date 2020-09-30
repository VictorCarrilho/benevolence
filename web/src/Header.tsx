import React from 'react';

interface HeaderProps {
    title: string;
}

/*  Informar no código que essa 'const' é um Funcion Component (Componente no formato de função)
    */
const Header: React.FC<HeaderProps> = (props) => {
    return(
        <header>
            <h1>{ props.title }</h1>
        </header>       
    );
}

export default Header;