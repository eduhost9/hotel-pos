"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ReportActions from "@/components/ReportActions";
import { exportReportPDF } from "@/lib/exportReportPDF";

export default function PayrollReportPage() {

  const [payrolls, setPayrolls] =
    useState<any[]>([]);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  useEffect(() => {
    loadPayrolls();
  }, []);

  async function loadPayrolls() {

    let query = supabase
      .from("payrolls")
      .select(`
        *,
        employees(
          full_name,
          position,
          payment_type
        )
      `)
      .order("payment_date", {
        ascending: false,
      });

    if (startDate) {
      query =
        query.gte(
          "payment_date",
          startDate
        );
    }

    if (endDate) {
      query =
        query.lte(
          "payment_date",
          endDate
        );
    }

    const { data } =
      await query;

    setPayrolls(data || []);
  }

  const totalPayroll =
    payrolls.reduce(
      (sum, payroll) =>
        sum +
        Number(
          payroll.amount
        ),
      0
    );

  const employeeCount =
    new Set(
      payrolls.map(
        (p) =>
          p.employee_id
      )
    ).size;

  const averagePayroll =
    payrolls.length > 0
      ? Math.round(
          totalPayroll /
          payrolls.length
        )
      : 0;

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todayPayroll =
    payrolls
      .filter(
        (p) =>
          p.payment_date ===
          today
      )
      .reduce(
        (sum, p) =>
          sum +
          Number(p.amount),
        0
      );

      function exportPayrollPDF() {

  const rows =
    payrolls.map(
      (payroll) => [

        payroll.employees
          ?.full_name,

        payroll.employees
          ?.position,

        payroll.amount,

        payroll.payment_date,

      ]
    );

  exportReportPDF(
    "Payroll Report",
    [
      "Employee",
      "Position",
      "Amount",
      "Date",
    ],
    rows
  );
}
  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Payroll Report
      </h1>

<ReportActions
  reportId="payroll-report"
  fileName="Payroll Report"
  onExportPDF={
    exportPayrollPDF
  }
/>
<div id="payroll-report">
      <div className="flex gap-4 mb-6">

        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            setStartDate(
              e.target.value
            )
          }
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            setEndDate(
              e.target.value
            )
          }
          className="border p-2 rounded"
        />

        <button
          onClick={loadPayrolls}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-green-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Total Payroll
          </h2>

          <div className="text-3xl">
            KES {totalPayroll}
          </div>

        </div>

        <div className="bg-blue-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Employees Paid
          </h2>

          <div className="text-3xl">
            {employeeCount}
          </div>

        </div>

        <div className="bg-yellow-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Average Payment
          </h2>

          <div className="text-3xl">
            KES {averagePayroll}
          </div>

        </div>

        <div className="bg-purple-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Today's Payroll
          </h2>

          <div className="text-3xl">
            KES {todayPayroll}
          </div>

        </div>

      </div>

      <table className="w-full border">

        <thead>

          <tr className="bg-slate-100">

            <th className="p-2 text-left">
              Employee
            </th>

            <th className="p-2 text-left">
              Position
            </th>

            <th className="p-2 text-left">
              Payment Type
            </th>

            <th className="p-2 text-left">
              Amount
            </th>

            <th className="p-2 text-left">
              Payment Date
            </th>

          </tr>

        </thead>

        <tbody>

          {payrolls.map(
            (payroll) => (

              <tr
                key={payroll.id}
                className="border-t"
              >

                <td className="p-2">

                  {
                    payroll.employees
                      ?.full_name
                  }

                </td>

                <td className="p-2">

                  {
                    payroll.employees
                      ?.position
                  }

                </td>

                <td className="p-2">

                  {
                    payroll.employees
                      ?.payment_type
                  }

                </td>

                <td className="p-2 font-semibold text-green-700">

                  KES {payroll.amount}

                </td>

                <td className="p-2">

                  {
                    payroll.payment_date
                  }

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
    </div>
  );
}