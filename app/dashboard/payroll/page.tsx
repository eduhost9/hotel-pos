"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PermissionGuard from "@/components/PermissionGuard";

export default function PayrollPage() {
  const [employees, setEmployees] =
    useState<any[]>([]);

    const [editingEmployeeId,
setEditingEmployeeId] =
useState<string | null>(
  null
);

  const [name, setName] =
    useState("");

  const [position, setPosition] =
    useState("");

  const [paymentType, setPaymentType] =
    useState("monthly");

  const [rate, setRate] =
    useState("");

    const [selectedEmployee, setSelectedEmployee] =
  useState("");

const [unitsWorked, setUnitsWorked] =
  useState("");

const [payrolls, setPayrolls] =
  useState<any[]>([]);

  const [editingPayrollId, setEditingPayrollId] =
  useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
    loadPayrolls();
  }, []);

  async function loadPayrolls() {

  const { data } = await supabase
    .from("payrolls")
    .select(`
      *,
      employees(full_name)
    `)
    .order("created_at", {
      ascending: false,
    });

  setPayrolls(data || []);
}

async function processPayroll() {

  const employee =
    employees.find(
      (e) =>
        e.id === selectedEmployee
    );

  if (!employee) {
    alert("Select Employee");
    return;
  }

  let amount = 0;

  if (
    employee.payment_type ===
    "daily"
  ) {

    amount =
      Number(employee.rate) *
      Number(unitsWorked);

  } else if (
    employee.payment_type ===
    "weekly"
  ) {

    amount =
      Number(employee.rate) *
      Number(unitsWorked);

  } else {

    amount =
      Number(employee.rate);
  }

  if (editingPayrollId) {

  await supabase
    .from("payrolls")
    .update({
      employee_id: employee.id,
      amount,
    })
    .eq(
      "id",
      editingPayrollId
    );

  await supabase
    .from("expenses")
    .update({
      description:
        `Payroll - ${employee.full_name}`,
      amount,
    })
    .eq(
      "payroll_id",
      editingPayrollId
    );

  setEditingPayrollId(null);

} else {

  const { data: payroll } =
    await supabase
      .from("payrolls")
      .insert({
        employee_id:
          employee.id,
        amount,
        payment_date:
          new Date()
            .toISOString()
            .split("T")[0],
      })
      .select()
      .single();

  await supabase
    .from("expenses")
    .insert({
      payroll_id:
        payroll?.id,
      description:
        `Payroll - ${employee.full_name}`,
      amount,
      expense_date:
        new Date()
          .toISOString()
          .split("T")[0],
    });

}

  setSelectedEmployee("");
  setUnitsWorked("");

  loadPayrolls();
}

function editEmployee(
  employee: any
) {

  setEditingEmployeeId(
    employee.id
  );

  setName(
    employee.full_name
  );

  setPosition(
    employee.position
  );

  setPaymentType(
    employee.payment_type
  );

  setRate(
    employee.rate.toString()
  );
}

async function deleteEmployee(
  id: string
) {

  if (
    !confirm(
      "Delete employee?"
    )
  ) {
    return;
  }

  await supabase
    .from("employees")
    .delete()
    .eq("id", id);

  loadEmployees();
}

async function deactivateEmployee(
  id: string
) {

  await supabase
    .from("employees")
    .update({
      active: false,
    })
    .eq("id", id);

  loadEmployees();
}

