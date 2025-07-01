# CEI

Web app para monitoreo de calidad del aire.
https://aire.comiteecologicointegral.org/

## Dependencias para desarrollo local

[nodejs](https://nodejs.org/es/download)

## Instalación y Ejecución

```bash
# Guía rápida
gh repo clone ComiteEcologicoIntegral/cei-site
cd cei-site
# asuming you already have the .env file under ~/Downloads
mv ~/Downloads/.env .
npm install
npm start
```

1. Clona el repositorio usando tu método preferido.
   La forma más sencilla es usar [github cli](https://cli.github.com/).

```bash
gh repo clone ComiteEcologicoIntegral/cei-site
```

2. Pide a un miembro del equipo una copia del archivo `.env`, descárgalo y colócalo en el directorio del proyecto.

```bash
cd cei-site
# Sustituye la primera ruta con la ruta del archivo .env que acabas de descargar
mv ~/Downloads/.env .
```

3. Instala las dependencias

```bash
npm install
```

4. Ejecuta el proyecto

```bash
npm start
```

Una ventana con la direccion localhost:3000 deberia abrirse en tu navegador.
Si no se abre automaticamente, hazlo manualmente.
