import React from "react";
import { useDebounce } from "../hooks/useDebounce";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [orgValue, setOrgValue] = React.useState<string>("");
  const debouncedValue = useDebounce(orgValue, 500);

  React.useEffect(() => {
    if (debouncedValue) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setOrgValue(event.target.value);
  };

  return (
    <nav className="bg-slate-800 flex flex-col md:flex-row items-center justify-between p-4">
      <h1 className="text-white font-bold text-2xl mb-2 md:mb-0">
        Weather App
      </h1>
      <input
        value={orgValue}
        onChange={handleChange}
        className="rounded-lg w-full md:w-1/3 h-10 px-2 outline-none"
        type="text"
        placeholder="Enter country name"
      />
    </nav>
  );
};
