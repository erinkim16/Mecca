import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../../utils/account/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {

    if (req.method !== "POST"){
        return res.status(405).json({ error: "Method not allowed"});
    }

    const authHeader = req.headers.authorization;
    const user = verifyAccessToken(authHeader);

    if (!user) {
        return res.status(401).json({ error: "Unauthorized user" });
    }

    const { id } = req.query;
    const { reason } = req.body;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid or missing blog ID" });
      }

    let report;

    try {
        report = await prisma.blogReport.create({
            data: {
                reason: JSON.stringify({ reason }),
                blog: {
                    connect: { id: parseInt(id) },
                },
                reporter: {
                    connect: { id: user.id },
                },
            },
        });
        
        return res.status(200).json({ message: "Blog has been reported successfully", report });

    } catch (error) {
        return res.status(500).json( { error: "Blog could not be reported"});
    }

}