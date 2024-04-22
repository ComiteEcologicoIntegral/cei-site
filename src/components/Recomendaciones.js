import { useEffect, useState } from 'react'
import { Nav, NavLink, Tab } from 'react-bootstrap'

const Recomendaciones = (props) => {
    const [selected, setSelected] = useState(props.selected ?? "buena");
    
    useEffect(() => {
        setSelected(props.selected);
    }, [props.selected]);

    const changeSelected = (curr) => {
        if (props.isManual) {
            setSelected(curr);
        }
    }

    return (
        <div className="container mt-5 ">
            <div className="ta-center mb-5">
                
                <h3>Conoce las recomendaciones según el índice de calidad del aire</h3>
            </div>
            <Tab.Container fill activeKey={selected} className="recomendaciones h-100">
                <Nav fill>
                    <Nav.Item>
                        <NavLink eventKey="buena" className="nav-buena" onClick={() => changeSelected("buena")}>Buena</NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink eventKey="acept" className="nav-acept" onClick={() => changeSelected("acept")}>Aceptable</NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink eventKey="mala" className="nav-mala" onClick={() => changeSelected("mala")}>Mala</NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink eventKey="muy" className="nav-muy" onClick={() => changeSelected("muy")}>Muy Mala</NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink eventKey="ext" className="nav-ext" onClick={() => changeSelected("ext")}>Extremadamente Mala</NavLink>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="buena">
                        <ul>
                            Descripción del riesgo: El riesgo en salud es mínimo o nulo.
                            <li>Disfrutar realizar actividades al aire libre.</li> 
                        </ul>
                    </Tab.Pane>
                    <Tab.Pane eventKey="acept">
                        <ul>
                            Población en general, menores de 12 años y gestantes:
                            <li>El riesgo en salud es mínimo.</li>
                            <li>Disfrutar realizar actividades al aire libre.</li>
                            <br  />
                            Población sensible:
                            Descripción del riesgo: Personas que son sensibles al ozono (O3) o material particulado (PM10 y PM2.5) pueden experimentar irritación de ojos y síntomas respiratorios como tos, irritación de vías respiratorias, expectoración o flema, dificultad para respirar o sibilancias.
                            <li>Realizar actividades moderadas al aire libre, reducir actividades físicas vigorosas.</li>
                            <li>En caso de presentar algún síntoma, molestia o tienes dudas, busca consejo médico.</li>
                            <li>Mantenerse informado sobre la evolución de la calidad del aire.</li>

                        </ul>
                    </Tab.Pane>
                    <Tab.Pane eventKey="mala">
                        <ul>
                            Población en general:
                            Descripción del riesgo: Es poco probable que se vea afectada.
                            <li>Realizar actividades al aire libre de manera limitada, incrementar frecuencia de descansos, vigilar que estudiantes no presenten síntomas de afecciones respiratorias.</li>
                        	<li>En caso de presentar síntomas como tos o falta de aire, tomar más descansos y realizar actividades menos vigorosas.</li>
                        	<li>Mantenerse informado sobre la evolución de la calidad del aire.</li>
                            <br />
                            Población sensible:
                            Descripción del riesgo: Incremento en el riesgo de tener síntomas respiratorios y/o disminución en la función pulmonar.
                        	<li>Reducir las actividades físicas vigorosas al aire libre.</li>
                        	<li>En caso de presentar algún síntoma, molestia o tener dudas, acudir al médico.</li>
                        	<li>Mantenerse informado sobre la evolución de la calidad del aire.</li>
                            <br />
                            Menores de 12 años y personas gestantes:
                            Descripción del riesgo: Incremento en el riesgo de tener síntomas respiratorios y/o disminución en la función pulmonar.
                           	<li>Es posible realizar actividades físicas ligeras al aire libre si se aumentan los periodos de descanso.</li>
	                        <li>Reducir actividades físicas vigorosas.</li>
	                        <li>En caso de presentar algún síntoma, molestia o tener dudas, acudir al médico.</li>
	                        <li>Mantenerse informado sobre la evolución de la calidad del aire.</li>

                           
                        </ul>
                    </Tab.Pane>
                    <Tab.Pane eventKey="muy">
                        <ul>
                            Población en general menores de 12 años y personas gestantes:
                            Descripción del riesgo: Se pueden presentar daños a la salud.
                        	<li>Es posible ejercitarse en interiores siempre y cuando sea un espacio libre de humo de tabaco y con sistema de purificación de aire.</li>
                        	<li>Reducir la actividad física al aire libre.</li>
                        	<li>Evitar actividades físicas vigorosas o prolongadas al aire libre.</li>
                        	<li>Suspender entrenamientos y partidos de ligas deportivas y actividades físicas extracurriculares en exteriores.</li>
                        	<li>Mantener puertas y ventanas cerradas.</li>
                        	<li>Evitar fogatas y uso de combustibles sólidos como carbón o leña.</li>
                        	<li>Suspender el uso de cigarros de cualquier tipo.</li>
                        	<li>En caso de presentar algún síntoma, molestia o tener dudas, acudir al médico.</li>
	                        <li>Mantenerse informado sobre la evolución de la calidad del aire.</li> 
                            <br />
                            Personas Sensibles
                            Descripción del riesgo: Pueden experimentar un agravamiento de asma, enfermedad pulmonar obstructiva crónica o evento cardiovascular e incremento en la probabilidad de muerte prematura personas con enfermedad pulmonar obstructiva crónica y cardiaca.
                            <li>Es posible ejercitarse en interiores siempre y cuando sea un espacio libre de humo de tabaco y con sistema de purificación de aire.</li>
                            <li>Evitar actividades físicas al aire libre.</li>
                            <li>Reducir el tiempo de exposición al aire libre.</li>	
                            <li>Suspender entrenamientos y partidos de ligas deportivas y actividades físicas extracurriculares.</li>
                            <li>Mantener puertas y ventanas cerradas.</li>
                            <li>Evitar fogatas y uso de combustibles sólidos como carbón o leña</li>
                            <li>Suspender el uso de cigarros de cualquier tipo.</li>	
                            <li>En caso de presentar algún síntoma, molestia o tener dudas, acudir al médico.</li>
                            <li>Mantenerse informado sobre la evolución de la calidad del aire.</li>	

                        </ul>
                    </Tab.Pane>
                    <Tab.Pane eventKey="ext">
                        <ul>
                            Descripción del riesgo: Es probable que cualquier persona se vea afectada por efectos graves a la salud.
                        	<li>Permanecer en espacios interiores libres de humo de tabaco y con sistemas de purificación de aire. </li>
                        	<li>Evitar actividades físicas al aire libre.</li>
                        	<li>Suspender entrenamientos y partidos de ligas deportivas y actividades físicas extracurriculares.</li>
                        	<li>Mantener cerradas puertas y ventanas.</li>
                        	<li>Acudir al médico o solicitar servicios de emergencias en caso de síntomas de afectaciones a la salud.</li>
                        	<li>Evitar fogatas y uso de combustibles sólidos como carbón o leña.</li>
                        	<li>Suspender el uso de cigarros de cualquier tipo.</li>
                        	<li>Limitar el uso de vehículos que usen combustibles fósiles.</li>
                        	<li>Mantenerse informado sobre la evolución de la calidad del aire.</li>
                    
                        </ul>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
            <div className="ta-center mb-5">
                <h3>Otras Herramientas</h3>
                <p>Recomendamos visitar el sitio web {' '}
                            <a className='text-black' href="https://www.windy.com/">Windy </a>{' '}
                   para conocer más acerca de las condiciones meteorológicas, y así entender cómo se comportarán los contaminantes en el día, pues el viento aleja los contaminantes del aire de su origen y los puede dispersar a otros lugares, lo que significa que la contaminación en un área puede afectar la calidad del aire en un área extensa.
                </p>
            </div>
        </div>
    )
}

export default Recomendaciones
