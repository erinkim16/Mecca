/*
  Warnings:

  - Added the required column `reporterId` to the `BlogReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reporterId` to the `CommentReport` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reporterId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "blogId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlogReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BlogReport_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BlogReport" ("blogId", "createdAt", "id", "reason") SELECT "blogId", "createdAt", "id", "reason" FROM "BlogReport";
DROP TABLE "BlogReport";
ALTER TABLE "new_BlogReport" RENAME TO "BlogReport";
CREATE TABLE "new_CommentReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reporterId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CommentReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentReport_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CommentReport" ("commentId", "createdAt", "id", "reason") SELECT "commentId", "createdAt", "id", "reason" FROM "CommentReport";
DROP TABLE "CommentReport";
ALTER TABLE "new_CommentReport" RENAME TO "CommentReport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
