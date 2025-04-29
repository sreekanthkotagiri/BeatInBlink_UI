import * as React from "react";
import { cn } from "./../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
            "ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 " +
            "focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      className={cn(
        "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", 
        props.className // Allows adding custom classes if needed
      )}
    />
  );
});

Textarea.displayName = "Textarea"; // Setting displayName for React DevTools

export { Textarea };

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500", 
        props.className // Custom classnames passed through props
      )}
    />
  );
});

Button.displayName = "Button"; // Setting displayName for React DevTools

export { Button };

export { Input };
