import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {
      role: 'ADMIN', // Make Sarah an admin
      featured: true, // Make Sarah a featured author
    },
    create: {
      email: 'sarah@example.com',
      password: hashedPassword,
      name: 'Sarah Chen',
      bio: 'Sarah is a nature poet who finds inspiration in the quiet moments of dawn.',
      website: 'https://sarahchen.poetry.com',
      role: 'ADMIN', // Make Sarah an admin
      featured: true, // Make Sarah a featured author
    },
  })

  const marcus = await prisma.user.upsert({
    where: { email: 'marcus@example.com' },
    update: {
      featured: true, // Make Marcus a featured author
    },
    create: {
      email: 'marcus@example.com',
      password: hashedPassword,
      name: 'Marcus Johnson',
      bio: 'Urban poet capturing the rhythm of city life.',
      featured: true, // Make Marcus a featured author
    },
  })

  const elena = await prisma.user.upsert({
    where: { email: 'elena@example.com' },
    update: {
      featured: false, // Elena is not featured initially
    },
    create: {
      email: 'elena@example.com',
      password: hashedPassword,
      name: 'Elena Rodriguez',
      bio: 'Ocean lover and poet of the waves.',
      featured: false, // Elena is not featured initially
    },
  })

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'nature' } }),
    prisma.tag.create({ data: { name: 'morning' } }),
    prisma.tag.create({ data: { name: 'peace' } }),
    prisma.tag.create({ data: { name: 'urban' } }),
    prisma.tag.create({ data: { name: 'night' } }),
    prisma.tag.create({ data: { name: 'ocean' } }),
    prisma.tag.create({ data: { name: 'memories' } }),
    prisma.tag.create({ data: { name: 'autumn' } }),
  ])

  // Create poems
  const morningDew = await prisma.poem.create({
    data: {
      title: 'Morning Dew',
      content: `Gentle drops upon the grass,
Morning whispers as they pass,
Each one holds the sky so blue,
In this moment, fresh and new.

Nature's tears of joy and light,
Washing clean the darkest night,
In the silence, peace is found,
Where the earth and sky are bound.`,
      category: 'Lyric',
      authorId: sarah.id,
      readingTime: 2,
      status: 'PUBLISHED', // Publish the poem
      publishedAt: new Date(),
    },
  })

  const cityLights = await prisma.poem.create({
    data: {
      title: 'City Lights',
      content: `Neon dreams and midnight schemes,
Electric pulse through urban streams,
Glass and steel reach for the stars,
While below rush endless cars.

In the maze of concrete towers,
Hearts beat through the restless hours,
City lights like fallen stars,
Illuminate our urban scars.`,
      category: 'Modern',
      authorId: marcus.id,
      readingTime: 2,
      status: 'PUBLISHED', // Publish the poem
      publishedAt: new Date(),
    },
  })

  const oceanSong = await prisma.poem.create({
    data: {
      title: "Ocean's Song",
      content: `Waves that dance upon the shore,
Singing songs of days before,
Salt and spray and endless blue,
Ancient rhythms, ever new.

Tides that ebb and tides that flow,
Secrets that the deep ones know,
In the ocean's vast embrace,
Find the soul its rightful place.`,
      category: 'Lyric',
      authorId: elena.id,
      readingTime: 2,
      status: 'PUBLISHED', // Publish the poem
      publishedAt: new Date(),
    },
  })

  // Connect poems to tags
  await prisma.poemTag.createMany({
    data: [
      { poemId: morningDew.id, tagId: tags[0].id }, // nature
      { poemId: morningDew.id, tagId: tags[1].id }, // morning
      { poemId: morningDew.id, tagId: tags[2].id }, // peace
      { poemId: cityLights.id, tagId: tags[3].id }, // urban
      { poemId: cityLights.id, tagId: tags[4].id }, // night
      { poemId: oceanSong.id, tagId: tags[0].id }, // nature
      { poemId: oceanSong.id, tagId: tags[5].id }, // ocean
    ],
  })

  // Create some comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'This poem beautifully captures the serenity of morning. The imagery is so vivid I can almost feel the dewdrops.',
        authorId: marcus.id,
        poemId: morningDew.id,
      },
      {
        content: "Sarah's use of metaphor here is exceptional. 'Nature's tears of joy' - what a beautiful way to describe dew.",
        authorId: elena.id,
        poemId: morningDew.id,
      },
      {
        content: 'The rhythm of this poem perfectly matches the pulse of city life. Well done!',
        authorId: sarah.id,
        poemId: cityLights.id,
      },
    ],
  })

  // Create some likes
  await prisma.like.createMany({
    data: [
      { userId: marcus.id, poemId: morningDew.id },
      { userId: elena.id, poemId: morningDew.id },
      { userId: sarah.id, poemId: cityLights.id },
      { userId: elena.id, poemId: cityLights.id },
      { userId: sarah.id, poemId: oceanSong.id },
      { userId: marcus.id, poemId: oceanSong.id },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Created ${await prisma.user.count()} users`)
  console.log(`Created ${await prisma.poem.count()} poems`)
  console.log(`Created ${await prisma.tag.count()} tags`)
  console.log(`Created ${await prisma.comment.count()} comments`)
  console.log(`Created ${await prisma.like.count()} likes`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })