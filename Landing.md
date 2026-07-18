# Documentación de la Landing Page

## Contexto del desarrollo

Desarrollé la landing page completa para el proyecto CEI (Comité Ecológico Integral), que es una aplicación de monitoreo de calidad del aire en tiempo real para el Área Metropolitana de Monterrey. Este es un proyecto solidario con el servicio social del TEC de Monterrey.

El coordinador del proyecto me pidió enfocarme específicamente en el diseño frontend y la experiencia de usuario, sin tocar funcionalidades backend por el momento. La idea principal era crear una página de inicio que fuera útil, informativa y visualmente profesional, manteniendo coherencia con el resto de la aplicación.

## Archivos creados y modificados

Trabajé principalmente en tres archivos:

### 1. src/Pages/Landing/landing.jsx

Este es el componente principal de la landing page. Decidí estructurarlo en varias secciones bien definidas porque quería que el usuario tuviera una experiencia progresiva al navegar por la página.

Empecé importando los hooks y componentes necesarios. Utilicé `react-router-dom` para los enlaces de navegación y `react-icons` para los íconos, que ya estaban siendo usados en otras partes del proyecto, así que mantuve la consistencia.

Creé un hook personalizado llamado `useLandingData` que maneja toda la lógica de obtención de datos. Esto lo hice porque quería separar la lógica de negocio de la presentación, siguiendo buenas prácticas de React.

La estructura del componente quedó así:

