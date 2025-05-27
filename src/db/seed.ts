import { PrismaClient, Prisma } from "./generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = "secretSUPERpassword";
  const hashedPassword = await bcrypt.hash(password, 10);

  const userData: Prisma.UserCreateInput[] = [
    {
      email: "alice@prisma.io",
      password: hashedPassword,
    },
  ];

  for (const user of userData) {
    await prisma.user.create({ data: user });
  }
}

main().finally(() => prisma.$disconnect());