async function deletePayroll(
  payrollId: string
) {

  if (
    !confirm(
      "Delete payroll record?"
    )
  ) {
    return;
  }

  await supabase
    .from("expenses")
    .delete()
    .eq(
      "payroll_id",
      payrollId
    );

  await supabase
    .from("payrolls")
    .delete()
    .eq(
      "id",
      payrollId
    );

  loadPayrolls();
}

  async function loadEmployees() {
    const { data } = await supabase
      .from("employees")
      .select("*")
      .order("full_name");

    setEmployees(data || []);
  }

  async function saveEmployee() {

    if (
  editingEmployeeId
) {

  await supabase
    .from("employees")
    .update({
      full_name: name,
      position,
      payment_type:
        paymentType,
      rate: Number(rate),
    })
    .eq(
      "id",
      editingEmployeeId
    );

  setEditingEmployeeId(
    null
  );

} else {

  await supabase
    .from("employees")
    .insert({
      full_name: name,
      position,
      payment_type:
        paymentType,
      rate: Number(rate),
    });

}

    setName("");
    setPosition("");
    setRate("");

    loadEmployees();
  }

  function editPayroll(payroll: any) {

  setEditingPayrollId(
    payroll.id
  );

  setSelectedEmployee(
    payroll.employee_id
  );

  setUnitsWorked("1");
}

  return (
  <PermissionGuard permission="payroll">
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Employee Management
      </h1>

      <div className="grid grid-cols-4 gap-3 mb-4">

        <input
          className="border p-2"
          placeholder="Employee Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="border p-2"
          placeholder="Position"
          value={position}
          onChange={(e) =>
            setPosition(e.target.value)
          }
        />

        <select
          className="border p-2"
          value={paymentType}
          onChange={(e) =>
            setPaymentType(
              e.target.value
            )
          }
        >
          <option value="daily">
            Daily
          </option>

          <option value="weekly">
            Weekly
          </option>

          <option value="monthly">
            Monthly
          </option>
        </select>

        <input
          className="border p-2"
          placeholder="Rate"
          value={rate}
          onChange={(e) =>
            setRate(e.target.value)
          }
        />

      </div>

      <button
        onClick={saveEmployee}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Employee
      </button>

      <table className="w-full border mt-6">

        <thead>

          <tr className="bg-slate-100">

            <th className="p-2">
              Name
            </th>

            <th className="p-2">
              Position
            </th>

            <th className="p-2">
              Type
            </th>

            <th className="p-2">
              Rate
            </th>

          </tr>

        </thead>

        <tbody>

          {employees.map(
            (employee) => (

              <tr
                key={employee.id}
                className="border-t"
              >

                <td className="p-2">
                  {employee.full_name}
                </td>

                <td className="p-2">
                  {employee.position}
                </td>

                <td className="p-2">
                  {employee.payment_type}
                </td>

                <td className="p-2">
                  KES {employee.rate}
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

<div className="mt-10">

  <h2 className="text-2xl font-bold mb-4">
    Process Payroll
  </h2>

  <div className="grid grid-cols-3 gap-3">

    <select
      className="border p-2"
      value={selectedEmployee}
      onChange={(e) =>
        setSelectedEmployee(
          e.target.value
        )
      }
    >

      <option value="">
        Select Employee
      </option>

      {employees.map((employee) => (

        <option
          key={employee.id}
          value={employee.id}
        >
          {employee.full_name}
        </option>

      ))}

    </select>

    <input
      className="border p-2"
      placeholder="Days / Weeks Worked"
      value={unitsWorked}
      onChange={(e) =>
        setUnitsWorked(
          e.target.value
        )
      }
    />

    <button
      onClick={processPayroll}
      className="bg-blue-600 text-white rounded"
    >
      Pay Employee
    </button>

  </div>

</div>

<div className="mt-8">

  <h2 className="text-2xl font-bold mb-4">
    Payroll History
  </h2>

  <table className="w-full border">

    <thead>

      <tr className="bg-slate-100">

        <th className="p-2">
          Employee
        </th>

        <th className="p-2">
          Amount
        </th>

        <th className="p-2">
          Date
        </th>

        <th className="p-2">
  Actions
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
              KES {payroll.amount}
            </td>

            <td className="p-2">
              {
                payroll.payment_date
              }
            </td>

            <td className="p-2">

  <div className="flex gap-2">

    <button
      onClick={() =>
        editPayroll(
          payroll
        )
      }
      className="bg-blue-600 text-white px-3 py-1 rounded"
    >
      Edit
    </button>

    <button
      onClick={() =>
        deletePayroll(
          payroll.id
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

    </div>
    </PermissionGuard>
  );
}