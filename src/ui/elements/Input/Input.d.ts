import { DetailedHTMLFactory, Input, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  mask?: string[];
  label?: string;
  errorText?: string;
}
