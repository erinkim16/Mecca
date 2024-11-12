import { PrismaClient } from "@prisma/client";
import adminMiddleware from "../../../pages/api/admin/protected";

/**
 * Allow admins to retrieve inappropriate blogs and mark them as hidden as needed
 */

const prisma = new PrismaClient();

export default async function handler(req, res){
    await adminMiddleware(req, res);

    // return if the user is not authorized
    if (res.headersSent){
        return;
    }

    /**
     * Get the blogposts from most to least reports
     */
    if (req.method === 'GET') {
        try {
            const blogPosts = await prisma.blogPost.findMany({
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
          
            res.status(200).json(blogPosts);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch reports'});
        }

    /**
     * Change blog to hidden
     * @param{Int} blogID - blog to be hidden
     * @returns - blog specified should now have a hidden status
     */

    } else if (req.method === 'PUT') {
        const { blogId }  = req.body
        try {
            await prisma.blogPost.update({
                where: { id: parseInt(blogId) },
                data: { hidden: true },
                });
            res.status(200).json( { message: 'Content hidden successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Could not hide content'});
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}