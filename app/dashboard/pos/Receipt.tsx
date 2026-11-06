type ReceiptProps = {
  receiptNo: string;
  cart: any[];
  total: number;
  paymentMethod: string;
};

export default function Receipt({
  receiptNo,
  cart,
  total,
  paymentMethod,
}: ReceiptProps) {
  return (
    <div
      className="w-[300px] text-sm"
      style={{ fontFamily: "monospace" }}
    >
      <div className="text-center">
        <h2 className="text-lg font-bold">
          CHOMA ZONE HOTEL POINT
        </h2>

        <p>Migadini - Mombasa</p>

        <p>Tel: 0702 422 997</p>
      </div>

      <hr className="my-2" />

      <div>
        <p>Receipt: {receiptNo}</p>
        <p>{new Date().toLocaleString()}</p>
      </div>

      <hr className="my-2" />

      <div className="font-bold flex justify-between">
        <span>ITEM</span>
        <span>TOTAL</span>
      </div>

      <hr className="my-2" />

      {cart.map((item) => (
        <div
          key={item.id}
          className="mb-1"
        >
          <div className="flex justify-between">
            <span>
              {item.name} x {item.quantity}
            </span>

            <span>
              {item.price * item.quantity}
            </span>
          </div>
        </div>
      ))}

      <hr className="my-2" />

      <div className="flex justify-between font-bold text-base">
        <span>TOTAL</span>
        <span>KES {total}</span>
      </div>

      <div className="mt-2">
        <p>
          Payment: {paymentMethod}
        </p>
      </div>

      <hr className="my-2" />

      <div className="text-center">
        <p>Thank You</p>
        <p>Please Come Again</p>
      </div>
    </div>
  );
}