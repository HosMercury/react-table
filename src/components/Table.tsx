import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import TableSearch from "./TableSearch";

export type SortingState = {
  field: string | null;
  order: "asc" | "desc" | null;
};

const Table = ({
  data,
  total,
  columns,
  page,
  setPage,
  pageSize,
  setPageSize,
  sorting,
  setSorting,
  search,
  setSearch,
}: {
  data: any;
  total: number;
  columns: any;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  let totalPages = Math.ceil(total / pageSize);

  const setPrevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  const setNextPage = () => {
    if (page < totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(0);
  };

  const handleSort = (field: string) => {
    const order =
      sorting.field === field && sorting.order === "asc" ? "desc" : "asc";
    setSorting({ field, order });
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md h-[600px] p-2">
        <TableSearch search={search} setSearch={setSearch} />
        <table className="min-w-full border-collapse bg-white text-left text-sm text-gray-700">
          {/* Table Head */}
          <thead className="bg-gray-100 text-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 font-medium text-gray-900 cursor-pointer"
                    onClick={() => handleSort(header.column.id)}
                  >
                    <div className="flex items-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                      {/* Sorting Arrows */}
                      {sorting.field === header.column.id && sorting.order ? (
                        sorting.order === "asc" ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="h-2" />
      </div>
      {/* pagination */}
      <div className=" mx-4 flex justify-between w-full gap-3 my-2  items-center">
        <div className="flex items-center gap-2 p-4">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={onChangePageSize}
            className="border p-1 rounded"
          >
            {[2, 5, 10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
        <div className="flex gap-1">
          <button
            className="cursor-pointer border rounded px-1 bg-slate-200 disabled:bg-white disabled:cursor-default"
            onClick={() => setPage(0)}
            disabled={page === 0}
          >
            {"<<"}
          </button>
          <button
            className="cursor-pointer border rounded px-1  bg-slate-200 disabled:bg-white  disabled:cursor-default"
            onClick={setPrevPage}
            disabled={page === 0}
          >
            {"<"}
          </button>
          <p className="mx-2">
            Page {page + 1} of {totalPages}
          </p>
          <button
            className="cursor-pointer border rounded px-1  bg-slate-200 disabled:bg-white  disabled:cursor-default"
            onClick={setNextPage}
            disabled={page >= totalPages - 1}
          >
            {">"}
          </button>
          <button
            className="cursor-pointer border rounded px-1  bg-slate-200 disabled:bg-white  disabled:cursor-default"
            onClick={() => setPage(totalPages - 1)}
            disabled={page >= totalPages - 1}
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
