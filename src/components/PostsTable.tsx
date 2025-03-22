import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";
import Table, { SortingState } from "./Table";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { useDebounce } from "use-debounce";

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: Date;
};

const fetchPosts = async (
  page: number,
  pageSize: number,
  sorting: SortingState,
  search: string
) => {
  const response = await api.get(`/`, {
    params: {
      page,
      pageSize,
      sortBy: sorting.field,
      sortOrder: sorting.order,
      search,
    },
  });
  return response.data;
};

const PostsTable = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sorting, setSorting] = useState<SortingState>({
    field: "id",
    order: "asc",
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500); // Debounce search with 300ms delay

  const { isLoading, isError, data } = useQuery({
    queryKey: ["posts", page, pageSize, sorting, debouncedSearch],
    queryFn: () => fetchPosts(page, pageSize, sorting, debouncedSearch),
  });

  const columnHelper = createColumnHelper<Post>();

  const columns = [
    columnHelper.accessor("id", {
      header: () => <span>ID</span>,
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("title", {
      header: () => <span>Title</span>,
      cell: (info) => <i>{info.getValue()}</i>,
      enableSorting: true,
    }),
    columnHelper.accessor("content", {
      header: () => "Content",
      cell: (info) => info.renderValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("created_at", {
      header: () => <span>Created At</span>,
      enableSorting: true,
    }),
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }
  return (
    <Table
      data={data.data}
      total={data.total}
      columns={columns}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      sorting={sorting}
      setSorting={setSorting}
      search={search}
      setSearch={setSearch}
    ></Table>
  );
};

export default PostsTable;
