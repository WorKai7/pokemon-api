import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.type.deleteMany();
  await prisma.pokemonCard.deleteMany();
  await prisma.pokemonAttack.deleteMany();

  await prisma.$executeRaw `DELETE FROM sqlite_sequence WHERE name='Type'`;
  await prisma.$executeRaw `DELETE FROM sqlite_sequence WHERE name='PokemonCard'`;
  await prisma.$executeRaw `DELETE FROM sqlite_sequence WHERE name='User'`;
  await prisma.$executeRaw `DELETE FROM sqlite_sequence WHERE name='PokemonAttack'`;

  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });

  await prisma.pokemonAttack.createMany({
    data: [
      {
        name: "Flammeche",
        damages: 40,
        typeId: 2, // Type: Feu
      },
      {
        name: "Hydrocanon",
        damages: 110,
        typeId: 3, // Type: Eau
      },
      {
        name: "Lance-Soleil",
        damages: 120,
        typeId: 4, // Type: Plante
      },
      {
        name: "Tonnerre",
        damages: 110,
        typeId: 5, // Type: Électrik
      },
      {
        name: "Laser Glace",
        damages: 90,
        typeId: 6, // Type: Glace
      },
      {
        name: "Poing-Karaté",
        damages: 50,
        typeId: 7, // Type: Combat
      },
      {
        name: "Dracosouffle",
        damages: 60,
        typeId: 15, // Type: Dragon
      },
      {
        name: "Ball'Ombre",
        damages: 80,
        typeId: 14, // Type: Spectre
      },
      {
        name: "Éclat Magique",
        damages: 80,
        typeId: 18, // Type: Fée
      },
      {
        name: "Séisme",
        damages: 100,
        typeId: 9, // Type: Sol
      }
    ],
  });

  await prisma.pokemonCard.createMany({
    data: [
      {
        name: "Dracaufeu",
        pokedexId: 6,
        typeId: 2,
        lifePoints: 78,
        size: 1.7,
        weight: 90.5,
        imageUrl: "https://www.pokepedia.fr/images/thumb/1/17/Dracaufeu-RFVF.png/250px-Dracaufeu-RFVF.png",
        attackId: 1
      },
      {
        name: "Taupiqueur",
        pokedexId: 50,
        typeId: 9,
        lifePoints: 10,
        size: 0.2,
        weight: 0.8,
        imageUrl: "https://www.pokepedia.fr/images/thumb/a/aa/Taupiqueur-RFVF.png/250px-Taupiqueur-RFVF.png",
        attackId: 10
      },
      {
        name: "Mammochon",
        pokedexId: 473,
        typeId: 6,
        lifePoints: 110,
        size: 2.5,
        weight: 291.0,
        imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png",
        attackId: 5
      }
    ],
  });

  await prisma.user.create({
    data: {
      email: "admin@admin.admin",
      password: await bcrypt.hash("admin", 10)
    }
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
