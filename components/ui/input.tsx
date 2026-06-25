import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-11 w-full rounded-md border bg-white px-3 text-sm outline-none ring-offset-white transition placeholder:text-slate-400 focus:ring-2 focus:ring-primary", className)} {...props} />;
}
