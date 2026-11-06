import Dexie, { Table } from "dexie";

export interface OfflineSale {
  id?: number;
  cashier_id?: string;

  receipt_number: string;
  payment_method: string;

  total: number;

  items: any[];

  synced: boolean;

  created_at: string;
}

class HotelDB extends Dexie {

  offlineSales!: Table<OfflineSale>;

  constructor() {
    super("HotelPOS");

    this.version(2).stores({
      offlineSales:
        "++id,cashier_id,receipt_number,synced",
    });
  }
}

export const db = new HotelDB();