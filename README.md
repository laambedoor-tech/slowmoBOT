# slowmoBOT

Bot de Discord para la web, hecho en TypeScript con [discord.js](https://discord.js.org) v14.

## Estructura del proyecto

```
src/
  buttons/       -> handlers de botones (ej. futuros botones del panel de tickets)
  commands/      -> comandos slash (/)
  events/        -> eventos del cliente de Discord
  handlers/      -> carga automatica de comandos y botones
  types/         -> tipos compartidos
  client.ts      -> cliente de Discord extendido (colecciones de comandos/botones)
  config.ts      -> lectura y validacion de variables de entorno
  deploy-commands.ts -> script para registrar los comandos slash en Discord
  index.ts       -> punto de entrada del bot
data/            -> almacenamiento local (json) para features futuras, ignorado por git
```

Ahora mismo el bot solo trae un comando de ejemplo (`/ping`) para verificar que todo funciona. El panel de tickets y el resto de funciones se agregan sobre esta base una vez me confirmes como los querés.

## Puesta en marcha

1. Instalar dependencias:
   ```
   npm install
   ```
2. Copiar `.env.example` a `.env` y completar los valores:
   ```
   DISCORD_TOKEN=...
   CLIENT_ID=...
   GUILD_ID=...
   ```
3. Registrar los comandos slash (hay que repetirlo cada vez que agregues/edites un comando):
   ```
   npm run deploy
   ```
4. Arrancar en modo desarrollo (recarga automática):
   ```
   npm run dev
   ```
5. Para producción:
   ```
   npm run build
   npm start
   ```

## Como agregar un comando nuevo

Crear un archivo en `src/commands/`, exportando un objeto `Command` (mirar `ping.ts` de ejemplo) y correr `npm run deploy` de nuevo.

## Como agregar un boton nuevo

Crear un archivo en `src/buttons/`, exportando un objeto `ButtonHandler` con `customId` y `execute`. Si el `customId` real incluye datos dinámicos (ej. `ticket_close_123`), el router hace match por prefijo automáticamente.
