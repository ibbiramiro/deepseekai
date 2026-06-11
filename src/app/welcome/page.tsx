"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/"); // Redirect back to login if no user
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-black">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Simple Logo */}
          <div className="w-8 h-8 bg-[#4D6BFE] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="font-semibold text-lg">DeepSeek Dashboard</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-600 hover:text-black transition"
        >
          Log out
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-12 p-6">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-gray-500 mb-8">
            You are successfully logged in as <span className="font-medium text-black">{user?.email}</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-xl hover:shadow-md transition cursor-pointer group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Quick Start</h3>
              <p className="text-gray-500 text-sm">Begin your journey with our advanced tools and features.</p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-md transition cursor-pointer group">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Settings</h3>
              <p className="text-gray-500 text-sm">Manage your account preferences and configurations.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