**Hero section**: Aquí coloqué el logo del CEI de forma prominente, el título principal y el selector de zona. Originalmente había puesto un fondo verde degradado igual que el navbar, pero después de revisar la interfaz me di cuenta de que se veía muy saturado de verde, así que cambié a un fondo gris claro (gradiente de #f8f9fa a #e9ecef). Esto ayuda a que el usuario distinga claramente entre el navbar y el contenido principal.

**Dashboard principal**: Esta es la sección más importante. Muestra el índice de calidad del aire de la zona seleccionada con un indicador grande y código de colores que cambia dinámicamente según el nivel de contaminación. Usé clases CSS específicas para cada status (buena, aceptable, mala, muy mala, extremadamente mala) que aplican diferentes gradientes de color. Incluí también un timestamp para que el usuario sepa qué tan recientes son los datos.

**Grid de contaminantes**: Aquí muestro los seis contaminantes principales (PM10, PM2.5, O3, CO, NO2, SO2) en tarjetas individuales. Cada tarjeta muestra el valor, la unidad de medida y un badge con el status de calidad. Configuré el grid para que en desktop se muestren las seis tarjetas en una sola fila horizontal, en tablet se agrupen en tres columnas, y en móvil en dos columnas. Esto lo hice pensando en que el usuario necesita poder comparar rápidamente todos los contaminantes.

**Sección de acceso rápido**: Agregué cuatro tarjetas con enlaces a las principales funcionalidades de la aplicación (Mapa, Calendario, Histórico, Recomendaciones). Cada tarjeta tiene un ícono, título y descripción breve. Estas también se alinean horizontalmente en desktop y se adaptan en dispositivos más pequeños.

**Sección educativa**: Al final incluí información básica sobre qué es la calidad del aire y los contaminantes. Esta sección tiene tres tarjetas informativas y un botón de call-to-action que lleva a la página de conceptos completa. La idea era que los usuarios nuevos pudieran entender rápidamente de qué trata el proyecto.

Para el manejo de estados, implementé verificaciones para cuando no hay zona seleccionada o cuando no hay datos disponibles, mostrando mensajes apropiados en cada caso.

### 2. src/hooks/useLandingData.js

Este hook personalizado fue necesario porque el proceso de obtener y procesar datos de sensores es complejo y no quería saturar el componente principal con esa lógica.

El hook maneja cuatro estados principales: loading, zones, selectedZone y zoneData.

**Obtención de zonas**: En el primer useEffect, llamo a `getSystemSensorsMetadata` para obtener todos los sensores del sistema AireNuevoLeon. Luego agrupo estos sensores por zona. Aquí tuve un problema inicial porque los sensores que venían del API no tenían el campo `Address.zone` que yo esperaba, así que tuve que hacer el código más robusto para que intentara obtener la zona de varios campos posibles (zone, Zone, city, City, etc.).

Implementé un fallback a datos mock cuando el API no responde o no devuelve datos. Esto es importante porque durante el desarrollo el API no siempre está disponible, y quería que el frontend se pudiera probar independientemente. Los datos mock incluyen cuatro zonas: Guadalupe, Monterrey, San Pedro y San Nicolás, cada una con valores realistas pero diferentes de contaminantes.

**Obtención de datos de zona**: El segundo useEffect se ejecuta cada vez que cambia la zona seleccionada. Obtiene los índices de contaminación de todos los sensores en esa zona y calcula promedios. Aquí también implementé el fallback a datos mock.

**Procesamiento de datos**: Creé la función `calculateZoneAverages` que toma los datos crudos de múltiples sensores y calcula promedios para cada contaminante. Esta función tuvo que ser especialmente robusta porque los datos mock y los datos reales del API tienen estructuras ligeramente diferentes. Los datos mock usan nombres en minúsculas (pm10, pm25) mientras que el código espera mayúsculas (PM10, PM25), así que agregué lógica para manejar ambos casos.

También implementé `getMostCriticalStatus` que determina cuál es el status más crítico de una lista. Esto es importante porque si tienes varios sensores en una zona con diferentes status, necesitas mostrar el más crítico para alertar al usuario.

**Datos mock**: Definí constantes MOCK_ZONES fuera del componente para evitar warnings de React sobre dependencias en useEffect. Cada zona mock tiene valores diferentes para dar variedad y permitir probar cómo se ve la interfaz con diferentes niveles de calidad del aire.

### 3. src/Pages/Landing/Landing.css

Este archivo contiene todos los estilos de la landing page. Opté por crear un archivo CSS dedicado en lugar de usar CSS-in-JS o módulos CSS porque el proyecto ya sigue este patrón y quería mantener la consistencia.

**Sistema de colores**: Usé las variables CSS que ya estaban definidas en el proyecto (--bg-asparagus, --color-buena, --color-mala, etc.). Esto asegura que los colores sean consistentes en toda la aplicación.

**Hero section**: Como mencioné antes, cambié el fondo de verde a gris claro. El título principal usa el color verde asparagus para mantener la identidad visual. Agregué un borde verde al logo en lugar de blanco para que contraste mejor con el nuevo fondo.

**Selector de zona**: Inicialmente era un select básico, pero después le agregué un borde verde de 2px y sombra para que resalte del fondo gris. También agregué estados hover y focus con sombras más pronunciadas para dar feedback visual al usuario. Finalmente personalicé la flecha del select usando un SVG inline con el color verde del proyecto, eliminando la apariencia nativa del navegador para tener más control sobre el diseño.

**Dashboard**: La tarjeta principal tiene sombras suaves y un efecto hover que la levanta ligeramente (translateY). El indicador grande de calidad del aire usa gradientes de color según el status. Por ejemplo, "Buena" tiene un gradiente de verde claro a verde, "Mala" usa naranja, etc.

**Grids responsivos**: Este fue uno de los aspectos más importantes. Para los contaminantes, usé `grid-template-columns: repeat(6, 1fr)` en desktop, que crea exactamente 6 columnas del mismo tamaño. En tablet (max-width: 768px) cambio a 3 columnas, y en móvil pequeño (max-width: 480px) a 2 columnas. Lo mismo hice con el grid de acceso rápido pero con 4 columnas base.

**Animaciones**: Implementé tres animaciones usando keyframes:
- fadeIn: Para elementos que aparecen gradualmente
- slideDown: Para el título que baja desde arriba
- slideUp: Para elementos que suben desde abajo

Estas animaciones tienen duraciones diferentes (0.8s, 0.9s, 1s) para crear un efecto de cascada cuando carga la página.

**Tarjetas de contaminantes**: Cada tarjeta tiene un fondo gris claro (#f8f9fa) y un borde transparente que se vuelve verde al hacer hover. Los valores de los contaminantes usan colores dinámicos según su status, aplicados inline desde el componente React.

**Estados de loading**: Creé un spinner CSS puro usando animación de rotación. Esto es mejor que usar una imagen porque no requiere carga adicional y es más liviano.

**Responsive design**: Trabajé mobile-first en mi mente pero implementé desktop-first en el código porque la mayoría de usuarios del proyecto probablemente accederán desde computadoras. Usé tres breakpoints principales: 768px para tablets, 480px para móviles, y ajustes específicos para pantallas muy pequeñas.

## Decisiones técnicas importantes

**Uso de datos mock**: Implementé un sistema completo de fallback a datos mock porque durante el desarrollo el API no estaba devolviendo datos. Esto permite que el frontend se desarrolle y pruebe independientemente del backend.

**Separación de responsabilidades**: Mantuve la lógica de datos en un hook separado y los estilos en un archivo CSS aparte. El componente principal solo se encarga de renderizar y orquestar.

**Manejo de errores**: Agregué logs en consola estratégicos para debugging. También implementé mensajes de error amigables cuando no hay zonas disponibles o cuando no se pueden cargar datos.

**Accesibilidad**: Agregué labels con htmlFor en el selector, aria-labels donde son necesarios, y me aseguré de que todos los elementos interactivos tengan feedback visual claro.

**Performance**: Usé transiciones CSS en lugar de JavaScript para las animaciones porque son más eficientes. También optimicé las imágenes usando el logo que ya existe en public.

## Resultado final

La landing page quedó completamente funcional y responsiva. Muestra datos en tiempo real cuando el API funciona, y datos mock realistas cuando no. El diseño es limpio, profesional y coherente con el resto de la aplicación. La experiencia de usuario es fluida con animaciones sutiles y feedback visual claro en todas las interacciones.

El código está estructurado de manera que sea fácil de mantener y extender. Por ejemplo, si en el futuro se necesita agregar más contaminantes o cambiar la forma de calcular los promedios, solo hay que modificar el hook sin tocar el componente de presentación.
