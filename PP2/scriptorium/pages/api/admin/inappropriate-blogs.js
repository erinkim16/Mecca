import { PrismaClient } from "@prisma/client";
import adminMiddleware from "../../../pages/api/admin/protected";

/**
 * Allow admins to retrieve inappropriate blogs and mark them as hidden as needed
 */

const prisma = new PrismaClient();

export default async function handler(req, res) {
  await adminMiddleware(req, res);

  // return if the user is not authorized
  if (res.headersSent) {
    return;
  }

  /**
   * Get the blogposts from most to least reports
   */
  // if (req.method === 'GET') {
  //     try {
  //         const blogPosts = await prisma.blogPost.findMany({
  //             include: {
  //                 _count: {
  //                     select: { reports: true },
  //                 },
  //             },
  //             orderBy: {
  //                 reports: {
  //                     _count: 'desc',
  //                 },
  //             },
  //         });

  //         res.status(200).json(blogPosts);
  //     } catch (error) {
  //         res.status(500).json({ error: 'Failed to fetch reports'});
  //     }

  // /**
  //  * Change blog to hidden
  //  * @param{Int} blogID - blog to be hidden
  //  * @returns - blog specified should now have a hidden status
  //  */

  // }

  if (req.method === "GET") {
    const { page = 1, perPage = 10 } = req.query; // Defaults

    const skip = (page - 1) * perPage;
    const take = parseInt(perPage);

    try {
      const [blogPosts, totalCount] = await prisma.$transaction([
        prisma.blogPost.findMany({
          skip,
          take,
          where: { hidden: false },
          include: {
            _count: { select: { reports: true } },
          },
          orderBy: { reports: { _count: "desc" } },
        }),
        prisma.blogPost.count({ where: { hidden: false } }),
      ]);

      const posts = blogPosts.map((post) => ({
        id: post.id,
        title: post.title,
        description: post.description,
        createdAt: post.createdAt,
        reportsCount: post._count.reports,
        hidden: post.hidden,
      }));

      res.status(200).json({
        posts,
        totalPages: Math.ceil(totalCount / take),
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  } else if (req.method === "PUT") {
    const { blogId } = req.body;
    try {
      await prisma.blogPost.update({
        where: { id: parseInt(blogId) },
        data: { hidden: true },
      });
      res.status(200).json({ message: "Content hidden successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not hide content" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
