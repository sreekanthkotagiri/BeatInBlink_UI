// components/ui/header.tsx

import * as React from "react";
import { cn } from "./../../lib/utils";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  instituteName?: string;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>((props, ref) => {
  const { title, subtitle, className, ...rest } = props;

  return (
    <header
      ref={ref}
      className={cn(
        "bg-gray-800 text-white p-4 flex items-center justify-between", 
        className // Custom classnames passed through props
      )}
      {...rest}
    >
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-lg">{subtitle}</p>}
      </div>
    </header>
  );
});

Header.displayName = "Header"; // Setting displayName for React DevTools

export { Header };
