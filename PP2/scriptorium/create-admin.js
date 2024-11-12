import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { hashPassword } from "./utils/account/auth.js";

try {
  const newUser = await prisma.user.create({
    data: {
      username: "admin",
      password: await hashPassword("admin"),
      firstName: "",
      lastName: "",
      email: "admin@localhost",
      avatar: 1, 
      role: "ADMIN"
    },
  });
} catch (error) {
  if (error.code === "P2002") {
    console.log("Admin already exists. Skipping creation.");
  } else {
    console.error("Error creating admin user:", error);
  }
}

