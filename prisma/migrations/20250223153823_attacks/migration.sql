-- CreateTable
CREATE TABLE "PokemonAttack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "damages" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    CONSTRAINT "PokemonAttack_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
