import { PrismaClient } from "@prisma/client";
import adminMiddleware from "../../../pages/api/admin/protected";

/**
 * Allow admins to retrieve inappropriate comments and mark them as hidden as needed
 */

const prisma = new PrismaClient();

export default async function handler(req, res){
    await adminMiddleware(req, res);

    // return if the user is not authorized
    if (res.headersSent){
        return;
    }
    /**
     * Get all the inappropriate comments from most to least reports
     */
    if (req.method === 'GET') {
        try {
            const comments = await prisma.comment.findMany({
                include: {
                    _count: {
                        select: { reports: true },
                    },
                },
    
                orderBy: {
                    reports: {
                        _count: 'desc',
                    },
                },
            });
            res.status(200).json(comments);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch reports'})
        }

    /**
     * Change comment to hidden
     * @param{Int} commentID - comment to be hidden
     * @returns - comment specified should now have a hidden status
     */
    } else if (req.method === 'PUT'){
        const { commentId }  = req.body
        try {
            await prisma.comment.update({
                where: { id: commentId },
                data: { hidden: true },
                });
            res.status(200).json( { message: 'Content hidden successfully' });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Could not hide content'});
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}