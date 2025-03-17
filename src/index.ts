import express from 'express';
import { logger } from './common/logger';
import { pokemonRouter } from './pokemons/pokemons.router';
import { userRouter } from './users/users.router';
import YAML from 'yamljs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { pokemonAttacksRouter } from './pokemon_attacks/pokemon_attacks.router';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/pokemons-cards', pokemonRouter);
app.use('/users', userRouter);
app.use('/pokemon-attacks', pokemonAttacksRouter);

export const server = app.listen(port);

export function stopServer() {
  server.close();
}
