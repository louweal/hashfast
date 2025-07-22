import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Create sample users
    const link1 = await prisma.user.upsert({
        where: { email: "hellohashfast@gmail.com" },
        update: {},
        create: {},
    });

    console.log("Database seeded successfully!");
    console.log({ link1 });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
