import Link from "next/link";
import { cn } from "@/lib/utils";

interface EnlaceProps extends React.ComponentProps<typeof Link> {
  className?: string;
}

export function Enlace({ className, children, ...props }: EnlaceProps) {
  return (
    <Link className={cn("link-underline", className)} {...props}>
      {children}
    </Link>
  );
}
