/*
  Warnings:

  - A unique constraint covering the columns `[userID,blogPostID]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID,commentID]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_userID_blogPostID_key" ON "Rating"("userID", "blogPostID");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userID_commentID_key" ON "Rating"("userID", "commentID");
