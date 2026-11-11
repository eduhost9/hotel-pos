"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PermissionGuard from "@/components/PermissionGuard";

export default function ExpensesPage() {
  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [expenseType,
  setExpenseType] =
  useState("operating");

  const [expenses, setExpenses] =
    useState<any[]>([]);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setExpenses(data || []);
  }

  async function saveExpense() {

    if (!description || !amount) {
      alert("Fill all fields");
      return;
    }

    if (editingId) {

     await supabase
  .from("expenses")
  .update({
    description,
    amount: Number(amount),
    expense_type:
      expenseType,
  })
        .eq("id", editingId);

      setEditingId(null);

    } else {

      await supabase
  .from("expenses")
  .insert({
    description,
    amount: Number(amount),

    expense_type:
      expenseType,

    expense_date:
      new Date()
        .toISOString()
        .split("T")[0],
  });

    }

    setDescription("");
    setAmount("");
    setExpenseType("operating");

    loadExpenses();
  }

  function editExpense(expense: any) {


    setEditingId(expense.id);

    setDescription(
      expense.description || ""
    );

    setAmount(
      expense.amount?.toString() || ""
    );

    setExpenseType(
  expense.expense_type ||
  "operating"
);

  }

  async function deleteExpense(
    id: string
  ) {

    if (
      !confirm(
        "Delete expense?"
      )
    ) {
      return;
    }

    await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    loadExpenses();
  }

  const operatingExpenses =
  expenses
    .filter(
      (e) =>
        e.expense_type ===
        "operating"
    )
    .reduce(
      (sum, e) =>
        sum +
        Number(e.amount),
      0
    );

const payrollExpenses =
  expenses
    .filter(
      (e) =>
        e.expense_type ===
        "payroll"
    )
    .reduce(
      (sum, e) =>
        sum +
        Number(e.amount),
      0
    );

const capitalExpenses =
  expenses
    .filter(
      (e) =>
        e.expense_type ===
        "capital"
    )
    .reduce(
      (sum, e) =>
        sum +
        Number(e.amount),
      0
    );

const totalExpenses =
  operatingExpenses +
  payrollExpenses +
  capitalExpenses;

  return (
  <PermissionGuard permission="expenses">
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Expenses
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">

  <div className="bg-white border rounded-xl p-4">

    <h3 className="text-gray-500">
      Total Expenses
    </h3>

    <div className="text-3xl font-bold">
      KES {totalExpenses}
    </div>

  </div>

  <div className="bg-green-50 border rounded-xl p-4">

    <h3>
      Operating
    </h3>

    <div className="text-3xl font-bold text-green-700">
      KES {operatingExpenses}
    </div>

  </div>

  <div className="bg-yellow-50 border rounded-xl p-4">

    <h3>
      Payroll
    </h3>

    <div className="text-3xl font-bold text-yellow-700">
      KES {payrollExpenses}
    </div>

  </div>

  <div className="bg-purple-50 border rounded-xl p-4">

    <h3>
      Capital
    </h3>

    <div className="text-3xl font-bold text-purple-700">
      KES {capitalExpenses}
    </div>

  </div>

</div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">

        <input
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          placeholder="Description"
          className="border p-2"
        />

        <input
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          placeholder="Amount"
          className="border p-2"
        />
<select
  value={expenseType}
  onChange={(e) =>
    setExpenseType(
      e.target.value
    )
  }
  className="border p-2"
>

  <option value="operating">
    Operating Expense
  </option>

  <option value="payroll">
    Payroll Expense
  </option>

  <option value="capital">
    Capital Expense
  </option>

</select>
      </div>

      <button
        onClick={saveExpense}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {editingId
          ? "Update Expense"
          : "Save Expense"}
      </button>

      <table className="w-full border mt-6">

        <thead>

          <tr className="bg-slate-100">

            <th className="p-2 text-left">
              Description
            </th>

            <th className="p-2 text-left">
              Amount
            </th>

            <th className="p-2 text-left">
  Type
</th>

            <th className="p-2 text-left">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {expenses.map(
            (expense) => (

              <tr
                key={expense.id}
                className="border-t"
              >

                <td className="p-2">
                  {expense.description}
                </td>

                <td className="p-2">
                  KES {expense.amount}
                </td>
<td className="p-2">

  {expense.expense_type ||
    "operating"}

</td>
                <td className="p-2">

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        editExpense(
                          expense
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteExpense(
                          expense.id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
    </PermissionGuard>
  );
}