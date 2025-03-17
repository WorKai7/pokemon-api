/*
  Warnings:

  - Made the column `lifePoints` on table `PokemonCard` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `PokemonCard` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pokedexId` on table `PokemonCard` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PokemonCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pokedexId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "lifePoints" INTEGER NOT NULL,
    "size" REAL,
    "weight" REAL,
    "imageUrl" TEXT,
    CONSTRAINT "PokemonCard_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PokemonCard" ("id", "imageUrl", "lifePoints", "name", "pokedexId", "size", "typeId", "weight") SELECT "id", "imageUrl", "lifePoints", "name", "pokedexId", "size", "typeId", "weight" FROM "PokemonCard";
DROP TABLE "PokemonCard";
ALTER TABLE "new_PokemonCard" RENAME TO "PokemonCard";
CREATE UNIQUE INDEX "PokemonCard_name_key" ON "PokemonCard"("name");
CREATE UNIQUE INDEX "PokemonCard_pokedexId_key" ON "PokemonCard"("pokedexId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
