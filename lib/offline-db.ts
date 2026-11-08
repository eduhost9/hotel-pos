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

export interface OfflineUser {
  id?: number;

  auth_user_id: string;

  email: string;

  full_name: string;

  role: string;

  permissions: string[];
}


class HotelDB extends Dexie {

  offlineSales!: Table<OfflineSale>;
  offlineUsers!: Table<OfflineUser>;

  constructor() {
    super("HotelPOS");

    this.version(3).stores({
  offlineSales:
    "++id,cashier_id,receipt_number,synced",

  offlineUsers:
    "++id,email,auth_user_id",
});
  }
}

export const db = new HotelDB();