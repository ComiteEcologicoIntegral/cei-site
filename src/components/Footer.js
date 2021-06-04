import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-auto py-3">
                        <p className="mb-1">
                            Los datos oficiales provienen de{' '}
                            <a className='text-white' href="https://sinaica.inecc.gob.mx/">Sinaica</a>{' '}
                            y de <a className='text-white' href="http://aire.nl.gob.mx/">Sima</a>
                        </p>
                        <p>Patrocinado por Natuuramika® 2021</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
