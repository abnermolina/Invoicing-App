-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "buildingName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "adress" TEXT NOT NULL,
    "invoiceNum" TEXT NOT NULL,
    "serviceDescription" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
