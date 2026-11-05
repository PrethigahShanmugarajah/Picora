// Client / src / pages / Auth.jsx
import { useState } from "react";
import { useAppContext } from "../context/appContext";
import { Login_Ribbon, Logo } from "../assets/assets";
import { InputField } from "../components/FormField/InputField";
import { Eye, EyeOff } from "lucide-react";
import { SingleCheckboxField } from "../components/FormField/CheckboxField";
import { TailSpin } from "react-loader-spinner";

// const Input = ({
//   label,
//   value,
//   placeholder,
//   type = "text",
//   onChange,
//   required = true,
// }) => (
//   <div>
//     <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
//       {label}
//     </label>

//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       required={required}
//       className="auth-input"
//     />
//   </div>
// );

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: true,
  });

  const { navigate, loading, setLoading, login, register } = useAppContext();

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }

      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white min-h-screen rounded-[30px] sm:rounded-[38px] grid grid-cols-1 lg:grid-cols-12 lg:min-h-180">
      {/* -------- Hero -------- */}
      <div className="relative lg:col-span-6 p-2 sm:p-3 flex flex-col">
        <div className="relative size-full rounded-[26px] sm:rounded-4xl overflow-hidden flex flex-col justify-between p-8 sm:p-12 text-white bg-black">
          <img
            src={Login_Ribbon}
            alt="Picora"
            className="absolute inset-0 size-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/60 to-black" />

          <div className="relative z-10 mt-auto pt-24 sm:pt-32">
            <h2 className="text-4xl sm:text-5xl lg:text-5xl font-medium">
              Picora
            </h2>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm mt-4 sm:mt-5">
              Safely store and organize your HD photos and videos.
            </p>
          </div>
        </div>
      </div>

      {/* -------- Form -------- */}

      <div className="lg:col-span-6 bg-white px-8 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16 flex flex-col justify-between">
        <img
          src={Logo}
          alt="Picora"
          className="h-16 xl:h-20 xl:mt-10 w-auto object-contain"
        />

        <div className="max-w-md w-full mx-auto my-auto py-2">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif text-slate-900 font-normal tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              {isLogin
                ? "Enter your email and password to access your photo library"
                : "Join Picora to organize your albums"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              // <Input
              //   key="name"
              //   label="Full Name"
              //   value={form.name}
              //   placeholder="Enter your name"
              //   onChange={(v) => update("name", v)}
              // />

              <InputField
                name="name"
                label="Full Name"
                value={form.name}
                placeholder="Enter your name"
                type="text"
                size="s"
                onChange={(e) => update("name", e.target.value)}
              />
            )}

            {/* <Input
              key="email"
              label="Email"
              value={form.email}
              placeholder="Enter your email"
              onChange={(v) => update("email", v)}
            /> */}

            <InputField
              name="email"
              label="Email"
              value={form.email}
              placeholder="Enter your email"
              type="email"
              size="s"
              onChange={(e) => update("email", e.target.value)}
            />

            {/* <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="********"
                  required
                  className="auth-input pr-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div> */}

            <InputField
              name="password"
              label="Password"
              value={form.password}
              placeholder="********"
              type={showPassword ? "text" : "password"}
              size="s"
              onChange={(e) => update("password", e.target.value)}
              iconRight={
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="size-4 text-gray-500 hover:text-gray-700" />
                  ) : (
                    <Eye className="size-4 text-gray-500 hover:text-gray-700" />
                  )}
                </span>
              }
            />

            <div className="flex items-center justify-between text-xs pt-0.5">
              {/* <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => update("rememberMe", e.target.checked)}
                  className="size-4 rounded border-slate-300 accent-slate-900"
                />

                <span className="text-slate-600">Remember Me</span>
              </label> */}

              <SingleCheckboxField
                name="rememberMe"
                label="Remember Me"
                value={form.rememberMe}
                onChange={(value) => update("rememberMe", value)}
                size="xs"
                labelPosition="right"
                labelClassName="text-slate-600"
              />

              <button
                type="button"
                className="text-slate-700 hover:text-slate-950 hover:underline transition cursor-pointer"
              >
                Forgot Password
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-btn-primary"
            >
              {loading ? (
                <TailSpin
                  visible={true}
                  height="20"
                  width="20"
                  color="#ffffff"
                  ariaLabel="loading"
                />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Sign up"
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-xs sm:text-sm text-center text-slate-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            type="button"
            onClick={() => setIsLogin((prev) => !prev)}
            className="font-medium text-slate-900 hover:underline cursor-pointer"
          >
            {isLogin ? "Sign up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
