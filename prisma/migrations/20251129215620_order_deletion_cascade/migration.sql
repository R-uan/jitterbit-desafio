-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_orderId_fkey";

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;
