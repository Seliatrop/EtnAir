-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "hashPassword" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
