"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "app/components/ui/button"
//import { Checkbox } from "app/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "app/components/ui/dropdown-menu"
import { Input } from "app/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "app/components/ui/table"
import { set } from "zod"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    empty_data_message:string
    filter_column:string,
    filter_placeholder:string
  }

  export function DataTableDemo<TData,TValue>({filter_column,filter_placeholder,columns,data,empty_data_message}:DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [visible_row, setVisibleRow] = useState(2);
  //const [filter, setFilter] = useState({filter:filter_column,filter_text:filter_placeholder});

  

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  useEffect(() => {
    table.setPageSize(visible_row);
  }, [table])
  
  //table.setPageSize(2);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={filter_placeholder} 
          value={(table.getColumn(filter_column)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filter_column)?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-4"
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Max {visible_row}<ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            
            {
                [2, 4, 6, 8, 10].map(pageSize => (
                    <DropdownMenuItem key={pageSize} onClick={() => {
                    table.setPageSize(pageSize);
                    setVisibleRow(pageSize);
                    }}>
                    Max {pageSize}
                    </DropdownMenuItem>
                ))
            }    
          
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {empty_data_message}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Max {visible_row}<ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            
            {
                [2, 4, 6, 8, 10].map(pageSize => (
                    <DropdownMenuItem key={pageSize} onClick={() => {
                    table.setPageSize(pageSize);
                    setVisibleRow(pageSize);
                    }}>
                    Max {pageSize}
                    </DropdownMenuItem>
                ))
            }    
          
          </DropdownMenuContent>
        </DropdownMenu>

        </div>
      </div>
    </div>
  )
}
