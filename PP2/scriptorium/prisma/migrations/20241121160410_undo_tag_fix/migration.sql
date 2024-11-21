/*
  Warnings:

  - You are about to drop the column `blogPostId` on the `Tag` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tag" (
    "name" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Tag" ("name") SELECT "name" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
