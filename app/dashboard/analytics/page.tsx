"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PermissionGuard from "@/components/PermissionGuard";
import RevenueChart from "@/components/analytics/RevenueChart";

export default function AnalyticsPage() {
  const [topItem, setTopItem] =
    useState("Loading...");

  const [topPayment, setTopPayment] =
    useState("Loading...");

  const [largestExpense, setLargestExpense] =
    useState("Loading...");

  const [bestCashier, setBestCashier] =
    useState("Loading...");

  const [totalRevenue, setTotalRevenue] =
    useState(0);

  const [totalExpenses, setTotalExpenses] =
    useState(0);

  const [revenueTrend, setRevenueTrend] =
    useState<any[]>([]);

  const [cashierLeaderboard,
  setCashierLeaderboard] =
    useState<any[]>([]);

  const [cashierNames,
  setCashierNames] =
    useState<any>({});

  const [topItems,
  setTopItems] =
    useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {

    // =====================
    // REVENUE TOTALS
    // =====================

    const { data: revenueData } =
      await supabase
        .from("sales")
        .select("total");

    const revenue =
      (revenueData || []).reduce(
        (sum, sale) =>
          sum + Number(sale.total),
        0
      );

    setTotalRevenue(revenue);

    // =====================
    // PAYMENT METHODS
    // =====================

    const { data: sales } =
      await supabase
        .from("sales")
        .select("payment_method");

    const paymentCounts: any = {};

    sales?.forEach(
      (sale: any) => {

        paymentCounts[
          sale.payment_method
        ] =
          (paymentCounts[
            sale.payment_method
          ] || 0) + 1;

      }
    );

    const bestPayment =
      Object.entries(
        paymentCounts
      ).sort(
        (a: any, b: any) =>
          Number(b[1]) -
          Number(a[1])
      )[0];

    if (bestPayment) {

      setTopPayment(
        String(bestPayment[0])
      );

    }

    // =====================
    // REVENUE TREND
    // =====================

    const { data: salesTrend } =
      await supabase
        .from("sales")
        .select(
          "total,created_at"
        );

    const revenueByDate: any = {};

    salesTrend?.forEach(
      (sale: any) => {

        const date =
          new Date(
            sale.created_at
          )
            .toISOString()
            .split("T")[0];

        revenueByDate[date] =
          (revenueByDate[date] || 0) +
          Number(sale.total);

      }
    );

    const chartData =
      Object.keys(
        revenueByDate
      )
        .sort()
        .map((date) => ({
          date,
          revenue:
            revenueByDate[date],
        }));

    setRevenueTrend(chartData);

    // =====================
    // EXPENSES
    // =====================

    const {
      data: allExpenses,
    } = await supabase
      .from("expenses")
      .select("*");

    const expenseTotal =
      (allExpenses || []).reduce(
        (sum, expense) =>
          sum +
          Number(expense.amount),
        0
      );

    setTotalExpenses(expenseTotal);

    // =====================
    // LARGEST EXPENSE
    // =====================

    const {
      data: largestExpenseData,
    } = await supabase
      .from("expenses")
      .select("*")
      .order("amount", {
        ascending: false,
      })
      .limit(1);

    if (
      largestExpenseData &&
      largestExpenseData.length > 0
    ) {

      setLargestExpense(
        `${largestExpenseData[0].description}
        (KES ${largestExpenseData[0].amount})`
      );

    }

    // =====================
    // CASHIER PERFORMANCE
    // =====================

    const {
      data: cashierSales,
    } = await supabase
      .from("sales")
      .select(
        "cashier_id,total"
      );

    const cashierTotals: any = {};

    cashierSales?.forEach(
      (sale: any) => {

        cashierTotals[
          sale.cashier_id
        ] =
          (cashierTotals[
            sale.cashier_id
          ] || 0) +
          Number(sale.total);

      }
    );

    const leaderboard =
      Object.entries(
        cashierTotals
      ).map(
        ([id, total]) => ({
          id,
          total,
        })
      );

    const sortedLeaderboard =
      leaderboard.sort(
        (a: any, b: any) =>
          Number(b.total) -
          Number(a.total)
      );

    setCashierLeaderboard(
      sortedLeaderboard
    );

    const cashierNameMap: any = {};

    for (const cashier of sortedLeaderboard) {

      const { data } =
        await supabase
          .from("users")
          .select("full_name")
          .eq(
            "auth_user_id",
            cashier.id
          )
          .single();

      cashierNameMap[
        cashier.id
      ] =
        data?.full_name ||
        "Former User";
    }

    setCashierNames(
      cashierNameMap
    );

    const bestCashierEntry =
      sortedLeaderboard[0];

    if (bestCashierEntry) {

      const cashierName =
        cashierNameMap[
          bestCashierEntry.id
        ] ||
        "Former User";

      setBestCashier(
        `${cashierName}
        (KES ${bestCashierEntry.total})`
      );

    }

    // =====================
    // TOP SELLING ITEMS
    // =====================

    const { data: items } =
      await supabase
        .from("sale_items")
        .select(`
          quantity,
          menu_items(name)
        `);

    const itemTotals: any = {};

    items?.forEach(
      (item: any) => {

        const itemName =
          item.menu_items?.name;

        if (!itemName) return;

        itemTotals[itemName] =
          (itemTotals[itemName] || 0) +
          Number(item.quantity);

      }
    );

    const ranking =
      Object.entries(
        itemTotals
      )
        .map(
          ([name, qty]) => ({
            name,
            qty,
          })
        )
        .sort(
          (a: any, b: any) =>
            Number(b.qty) -
            Number(a.qty)
        );

    setTopItems(
      ranking.slice(0, 5)
    );

    const topSelling =
      ranking[0];

    if (topSelling) {

      setTopItem(
        `${topSelling.name}
        (${topSelling.qty} sold)`
      );

    }
  }

  return (
  <PermissionGuard permission="analytics">
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Business Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-gray-500">
            Top Selling Item
          </h2>
          <div className="text-2xl font-bold">
            {topItem}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-gray-500">
            Best Cashier
          </h2>
          <div className="text-2xl font-bold">
            {bestCashier}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-gray-500">
            Most Used Payment
          </h2>
          <div className="text-2xl font-bold">
            {topPayment}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-gray-500">
            Largest Expense
          </h2>
          <div className="text-2xl font-bold">
            {largestExpense}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-gray-500">
            Total Revenue
          </h2>
          <div className="text-2xl font-bold">
            KES {totalRevenue}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-gray-500">
            Total Expenses
          </h2>
          <div className="text-2xl font-bold">
            KES {totalExpenses}
          </div>
        </div>

      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border">
        <h2 className="text-2xl font-bold mb-4">
          Revenue Trend
        </h2>

        <RevenueChart
          data={revenueTrend}
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border">
        <h2 className="text-2xl font-bold mb-4">
          Top Selling Items
        </h2>

        <table className="w-full">

          <tbody>

            {topItems.map(
              (item: any) => (

                <tr
                  key={item.name}
                >
                  <td>
                    {item.name}
                  </td>

                  <td>
                    {item.qty}
                  </td>
                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border">

        <h2 className="text-2xl font-bold mb-4">
          Cashier Leaderboard
        </h2>

        <table className="w-full">

          <tbody>

            {cashierLeaderboard.map(
              (
                cashier: any,
                index
              ) => (

                <tr
                  key={cashier.id}
                >

                  <td>
                    #{index + 1}
                  </td>

                  <td>
                    {cashierNames[
                      cashier.id
                    ] || "Loading..."}
                  </td>

                  <td>
                    KES {cashier.total}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
    </PermissionGuard>
  );
}