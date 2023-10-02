import React from 'react';

function Header({ signOut }) {
    return (
        <header>
            <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h1>CS4241 Assignment 4 : Homework Helper</h1>
                <h2>Welcome!</h2>
            </section>
            <button 
                style={{ position: 'absolute', top: '5%', right: '2%' }} 
                onClick={signOut}
            >
                Sign Out
            </button>
        </header>
    );
}

export default Header;
