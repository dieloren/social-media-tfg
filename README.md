# Laravel Social Media TFG

## Instalacion con docker
1. Clona el repositorio
   `git clone https://github.com/dieloren/social-media-tfg.git`
2. Ve a la carpeta del proyecto y ejecuta el siguiente comando
```bash
docker run --rm \
-u "$(id -u):$(id -g)" \
-v "$(pwd):/var/www/html" \
-w /var/www/html \
laravelsail/php83-composer:latest \
composer install --ignore-platform-reqs
```

3. Copia .env.example en un .env
   `cp .env.example .env`
4. Arranca el proyecto en modo desatendido
   `./vendor/bin/sail up -d`

5. Entra en el contenedor del proyecto `./vendor/bin/sail bash`

6. Prepara la clave de encriptacion
   `php artisan key:generate --ansi`

7. Ejecuta las migraciones de la base de datos
   `php artisan migrate`

8. Instala las dependencias de node
   `npm install`

9. Compila los assets
   `npm run dev`
10. Accede a la web en http://localhost y registrate en https://localhost/register
11. Acepta el email de verificacion en http://localhost:8025/
12. Accede a la web
