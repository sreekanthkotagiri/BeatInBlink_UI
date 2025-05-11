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

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
            "ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 " +
            "focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export { Select };


interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-md border border-gray-200 bg-white shadow-sm',
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('p-6', className)}
      {...props}
    />
  );
});
CardContent.displayName = 'CardContent';

export { Card, CardContent };


interface StatCardProps {
  title: string;
  value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <Card>
      <CardContent>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </CardContent>
    </Card>
  );
};

export {StatCard};

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl font-bold">
            &times;
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export {Modal};
