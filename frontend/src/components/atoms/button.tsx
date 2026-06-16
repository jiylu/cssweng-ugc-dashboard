import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded font-medium",

        variant === "primary" &&
          "bg-purple-600 hover:bg-purple-700 text-white",
        variant === "ghost" &&
          "bg-transparent text-gray-500 hover:bg-gray-100",

        size === "sm" && "text-sm h-8 px-4",
        size === "md" && "text-base h-10 px-5",
        size === "lg" && "text-lg h-12 px-6",

        className
      )}
      {...props}
    />
  );
}