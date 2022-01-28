import Iframe from './components/Iframe'

function Acerca() {

    const iframe = '<iframe src="https://comiteecologicointerescolar.org/acerca-de-ceiaire/" width="100%" height="790px" frameBorder="0" style="border: 0;"></iframe>';

    return (
        <Iframe iframe={iframe}/>
    )
}

export default Acerca;