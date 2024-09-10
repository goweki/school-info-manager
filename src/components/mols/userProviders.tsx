"use client";
import React, { useEffect, useState, createContext } from "react";
import toast from "react-hot-toast";
import LoaderHourglass from "./loader";
import { httpCodes } from "@/lib/refDictionary";
import { Student, Guardian } from "@prisma/client";

import Link from "next/link";

export const UserContext = createContext<{ [key: string]: any[] } | null>(null);

export function UserProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [data, setData] = useState<{ [key: string]: any[] } | null>(null);

  const [UIstate, setUIstate] = useState<{
    splashLag: boolean;
    loadingData: boolean;
    error: string;
  }>({ splashLag: true, loadingData: true, error: "" });

  // fetch data onMount
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
          // throw error
          throw new Error(res_UIdata.error || "unknown error");
        }
      })();
    } catch (error: any) {
      // update UIstate.error
      setUIstate((prev) => ({
        ...prev,
        error: error.message || "unknown error",
      }));
    } finally {
      setUIstate((prev) => ({ ...prev, loadingData: false }));
    }
  }, []);

  // render
  return (
    <>
      {UIstate.splashLag ? (
        <div className="flex h-full">
          <LoaderHourglass
            isLoading={UIstate.loadingData}
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
      ) : data ? (
        <UserContext.Provider value={data}>{children}</UserContext.Provider>
      ) : null}
    </>
  );
}
