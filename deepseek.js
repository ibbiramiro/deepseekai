(function () {
    const { useMemo, useState } = React;

    function LoginForm() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [showPassword, setShowPassword] = useState(false);
        const [submitted, setSubmitted] = useState(false);
        const [warning, setWarning] = useState("");

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
            if (!hasMinLen || !hasNumber || !hasSpecial) return "Password minimal 8 karakter, harus mengandung angka dan karakter spesial";
            return "";
        }, [submitted, password, hasMinLen, hasNumber, hasSpecial]);

        const handleLogin = (e) => {
            e.preventDefault();
            setSubmitted(true);

            if (!isEmailValid || !isPasswordValid) {
                setWarning("Isi email dan password terlebih dahulu");
                return;
            }

            setWarning("");
        };

        return (
            <>
                {warning ? (
                    <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {warning}
                    </div>
                ) : null}

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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                    {passwordError ? <div className="mt-1 text-xs text-red-600">{passwordError}</div> : null}
                </div>

                <div className="text-xs text-gray-500 text-left pt-2">
                    By signing up or logging in, you consent to DeepSeek's <a href="#" className="text-black underline">Terms of Use</a> and
                    <a href="#" className="text-black underline">Privacy Policy</a>.
                </div>

                <div className="pt-4">
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full h-12 bg-[#4D6BFE] text-white rounded-lg font-medium hover:bg-[#3A5AE0] transition focus:outline-none focus:ring-2 focus:ring-[#4D6BFE] focus:ring-offset-2"
                    >
                        Log in
                    </button>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <a href="#" className="text-sm text-[#4D6BFE] hover:underline">Forgot password?</a>
                    <a href="#" className="text-sm text-[#4D6BFE] hover:underline">Sign up</a>
                </div>

                <div className="relative flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    type="button"
                    className="w-full h-12 border border-gray-300 rounded-lg font-medium flex items-center justify-center hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Log in with Google
                </button>
            </>
        );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<LoginForm />);
})();
