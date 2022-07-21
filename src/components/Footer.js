import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="container footer-container">
                <div className="footer-info">
                    <div className='p-5'>
                        <p className="font-weight-light mb-1 mt-2">
                                Los datos oficiales provienen de{' '}
                                <a style={{textDecoration: "underline"}} className='text-white' href="https://sinaica.inecc.gob.mx/">Sinaica</a>{' '}
                                y de <a style={{textDecoration: "underline"}} className='text-white' href="http://aire.nl.gob.mx/">Sima</a>
                            </p>
                            {/* <p className="mb-1">Patrocinado por Natuuramika® 2021</p> */}
                            <p className='font-weight-light'>Proyecto Solidario con el servicio social del TEC de Monterrey</p>
                            <a className='font-weight-light text-white' href="https://comiteecologicointerescolar.org/" style={{textDecoration: "underline"}}>Página Comité Ecológico Integral</a>
                            {/* <p>Redes sociales:</p>
                            <a className='font-weight-light text-white'>Facebook</a>
                            <a className='font-weight-light text-white'>Twitter</a> */}
                    </div>
                    <div className="p-5">
                    <p className='font-weight-bold'>Sobre nosotros</p>
                    <p className='font-weight-light'>Somos un grupo apartidista con el propósito de trabajar a favor de la calidad del aire de nuestra ciudad y de todas aquellas acciones ecológicas que contribuyan a mejorar nuestra calidad de vida y la de nuestro planeta</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
