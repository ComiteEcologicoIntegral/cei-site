import { Nav, NavLink, Tab } from 'react-bootstrap'

const Recomendaciones = () => {
    return (
        <div className="container mt-5 mb-3">
            <div className="ta-center mb-5">
                <h3>Índice de Calidad del aire</h3>
                <p>Conoce las recomendaciones según el índice de calidad del aire</p>
            </div>
            <Tab.Container fill defaultActiveKey="buena" className="recomendaciones h-100">
                <Nav fill>
                    <Nav.Item>
                    <NavLink eventKey="buena" className="nav-buena">Buena</NavLink>
                    </Nav.Item>
                    <Nav.Item>
                    <NavLink eventKey="acept" className="nav-acept">Aceptable</NavLink>
                    </Nav.Item>
                    <Nav.Item>
                    <NavLink eventKey="mala" className="nav-mala">Mala</NavLink>
                    </Nav.Item>
                    <Nav.Item>
                    <NavLink eventKey="muy" className="nav-muy">Muy Mala</NavLink>
                    </Nav.Item>
                    <Nav.Item>
                    <NavLink eventKey="ext" className="nav-ext">Extremadamente Mala</NavLink>
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
                        <li>Personas vulnerables limitar actividades físicas</li>
                    </ul>
                    </Tab.Pane>
                    <Tab.Pane eventKey="mala">
                    <ul>
                        <li>Limitar actividades físicas al aire libre, incrementar frecuencia de descansos, vigilar que estudiantes no presenten síntomas de afecciones respiratorias.</li>
                        <li>Limitar tiempo de exposición</li>
                        <li>Personas vulnerables permanecer en interiores sin actividad física</li>
                        <li>Considerar suspender entrenamientos y partidos de ligas deportivas y actividades físicas extracurriculares</li>
                        <li>Se recomienda el uso de mascarillas reutilizables N95 con certificación NIOSH*</li>
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
                    </ul>  
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    )
}

export default Recomendaciones
