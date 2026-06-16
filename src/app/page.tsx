"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);

  const emailTrimmed = useMemo(() => email.trim(), [email]);
  const isEmailNotEmpty = emailTrimmed.length > 0;
  const isEmailValid = isEmailNotEmpty && emailTrimmed.includes("@");

  const hasMinLen = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = password.length > 0 && hasMinLen && hasNumber && hasSpecial;

  const emailError = useMemo(() => {
    if (!submitted) return "";
    if (!isEmailNotEmpty) return "Email tidak boleh kosong";
    if (!isEmailValid) return "Email harus mengandung @";
    return "";
  }, [submitted, isEmailNotEmpty, isEmailValid]);

  const passwordError = useMemo(() => {
    if (!submitted) return "";
    if (password.length === 0) return "Password tidak boleh kosong";
    if (!hasMinLen || !hasNumber || !hasSpecial)
      return "Password minimal 8 karakter, harus mengandung angka dan karakter spesial";
    return "";
  }, [submitted, password, hasMinLen, hasNumber, hasSpecial]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isEmailValid || !isPasswordValid) {
      setWarning("Isi email dan password dengan benar terlebih dahulu");
      return;
    }

    setWarning("");
    setLoading(true);

    // Call Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailTrimmed,
      password: password,
    });

    if (error) {
      setWarning(error.message);
      setLoading(false);
      return;
    }

    router.push("/welcome");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/welcome`,
      },
    });

    if (error) {
      setWarning(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex justify-center items-center min-h-screen text-black">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center">
            <svg
              viewBox="0 0 241 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-45 h-10"
              style={{ width: "180px" }}
            >
              <path
                d="M57.25 3.64C56.64 3.33 56.37 3.91 56.01 4.21C55.89 4.3 55.79 4.43 55.68 4.54C54.79 5.52 53.74 6.16 52.37 6.08C50.38 5.97 48.67 6.61 47.16 8.16C46.84 6.24 45.77 5.1 44.15 4.36C43.3 3.98 42.45 3.6 41.85 2.77C41.44 2.17 41.32 1.51 41.12 0.86C40.98 0.47 40.85 0.07 40.41 0C39.93 -0.07 39.74 0.34 39.55 0.68C38.8 2.09 38.5 3.64 38.53 5.2C38.6 8.73 40.06 11.54 42.96 13.54C43.29 13.76 43.38 13.99 43.27 14.33C43.08 15.02 42.84 15.68 42.63 16.37C42.5 16.81 42.3 16.91 41.84 16.72C40.25 16.04 38.87 15.04 37.65 13.82C35.59 11.79 33.72 9.54 31.39 7.78C30.85 7.37 30.3 6.99 29.73 6.63C27.36 4.28 30.05 2.35 30.67 2.12C31.32 1.88 30.89 1.06 28.79 1.06C26.69 1.07 24.77 1.79 22.31 2.75C21.96 2.89 21.58 3 21.19 3.08C18.97 2.65 16.66 2.56 14.24 2.83C9.7 3.35 6.07 5.54 3.4 9.27C0.19 13.76 -0.56 18.87 0.36 24.19C1.33 29.8 4.14 34.44 8.46 38.07C12.94 41.84 18.1 43.68 23.98 43.33C27.56 43.12 31.54 42.63 36.02 38.76C37.16 39.33 38.34 39.56 40.31 39.74C41.83 39.88 43.29 39.66 44.43 39.42C46.2 39.04 46.08 37.37 45.43 37.06C40.24 34.6 41.38 35.6 40.34 34.79C42.98 31.6 46.96 28.3 48.52 17.59C48.64 16.74 48.54 16.2 48.52 15.51C48.51 15.09 48.6 14.93 49.07 14.88C50.38 14.73 51.64 14.37 52.8 13.72C56.16 11.84 57.52 8.77 57.84 5.08C57.89 4.51 57.83 3.93 57.25 3.64ZM27.91 36.83C22.88 32.8 20.44 31.47 19.43 31.53C18.49 31.59 18.65 32.68 18.86 33.4C19.08 34.11 19.36 34.6 19.76 35.22C20.03 35.63 20.22 36.24 19.48 36.7C17.86 37.72 15.04 36.35 14.91 36.29C11.63 34.32 8.89 31.72 6.95 28.16C5.09 24.74 4 21.07 3.82 17.16C3.78 16.21 4.05 15.88 4.97 15.7C6.19 15.48 7.44 15.43 8.66 15.61C13.8 16.37 18.17 18.71 21.84 22.42C23.94 24.53 25.52 27.06 27.15 29.52C28.89 32.14 30.75 34.63 33.13 36.68C33.97 37.4 34.64 37.94 35.28 38.34C33.35 38.56 30.12 38.61 27.91 36.83ZM30.33 21.02C30.33 20.6 30.66 20.26 31.07 20.26C31.17 20.26 31.25 20.28 31.33 20.31C31.43 20.35 31.53 20.41 31.6 20.49C31.73 20.63 31.81 20.82 31.81 21.02C31.81 21.44 31.48 21.77 31.06 21.77C30.65 21.77 30.33 21.44 30.33 21.02ZM37.82 24.93C37.34 25.14 36.86 25.31 36.4 25.33C35.68 25.36 34.9 25.07 34.48 24.71C33.82 24.14 33.35 23.83 33.15 22.84C33.06 22.42 33.11 21.77 33.19 21.4C33.36 20.6 33.17 20.08 32.61 19.61C32.16 19.23 31.58 19.12 30.95 19.12C30.72 19.12 30.5 19.02 30.34 18.93C30.07 18.8 29.86 18.47 30.06 18.05C30.13 17.92 30.45 17.6 30.53 17.54C31.38 17.04 32.37 17.2 33.29 17.58C34.14 17.93 34.78 18.58 35.7 19.5C36.65 20.61 36.82 20.91 37.35 21.74C37.78 22.39 38.16 23.06 38.43 23.83C38.59 24.3 38.38 24.7 37.82 24.93Z"
                fill="#4D6BFE"
              ></path>
              <path
                d="M143.32 34.23L140.83 34.23L140.83 30.37L143.32 30.37C144.86 30.37 146.42 29.99 147.43 28.92C148.44 27.85 148.81 26.21 148.81 24.57C148.81 22.94 148.44 21.3 147.43 20.23C146.42 19.16 144.86 18.78 143.32 18.78C141.77 18.78 140.22 19.16 139.21 20.23C138.19 21.3 137.83 22.94 137.83 24.57L137.83 40.44L133.46 40.44L133.46 14.92L137.83 14.92L137.83 16.54L138.63 16.54C138.71 16.45 138.8 16.36 138.9 16.27C139.99 15.27 141.66 14.92 143.32 14.92C145.89 14.92 148.48 15.56 150.17 17.34C151.85 19.12 152.46 21.86 152.46 24.58C152.46 27.29 151.85 30.03 150.17 31.81C148.48 33.6 145.89 34.23 143.32 34.23Z"
                fill="#4D6BFE"
              ></path>
              <path
                d="M76.79 15.59L79.28 15.59L79.28 19.45L76.79 19.45C75.25 19.45 73.69 19.83 72.68 20.91C71.67 21.98 71.3 23.62 71.3 25.25C71.3 26.88 71.67 28.52 72.68 29.59C73.69 30.66 75.25 31.05 76.79 31.05C78.34 31.05 79.89 30.66 80.9 29.59C81.92 28.52 82.28 26.88 82.28 25.25L82.28 9.39L86.65 9.39L86.65 34.91L82.28 34.91L82.28 33.28L81.48 33.28C81.4 33.38 81.31 33.47 81.21 33.55C80.12 34.55 78.45 34.91 76.79 34.91C74.22 34.91 71.63 34.27 69.94 32.48C68.26 30.7 67.65 27.97 67.65 25.25C67.65 22.53 68.26 19.8 69.94 18.01C71.63 16.23 74.22 15.59 76.79 15.59Z"
                fill="#4D6BFE"
              ></path>
              <path
                d="M108.59 24.91L108.59 26.46L96.95 26.46L96.95 23.36L104.67 23.36C104.49 22.23 104.08 21.18 103.36 20.42C102.3 19.31 100.69 18.91 99.08 18.91C97.48 18.91 95.86 19.31 94.81 20.42C93.76 21.52 93.38 23.22 93.38 24.91C93.38 26.6 93.76 28.3 94.81 29.41C95.86 30.52 97.48 30.91 99.08 30.91C100.69 30.91 102.3 30.52 103.36 29.41C103.51 29.25 103.64 29.08 103.76 28.9L108.08 28.9C107.71 30.24 107.1 31.45 106.2 32.4C104.45 34.25 101.75 34.91 99.08 34.91C96.41 34.91 93.72 34.25 91.97 32.4C90.21 30.55 89.58 27.72 89.58 24.91C89.58 22.1 90.21 19.27 91.97 17.42C93.72 15.58 96.41 14.92 99.08 14.92C101.75 14.92 104.45 15.58 106.2 17.42C107.96 19.27 108.59 22.1 108.59 24.91Z"
                fill="#4D6BFE"
              ></path>
              <path
                d="M130.52 24.91L130.52 26.46L118.88 26.46L118.88 23.36L126.61 23.36C126.43 22.23 126.02 21.18 125.29 20.42C124.24 19.31 122.63 18.91 121.02 18.91C119.42 18.91 117.8 19.31 116.75 20.42C115.7 21.52 115.32 23.22 115.32 24.91C115.32 26.6 115.7 28.3 116.75 29.41C117.8 30.52 119.42 30.91 121.02 30.91C122.63 30.91 124.24 30.52 125.29 29.41C125.44 29.25 125.58 29.08 125.7 28.9L130.02 28.9C129.64 30.24 129.04 31.45 128.14 32.4C126.38 34.25 123.69 34.91 121.02 34.91C118.35 34.91 115.66 34.25 113.9 32.4C112.15 30.55 111.52 27.72 111.52 24.91C111.52 22.1 112.15 19.27 113.9 17.42C115.66 15.58 118.35 14.92 121.02 14.92C123.69 14.92 126.38 15.58 128.14 17.42C129.89 19.27 130.52 22.1 130.52 24.91Z"
                fill="#4D6BFE"
              ></path>
              <path
                d="M164.9 34.91C167.57 34.91 170.26 34.52 172.01 33.43C173.77 32.34 174.4 30.67 174.4 29.01C174.4 27.35 173.77 25.68 172.01 24.59C170.26 23.5 167.57 23.11 164.9 23.11L164.99 23.11C163.85 23.11 162.7 22.96 161.96 22.53C161.21 22.11 160.94 21.46 160.94 20.82C160.94 20.17 161.21 19.53 161.96 19.1C162.7 18.68 163.85 18.53 164.99 18.53C166.13 18.53 167.28 18.68 168.03 19.1C168.78 19.53 169.04 20.17 169.04 20.82L173.49 20.82C173.49 19.16 172.92 17.49 171.34 16.4C169.75 15.31 167.32 14.92 164.9 14.92C162.48 14.92 160.05 15.31 158.46 16.4C156.87 17.49 156.3 19.16 156.3 20.82C156.3 22.48 156.87 24.15 158.46 25.24C160.05 26.33 162.48 26.72 164.9 26.72C166.16 26.72 167.53 26.87 168.36 27.29C169.19 27.71 169.48 28.36 169.48 29.01C169.48 29.65 169.19 30.3 168.36 30.72C167.53 31.14 166.26 31.3 165 31.3C163.74 31.3 162.47 31.14 161.65 30.72C160.82 30.3 160.52 29.65 160.52 29.01L155.4 29.01C155.4 30.67 156.03 32.34 157.78 33.43C159.53 34.52 162.22 34.91 164.9 34.91Z"
                fill="#4D6BFE"
              ></path>
              <path
                d="M196.33 24.91L196.33 26.46L184.69 26.46L184.69 23.36L192.42 23.36C192.24 22.23 191.83 21.18 191.1 20.42C190.05 19.31 188.44 18.91 186.83 18.91C185.23 18.91 183.61 19.31 182.56 20.42C181.51 21.52 181.13 23.22 181.13 24.91C181.13 26.6 181.51 28.3 182.56 29.41C183.61 30.52 185.23 30.91 186.83 30.91C188.44 30.91 190.05 30.52 191.1 29.41C191.25 29.25 191.39 29.08 191.51 28.9L195.83 28.9C195.45 30.24 194.85 31.45 193.95 32.4C192.19 34.25 189.5 34.91 186.83 34.91C184.16 34.91 181.47 34.25 179.71 32.4C177.96 30.55 177.33 27.72 177.33 24.91C177.33 22.1 177.96 19.27 179.71 17.42C181.47 15.58 184.16 14.92 186.83 14.92C189.5 14.92 192.19 15.58 193.95 17.42C195.7 19.27 196.33 22.1 196.33 24.91Z"
                fill="#4D6BFE"
              ></path>
              <path
                d="M218.27 24.91L218.27 26.46L206.63 26.46L206.63 23.36L214.36 23.36C214.17 22.23 213.77 21.18 213.04 20.42C211.99 19.31 210.37 18.91 208.77 18.91C207.17 18.91 205.55 19.31 204.5 20.42C203.44 21.52 203.07 23.22 203.07 24.91C203.07 26.6 203.44 28.3 204.5 29.41C205.55 30.52 207.17 30.91 208.77 30.91C210.37 30.91 211.99 30.52 213.04 29.41C213.19 29.25 213.32 29.08 213.45 28.9L217.77 28.9C217.39 30.24 216.79 31.45 215.88 32.4C214.13 34.25 211.44 34.91 208.77 34.91C206.1 34.91 203.4 34.25 201.65 32.4C199.9 30.55 199.27 27.72 199.27 24.91C199.27 22.1 199.9 19.27 201.65 17.42C203.4 15.58 206.1 14.92 208.77 14.92C211.44 14.92 214.13 15.58 215.88 17.42C217.64 19.27 218.27 22.1 218.27 24.91Z"
                fill="#4D6BFE"
              ></path>
              <rect
                x="221.211182"
                y="8.500488"
                width="4.371000"
                height="26.415646"
                fill="#4D6BFE"
              ></rect>
              <path
                d="M233.04 24.31L240.21 34.91L234.79 34.91L227.62 24.31L234.79 15.81L240.21 15.81L233.04 24.31Z"
                fill="#4D6BFE"
              ></path>
            </svg>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="mb-6">
            <p className="text-xs text-gray-500 text-left">
              Only login via email, Google, or +86 phone number login is supported in your region.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            {warning ? (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {warning}
              </div>
            ) : null}

            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.97671 3.2998C3.0897 3.2998 1.55998 4.85786 1.55998 6.77981V17.2198C1.55998 19.1418 3.0897 20.6998 4.97671 20.6998H19.0233C20.9103 20.6998 22.44 19.1418 22.44 17.2198V6.7798C22.44 4.85785 20.9103 3.2998 19.0233 3.2998H4.97671ZM4.97671 5.23314C4.13804 5.23314 3.45816 5.92561 3.45816 6.77981V7.18001L12.0001 11.8068L20.5418 7.18021V6.7798C20.5418 5.9256 19.8619 5.23314 19.0233 5.23314H4.97671ZM20.5418 9.50025L12.4962 13.8582C12.3427 13.9434 12.1689 13.9881 11.9927 13.987C11.8501 13.9861 11.7059 13.9552 11.5695 13.8915C11.5467 13.8809 11.5243 13.8695 11.5022 13.8572L3.45816 9.50005V17.2198C3.45816 18.074 4.13804 18.7665 4.97671 18.7665H19.0233C19.8619 18.7665 20.5418 18.074 20.5418 17.2198V9.50025Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D6BFE] focus:border-transparent transition"
                  placeholder="Phone number / email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {emailError ? <div className="mt-1 text-xs text-red-600">{emailError}</div> : null}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12.9819 14.7816C12.9819 14.2394 12.5423 13.7998 12.0001 13.7998C11.4578 13.7998 11.0182 14.2394 11.0182 14.7816V17.0289C11.0182 17.5711 11.4578 18.0107 12.0001 18.0107C12.5423 18.0107 12.9819 17.5711 12.9819 17.0289V14.7816Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.00012 6.51953V9.52051H6.42405C4.54628 9.52051 3.02405 11.0427 3.02405 12.9205V19.1205C3.02405 20.9983 4.54628 22.5205 6.42405 22.5205H17.576C19.4538 22.5205 20.976 20.9983 20.976 19.1205V12.9205C20.976 11.0427 19.4538 9.52051 17.576 9.52051H17.0001V6.51953C17.0001 3.75811 14.7615 1.51953 12.0001 1.51953C9.2387 1.51953 7.00012 3.75811 7.00012 6.51953ZM12.0001 3.51953C10.3433 3.51953 9.00012 4.86268 9.00012 6.51953V9.52051H15.0001V6.51953C15.0001 4.86268 13.657 3.51953 12.0001 3.51953ZM17.576 11.5205H6.42405C5.65085 11.5205 5.02405 12.1473 5.02405 12.9205V19.1205C5.02405 19.8937 5.65085 20.5205 6.42405 20.5205H17.576C18.3492 20.5205 18.976 19.8937 18.976 19.1205V12.9205C18.976 12.1473 18.3492 11.5205 17.576 11.5205Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-12 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D6BFE] focus:border-transparent transition"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError ? <div className="mt-1 text-xs text-red-600">{passwordError}</div> : null}
            </div>

            <div className="text-xs text-gray-500 text-left pt-2">
              By signing up or logging in, you consent to DeepSeek's <a href="#" className="text-black underline">Terms of Use</a> and{" "}
              <a href="#" className="text-black underline">Privacy Policy</a>.
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#4D6BFE] text-white rounded-lg font-medium hover:bg-[#3A5AE0] transition focus:outline-none focus:ring-2 focus:ring-[#4D6BFE] focus:ring-offset-2 disabled:bg-[#a6b6ff]"
              >
                {loading ? "Loading..." : "Log in"}
              </button>
            </div>

            <div className="flex justify-between items-center pt-2">
              <a href="#" className="text-sm text-[#4D6BFE] hover:underline">Forgot password?</a>
              <Link href="/register" className="text-sm text-[#4D6BFE] hover:underline">Sign up</Link>
            </div>

            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 border border-gray-300 rounded-lg font-medium flex items-center justify-center hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Log in with Google
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>浙ICP备2023025841号 · Contact us</p>
        </div>
      </div>
    </div>
  );
}
