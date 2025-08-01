"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type SortSelectOption = {
  sortKey: string;
  sortValue: string;
  label: string;
};

type SortObject = {
  sortKey: string;
  sortValue: string;
}

type SortSelectProps = {
  value: SortObject
  onChange: (sort: SortObject) => void
  options: SortSelectOption[];
};

const SortSelect = ({ value, onChange, options }: SortSelectProps) => {

  const handleSort = (compositeKey: string) => {

    const [sortKey, sortValue] = compositeKey.split("_")

    onChange({
      sortKey,
      sortValue,
    });
  };

  return (
    <Select defaultValue={value.sortKey + "_" + value.sortValue} onValueChange={handleSort}>
      <SelectTrigger className="cursor-pointer">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem className="cursor-pointer" key={option.sortKey + option.sortValue} value={option.sortKey + "_" + option.sortValue}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { SortSelect };
