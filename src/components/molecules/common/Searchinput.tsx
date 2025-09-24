"use client";
import React, { ChangeEvent, KeyboardEvent, useEffect } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useTheme } from "next-themes";
import { isSystemDark } from "@/utils/helper/helper";

interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string | React.ReactNode;
  debounceDelay?: number;
  className?: string;
  value?: string;
  closeIcon?: boolean;
  onClose?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Search users",
  debounceDelay = 500,
  className = "",
  value,
  closeIcon = false,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = React.useState<string>(value);
  const { theme } = useTheme();
  const debouncedSearch = useDebouncedCallback((term: string) => {
    onSearch(term.trim());
  }, debounceDelay);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    debouncedSearch(newValue);
  };

  useEffect(() => {
    if (value !== undefined) {
      setSearchTerm(value);
    }
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      debouncedSearch.cancel();
      onSearch(searchTerm.trim());
    }
  };

  return (
    <Input
      value={searchTerm}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={`w-full max-w-3xl bg-background text-foreground rounded-md pl-10 py-5 placeholder:ml-10 placeholder:text-foreground focus-visible:ring-white focus-visible:ring-1 ${className} ${
        theme === "dark" || (theme === "system" && isSystemDark)
          ? "border-gray-600"
          : "border-gray-300"
      }`}
      placeholder={placeholder as string}
      icon={<Search />}
      closeIcon={closeIcon}
      onClose={onClose}
    />
  );
};

export default SearchInput;
