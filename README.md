# CEI

Página web principal para monitoreo de calidad del aire.
https://aire.comiteecologicointegral.org/

## Instalación

```
npm install
```

## Correr en ambiente dev

Para esto también hay que tener cei-dashboard corriendo localmente en el puerto 8000.

```
nmp start
```

## Actions

El archivo de `deployment.yml` se encarga de:

1. Buildear la imagen del contenedor
2. Pushear la imagen al repositorio de DockerHub
3. Conectarse al VPS
4. Pullear la nueva imagen
5. Detener y eliminar la imagen anterior
6. Correr la nueva imagen

En la sección de `secrets` de este repositorio se tienen que especificar las
credenciales del DockerHub, asi como el usuario, host y contraseña del VPS.

No es posible editar estos valores una vez se settean, así que tienen que
borrarse y agregar de nuevo con los valores actualizados si se quiere
utilizar otro VPS o cuenta de DockerHub.

## Deployeo manual

### Construir y pushear la imagen

En folder root del proyecto

```
docker build -t haiwave/cei-repo:front .
docker push haiwave/cei-repo:front
```

Si el contenedor se buildea desde una máquina con una arquitectura distinta
al del VPS donde se deployeara, se necesita especificar la plataforma target.
Por ejemplo, si se buildea el contenedor desde una computadora con un chip
M1 y el VPS utiliza una arquitectura amd64, haríamos lo siguiente:

```
docker buildx build --platform linux/amd64 -t haiwave/cei-repo:front .
```

NOTA: Dependiendo de cual usuario se este utilizando, `haiwave`
tiene que cambiarse, y es necesario autenticarse con ese usuario con el comando
`docker login` antes de intentar pushear al repositorio

### Correr contenedor en VPS

SSH al VPS y se hace pull de la imagen

```
docker pull haiwave/cei-repo:front
```

Nuevamente, si el repositorio es privado tiene que hacerse `docker login`
primero.

Se detiene y elimina el contenedor viejo y se inicia el nuevo

```
docker stop cei-app
docker rm cei-app
docker run -d -p 9000:80 --name cei-app haiwave/cei-repo:front
```

### Proxy del VPS

El nombre del contenedor no importa mientras corra en el puerto correcto.
En caso de que se necesite/quiera cambiar el puerto a donde se hace
el proxy, es necesario cambiar la configuración de NGINX.

En el archivo `/etc/nginx/sites-available/default`

```
    location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		# root /srv/cei-site/build;
		# try_files $uri /index.html;
		proxy_pass http://localhost:9000;
	}
```

el `proxy_pass` debe ser cambiado para que apunte al puerto deseado.
