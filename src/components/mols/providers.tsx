"use client";
import React, { useEffect, useState, createContext, useCallback } from "react";
import { ThemeProvider } from "next-themes";
import toast, { Toaster as ReactHotToaster } from "react-hot-toast";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import LoaderHourglass from "./loader";
import { TooltipProvider } from "../ui/tooltip";
import { httpCodes } from "@/lib/refDictionary";
import { Media, Student, Guardian } from "@prisma/client";

import Link from "next/link";

// Public Pages Data Context

export const DataContext = createContext<{
  data: { media: Media[] | null };
  refreshData: () => void;
}>({ data: { media: null }, refreshData: () => {} });

export function RootProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [data, setData] = useState<{
    media: Media[];
  }>({
    media: [],
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

  const fetchPublicData = useCallback(async () => {
    try {
      const fetchOptions = {
        method: "GET",
      };
      const res_UIdata = await fetch("/api/data", fetchOptions).then(
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
    } catch (error: any) {
      toast.error(error.message || "Unknown error");
    } finally {
      setUIstate((prev) => ({ ...prev, loadingData: false }));
    }
  }, []);

  // fetch data
  useEffect(() => {
    fetchPublicData();
  }, []);

  // render
  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="system" attribute="class">
        <SessionProvider>
          <TooltipProvider>
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
                <p className="text-destructive text-sm italic">
                  {UIstate.error}
                </p>
              </div>
            ) : (
              <DataContext.Provider
                value={{ data, refreshData: fetchPublicData }}
              >
                {children}
              </DataContext.Provider>
            )}
          </TooltipProvider>
          <ReactHotToaster />
          <Toaster />
        </SessionProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

// Logged-In User Context

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
