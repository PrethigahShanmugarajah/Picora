// Client / src / components / FormField / InputField.jsx
import { useEffect, useMemo, useState } from "react";

const SIZE_CONFIG = {
  xxxs: { py: "py-1.5", px: "px-3", text: "text-[10px]" },
  xxs: { py: "py-2", px: "px-3", text: "text-[11px]" },
  xs: { py: "py-2.5", px: "px-4", text: "text-xs" },
  s: { py: "py-3", px: "px-4", text: "text-sm" },
  m: { py: "py-3.5", px: "px-5", text: "text-sm" },
  l: { py: "py-4", px: "px-6", text: "text-base" },
  xl: { py: "py-4.5", px: "px-6", text: "text-base" },
  xxl: { py: "py-5", px: "px-7", text: "text-lg" },
  xxxl: { py: "py-6", px: "px-8", text: "text-xl" },
};

const getSize = (sizeKey) => {
  if (!sizeKey || !SIZE_CONFIG[sizeKey]) {
    console.warn(
      `[InputField] "size" prop is required. Use xxxs|xxs|xs|s|m|l|xl|xxl|xxxl. Received:`,
      sizeKey,
    );
    return SIZE_CONFIG.m;
  }
  return SIZE_CONFIG[sizeKey];
};

const BP_MIN = { base: 0, sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

export const InputField = ({
  label,
  labelPosition = "top",
  name,
  type,
  placeholder = "",
  size,
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  unstyled = false,
  fullWidth = true,
  value,
  onChange,
  onBlur,
  error,
  inputRef,
  iconLeft,
  iconRight,
  ...rest
}) => {
  const rules = useMemo(() => {
    if (!size) return [{ bp: "base", value: "m" }];

    const tokens = String(size).trim().split(/\s+/);

    if (!tokens.some((t) => t.includes(":"))) {
      return [{ bp: "base", value: size }];
    }

    const out = [{ bp: "base", value: tokens[0] }];

    tokens.forEach((t) => {
      if (!t.includes(":")) return;
      const [bp, val] = t.split(":");
      if (!BP_MIN[bp] || !val) return;
      out.push({ bp, value: val });
    });

    return out;
  }, [size]);

  const hasResponsive = rules.some((r) => r.bp !== "base");

  const [vw, setVw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    if (!hasResponsive) return;
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hasResponsive]);

  const resolvedSize = useMemo(() => {
    let picked = rules[0]?.value || "m";
    rules.forEach((r) => {
      if (vw >= (BP_MIN[r.bp] ?? 0)) picked = r.value;
    });
    return picked;
  }, [rules, vw]);

  const s = getSize(resolvedSize);

  const baseInput = `rounded-full border border-cyan-100 bg-white shadow-sm w-full focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100 ${s.py} ${s.px} ${s.text}`;
  const unstyledInput =
    "w-full p-0 border-0 shadow-none rounded-none outline-none focus:outline-none focus:ring-0";

  const renderLabel = label ? (
    <label
      htmlFor={name}
      className={`block font-medium text-black ${labelClassName}`}
    >
      {label} {rest.required && <span className="text-red-500 ml-1">*</span>}
    </label>
  ) : null;

  const wrapperClass =
    labelPosition === "left" || labelPosition === "right"
      ? "flex items-center gap-3"
      : labelPosition === "top" || labelPosition === "bottom"
        ? "flex flex-col gap-2"
        : "";

  return (
    <div
      className={`${fullWidth ? "w-full" : ""} ${wrapperClass} ${className}`}
    >
      {(labelPosition === "top" || labelPosition === "left") && renderLabel}

      <div className="relative w-full">
        {iconLeft && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {iconLeft}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          ref={inputRef}
          className={`${unstyled ? unstyledInput : baseInput} ${iconLeft ? "pl-11" : ""} ${iconRight ? "pr-11" : ""} ${inputClassName}`}
          {...(value !== undefined ? { value } : {})}
          onChange={(e) => onChange?.(e)}
          onBlur={(e) => onBlur?.(e.target.value, e)}
          {...rest}
        />

        {iconRight && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {iconRight}
          </span>
        )}
      </div>

      {(labelPosition === "right" || labelPosition === "bottom") && renderLabel}

      {!!error && (
        <p className={`text-red-500 text-sm mt-1 ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
};
