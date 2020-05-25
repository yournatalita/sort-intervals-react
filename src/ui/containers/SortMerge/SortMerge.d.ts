import { Dispatch, SetStateAction } from 'react';

export type TIntervals = string[];

export type SortMergeProps = {
  value: string;
};

export type SortMergeState = {
  setError: Dispatch<SetStateAction<string>>;
  setIntervals: Dispatch<SetStateAction<TIntervals | null>>;
};
