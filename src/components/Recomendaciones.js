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
                            <li>Realizar actividades al aire libre</li>
                            <li>Ejercitarse al aire libre</li>
                            <li>Sin riesgo para personas vulnerables</li>
                        </ul>
                    </Tab.Pane>
                    <Tab.Pane eventKey="acept">
                        <ul>
                            <li>Realizar actividades al aire libre</li>
                            <li>Ejercitarse al aire libre</li>
                            <br  />
                            Personas con enfermedades cardiovasculares / respiratorias o mayores a 60 años:
                            <li>Es posible realizar actividades físicas en espacios interiores, siempre y cuando se trate de un espacio libre de humo de tabaco. Evita las actividades físicas vigorosas y moderadas, así como el tiempo de estancia al aire libre. </li>
                            <li>Si presentas algún síntoma o molestia o tienes dudas, busca el consejo de tu médico.</li>
                            <li>Infórmate sobre la evolución de la calidad del aire.</li>
                            <br  />
                            Menores de 12 años y gestantes:
                            <li>Disfruta las actividades al aire libre.</li>
                            <li>Personas vulnerables limitar actividades físicas</li>
                            <li>Infórmate sobre la evolución de la calidad del aire.</li>
                            <br  />
                            Población en general:
                            <li>Disfruta las actividades al aire libre.</li>
                            <li>Infórmate sobre la evolución de la calidad del aire.</li>
                        </ul>
                    </Tab.Pane>
                    <Tab.Pane eventKey="mala">
                        <ul>
                            <li>Limitar actividades físicas al aire libre, incrementar frecuencia de descansos, vigilar que estudiantes no presenten síntomas de afecciones respiratorias.</li>
                            <li>Limitar tiempo de exposición</li>
                            <li>Considerar suspender entrenamientos y partidos de ligas deportivas y actividades físicas extracurriculares</li>
                            <li>Se recomienda el uso de mascarillas reutilizables N95 con certificación NIOSH*</li>
                            <br  />
                            Personas con enfermedades cardiovasculares / respiratorias o mayores a 60 años:
                            <li>Reduce las actividades físicas vigorosas al aire libre como ejercicios aeróbicos, jugar fútbol, básquetbol, voleibol, atletismo, ciclismo deportivo o correr, trotar suave, caminar a paso rápido o moverse en bicicleta, monopatín, patines y patinetas.</li>
                            <li>Si presentas algún síntoma o molestia o tienes didas, busca el consejo de tu médico.</li>
                            <li>Infórmate sobre la evolución de la calidad del aire. </li>
                            <br  />
                            Menores de 12 años y personas gestantes:
                            <li>Es posible realizar actividades físicas al aire libre como trotar suave, caminar a paso rápido o moverse en bicicleta, monopatín, patines y patinetas; aumenta los periodos de descanso.</li>
                            <li>Reduce las actividades físicas vigorosas al aire libre como ejercicios aeróbicos, jugar fútbol, básquetbol, voleibol, atletismo, ciclismo deportivo, etc.</li>
                            <li>Si se presentan síntomas respiratorios o cardiacos suspende la actividad y acude a tu médico.</li>
                            <li>Infórmate sobre la evolución de la calidad de aire.</li>
                            <li>Es posible realizar actividades al aire libre.</li>
                            <li>Si presenta síntomas como tos o falta de aire, tomas más descansos y realiza actividades menos vigorosas.</li>
                            <li>Infórmate sobre la evolución de la calidad del aire.</li>
                            <br  />
                            Población en general:
                            <li>Es posible realizar actividades al aire libre.</li>
                            <li>Si presenta síntomas como tos o falta de aire, tomas más descansos y realiza actividades menos vigorosas.</li>
                            <li>Infórmate sobre la evolución de la calidad del aire.</li>
                           
                        </ul>
                    </Tab.Pane>
                    <Tab.Pane eventKey="muy">
                        <ul>
                            <li>Evitar actividades al aire libre</li>
                            <li>Evitar ejercitarse al aire libre o en interiores que no cuenten con sistemas de purificación de aire</li>
                            <li>Cerrar puertas y ventanas</li>
                            <li>Personas vulnerables permanecer en interiores sin actividad física</li>
                            <li>Acudir al médico en caso de síntomas de afectaciones a la salud</li>
                            <li>Evitar fogatas y uso de combustibles sólidos como carbón o leña</li>
                            <li>Suspender entrenamientos y partidos de ligas deportivas y actividades físicas extracurriculares</li>
                            <li>Suspender el uso de cigarros de cualquier tipo</li>
                            <li>Limitar el uso de vehículos que usen combustibles fósiles</li>
                            <li>Se recomienda fuertemente el uso de mascarillas reutilizables N95 con certificación NIOSH*</li>
                            <br  />
                            Personas con enfermedades cardiovasculares / respiratorias o mayores a 60 años:
                            <li>Es posible realizar actividades físicas en espacios interiores, siempre y cuando se trate de un espacio libre de humo de tabaco. </li>
                            <li>Evita las actividades físicas vigorosas y moderadas, así como el tiempo de estancia al aire libre.</li>
                            <li>Si presentas algún síntoma o molestia o tienes dudas, busca el consejo de tu médico.</li>
                            <br  />
                            Menores de 12 años y personas gestantes:
                            <li>Reduce las actividades físicas al aire libre y de preferencia realízalas en espacios interiores, siempre y cuando se trate de un espacio libre de humo de tabaco.</li>
                            <li>Evita la actividad física vigorosa o prolongada al aire libre.</li>
                            <li>Infórmate sobre la evolución de la calidad del aire.</li>
                            <br  />
                            Población en general:
                            <li>Reduce las actividades físicas al aire libre y de preferencia realízalas en espacios interiores, siempre y cuando se trate de un espacio libre de humo de tabaco.</li>
                            <li>Evita la actividad física vigorosa o prolongada al aire libre.</li>
                            <li>Infórmate sobre la evolución de la calidad del aire.</li>


                        </ul>
                    </Tab.Pane>
                    <Tab.Pane eventKey="ext">
                        <ul>
                            <li>Evitar actividades al aire libre</li>
                            <li>Evitar ejercitarse al aire libre o en interiores que no cuenten con sistemas de purificación de aire</li>
                            <li>Cerrar puertas y ventanas</li>
                            <li>Personas vulnerables permanecer en interiores sin actividad física</li>
                            <li>Acudir al médico o solicitar servicios de emergencias en caso de síntomas de afectaciones a la salud</li>
                            <li>Evitar fogatas y uso de combustibles sólidos como carbón o leña</li>
                            <li>Se recomienda fuertemente el uso de mascarillas reutilizables N95 con certificación NIOSH*</li>
                            <li>Suspender entrenamientos y partidos de ligas deportivas y actividades físicas extracurriculares</li>
                            <li>Suspender el uso de cigarros de cualquier tipo</li>
                            <li>Limitar el uso de vehículos que usen combustibles fósiles</li>
                            <li>Permanece en espacios interiores en donde puedes realizar actividades físicas.</li>
                            <li>Reprograma tus actividades al aire libre y si presentas síntomas respiratorios y/o cardiacos acude al médico.</li>
                            <li>Infórmate sobre la evolución de la calidad del aire.</li>
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
