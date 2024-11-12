/*
  Warnings:

  - You are about to drop the column `authorID` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `blogID` on the `BlogReport` table. All the data in the column will be lost.
  - You are about to drop the column `authorID` on the `CodeTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `authorID` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `blogPostID` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `hidden` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `parentID` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `commentID` on the `CommentReport` table. All the data in the column will be lost.
  - You are about to drop the column `blogPostID` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `commentID` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `Rating` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blogId` to the `BlogReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `CodeTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blogPostId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentId` to the `CommentReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BlogPost" ("content", "createdAt", "description", "hidden", "id", "title") SELECT "content", "createdAt", "description", "hidden", "id", "title" FROM "BlogPost";
DROP TABLE "BlogPost";
ALTER TABLE "new_BlogPost" RENAME TO "BlogPost";
CREATE TABLE "new_BlogReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reason" TEXT NOT NULL,
    "blogId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlogReport_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BlogReport" ("createdAt", "id", "reason") SELECT "createdAt", "id", "reason" FROM "BlogReport";
DROP TABLE "BlogReport";
ALTER TABLE "new_BlogReport" RENAME TO "BlogReport";
CREATE TABLE "new_CodeTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "codeId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isForked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CodeTemplate_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Code" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CodeTemplate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CodeTemplate" ("codeId", "createdAt", "explanation", "id", "isForked", "title", "updatedAt") SELECT "codeId", "createdAt", "explanation", "id", "isForked", "title", "updatedAt" FROM "CodeTemplate";
DROP TABLE "CodeTemplate";
ALTER TABLE "new_CodeTemplate" RENAME TO "CodeTemplate";
CREATE UNIQUE INDEX "CodeTemplate_codeId_key" ON "CodeTemplate"("codeId");
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "blogPostId" INTEGER NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("content", "id") SELECT "content", "id" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");
CREATE TABLE "new_CommentReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reason" TEXT NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CommentReport_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CommentReport" ("createdAt", "id", "reason") SELECT "createdAt", "id", "reason" FROM "CommentReport";
DROP TABLE "CommentReport";
ALTER TABLE "new_CommentReport" RENAME TO "CommentReport";
CREATE TABLE "new_Rating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "blogPostId" INTEGER,
    "commentId" INTEGER,
    "rating" INTEGER NOT NULL,
    CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rating_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Rating" ("id", "rating") SELECT "id", "rating" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
CREATE UNIQUE INDEX "Rating_userId_blogPostId_key" ON "Rating"("userId", "blogPostId");
CREATE UNIQUE INDEX "Rating_userId_commentId_key" ON "Rating"("userId", "commentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
