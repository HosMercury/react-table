import { useRef, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const TableSearch = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localSearch, setLocalSearch] = useState(search);
  const [debouncedSearch] = useDebounce(localSearch, 500);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [localSearch]); // Keep focus when localSearch updates

  return (
    <input
      ref={inputRef}
      type="text"
      value={localSearch}
      onChange={(e) => setLocalSearch(e.target.value)}
      placeholder="Search..."
      className="border rounded mb-4 w-56"
    />
  );
};

export default TableSearch;
