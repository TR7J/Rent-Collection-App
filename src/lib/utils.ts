/* export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | false)[]) {
  return twMerge(clsx(inputs));
}
