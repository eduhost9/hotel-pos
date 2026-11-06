import Link from "next/link";
import HomeHero from "@/components/HomeHero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-xl">

        <h1 className="text-5xl font-bold text-green-800 mb-4">
          CHOMA ZONE HOTEL
        </h1>
<HomeHero />
        
<br></br>
        <p className="text-gray-600 mb-8">
          Sales, Inventory, Expenses, Payroll,
          Analytics and Offline POS Management.
        </p>

        <div className="flex gap-4 justify-center">

          <Link
            href="/login"
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-bold"
          >
            Login
          </Link>

        </div>

      </div>
    </main>
  );
}