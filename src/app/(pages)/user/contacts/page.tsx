"use client";

import Image from "next/image";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import WithTitleLayout from "@/components/layouts/withTitle";
import { UserContext } from "@/components/mols/providers";
import { Guardian, Student } from "@prisma/client";
import { useContext, useEffect, useMemo, useState } from "react";

type ContactType = Guardian & { children?: Student[] };

export default function Dashboard() {
  const users = useContext(UserContext);

  // Use useMemo to memoize the values
  const { guardians, students } = useMemo(() => {
    return {
      // Handle the case where context might be null
      guardians: users?.guardians ?? [],
      students: users?.students ?? [],
    };
  }, [users]);

  const [pagination, setPagination] = useState<{
    perPage: number;
    currentPage: number;
    totalPages: number;
  }>({ perPage: 10, currentPage: 1, totalPages: 1 });

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [filtContacts, setFiltContacts] = useState<ContactType[]>([]);

  // on searchPhrase change
  useEffect(() => {
    const filtContacts_ = guardians.filter(
      ({ name, students }) =>
        name.toLowerCase().includes(searchPhrase.toLowerCase()) ||
        students
          .map(({ name }: { name: string }) => name.toLowerCase())
          .join(" ")
          .includes(searchPhrase.toLowerCase())
    );
    setFiltContacts(filtContacts_);
  }, [guardians, searchPhrase]);

  return (
    <WithTitleLayout title="Contacts" description="Manage your contacts">
      {guardians.length > 0 ? (
        <Card x-chunk="dashboard-06-chunk-0 my-4">
          <CardHeader>
            {/* <CardTitle>Contacts</CardTitle> */}
            <CardDescription className="flex items-center">
              <div className="mr-auto flex items-center gap-2">
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchPhrase}
                  onChange={(e) => setSearchPhrase(e.target.value)}
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Contact
                  </span>
                </Button>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
              </div>
              <nav
                role="bottom-navigation"
                aria-label="pagination"
                className="mx-auto flex justify-center ml-auto mr-0 w-auto"
              >
                <ul className="flex flex-row items-center gap-1">
                  <li className="">
                    <button
                      disabled={
                        (pagination.currentPage - 1) * pagination.perPage +
                          1 ===
                        1
                      }
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage - 1,
                        }))
                      }
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-6 w-6"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-left h-3.5 w-3.5"
                      >
                        <path d="m15 18-6-6 6-6"></path>
                      </svg>
                      <span className="sr-only">Previous Page</span>
                    </button>
                  </li>
                  <li className="">
                    <button
                      disabled={
                        pagination.currentPage * pagination.perPage >=
                        filtContacts.length
                      }
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage + 1,
                        }))
                      }
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-6 w-6"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right h-3.5 w-3.5"
                      >
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                      <span className="sr-only">Next Page</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-popover hover:bg-popover">
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>

                  <TableHead className="hidden md:table-cell">Tel</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Whatsapp
                  </TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtContacts
                  // .slice(
                  //   (pagination.currentPage - 1) * pagination.perPage + 1,
                  //   pagination.currentPage * pagination.perPage + 1
                  // )
                  .map(
                    ({ id, name, avatar, email, tel, whatsapp, children }) => (
                      <TableRow key={id}>
                        <TableCell className="hidden sm:table-cell">
                          <Image
                            alt="Product image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={avatar || ""}
                            width="64"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tel}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {email}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {whatsapp}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {children?.length || 0}
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-popover py-4">
            {/* <div className="text-xs text-muted-foreground">
              Showing{" "}
              <strong>
                {(pagination.currentPage - 1) * pagination.perPage + 1}-
                {pagination.currentPage * pagination.perPage}
              </strong>{" "}
              of <strong>{filtContacts.length}</strong> contacts
            </div> */}
            <nav
              role="bottom-navigation"
              aria-label="pagination"
              className="mx-auto flex justify-center ml-auto mr-0 w-auto"
            >
              <ul className="flex flex-row items-center gap-1">
                <li className="">
                  <button
                    disabled={
                      (pagination.currentPage - 1) * pagination.perPage + 1 ===
                      1
                    }
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage - 1,
                      }))
                    }
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-6 w-6"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-left h-3.5 w-3.5"
                    >
                      <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    <span className="sr-only">Previous Page</span>
                  </button>
                </li>
                <li className="">
                  <button
                    disabled={
                      pagination.currentPage * pagination.perPage >=
                      filtContacts.length
                    }
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage + 1,
                      }))
                    }
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-6 w-6"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-right h-3.5 w-3.5"
                    >
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                    <span className="sr-only">Next Page</span>
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
        </Card>
      ) : (
        <p className="text-center">No contacts</p>
      )}
    </WithTitleLayout>
  );
}
