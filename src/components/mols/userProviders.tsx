"use client";
import React, { useEffect, useState, createContext } from "react";
import toast from "react-hot-toast";
import LoaderHourglass from "./loader";
import { httpCodes } from "@/lib/refDictionary";
import { Student, Guardian } from "@prisma/client";

import Link from "next/link";

export const UserContext = createContext<{
  students: Student[];
  guardians: Guardian[];
}>({ students: [], guardians: [] });

export function UserProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [data, setData] = useState<{
    students: Student[];
    guardians: Guardian[];
  }>({
    students: [],
    guardians: [],
  });

  const [UIstate, setUIstate] = useState<{
    splash: boolean;
    splashLag: boolean;
    loadingData: boolean;
    error: string;
  }>({ splash: true, splashLag: true, loadingData: true, error: "" });

  // onMount
  useEffect(() => {
    setTimeout(() => {
      setUIstate((prev) => ({ ...prev, splash: false }));
    }, 4000);
  }, []);

  // fetch data
  useEffect(() => {
    try {
      (async () => {
        const fetchOptions = {
          method: "GET",
        };
        const res_UIdata = await fetch("/api/user/data", fetchOptions).then(
          async (res_) => {
            if (res_.ok) {
              return await res_.json();
            } else {
              console.error(`ERROR: ` + JSON.stringify(res_));
              return { error: httpCodes[res_.status] };
            }
          }
        );
        if (res_UIdata?.success) {
          setData(res_UIdata.success);
        } else {
          // update UIstate.
          setUIstate((prev) => ({
            ...prev,
            error: res_UIdata.error || "unknown error",
          }));
        }
        setUIstate((prev) => ({ ...prev, loadingData: false }));
      })();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        // Handle other types of errors
        toast.error("Unknown error, try again later");
      }
    }

    return () => {
      // Cleanup logic here
    };
  }, []);

  // render
  return (
    <>
      {UIstate.splashLag ? (
        <div className="flex h-full">
          <LoaderHourglass
            isLoading={UIstate.splash || UIstate.loadingData}
            onExited={() =>
              setUIstate((prev) => ({ ...prev, splashLag: false }))
            }
          />
        </div>
      ) : UIstate.error ? (
        <div className="text-center p-4 m-auto">
          ERROR encountered.{" "}
          <Link href="/" className="font-bold">
            {" "}
            Click here{" "}
          </Link>{" "}
          to go back to home, or try again later.{" "}
          <p className="text-destructive text-sm italic">{UIstate.error}</p>
        </div>
      ) : (
        <UserContext.Provider value={data}>{children}</UserContext.Provider>
      )}
    </>
  );
}
