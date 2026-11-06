import { db } from "./offline-db";
import { supabase } from "./supabase";

export async function syncOfflineSales() {
  const sales = await db.offlineSales
    .filter((sale) => sale.synced === false)
    .toArray();

  console.log("OFFLINE SALES FOUND:", sales);

  for (const sale of sales) {
    try {
      console.log("SYNCING SALE:", sale);

      const {
        data: newSale,
        error: saleError,
      } = await supabase
        .from("sales")
        .insert({
          cashier_id: (sale as typeof sale & { cashier_id: string }).cashier_id,
          receipt_number: sale.receipt_number,
          payment_method: sale.payment_method,
          total: sale.total,
        })
        .select()
        .single();

      if (saleError) {
  console.log(
    "SALE ERROR OBJECT:",
    saleError
  );

  alert(
    JSON.stringify(
      saleError,
      null,
      2
    )
  );

  continue;
}

      const items = sale.items.map(
        (item: any) => ({
          sale_id: newSale.id,
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal:
            item.quantity * item.price,
        })
      );

      const {
        error: itemError,
      } = await supabase
        .from("sale_items")
        .insert(items);

      if (itemError) {
        console.error(
          "ITEM INSERT FAILED:",
          itemError
        );
        continue;
      }

      await db.offlineSales.update(
        sale.id,
        {
          synced: true,
        }
      );

      console.log(
        "SALE SYNCED SUCCESSFULLY:",
        sale.receipt_number
      );
    } catch (err) {
      console.error(
        "SYNC ERROR:",
        err
      );
    }
  }
}