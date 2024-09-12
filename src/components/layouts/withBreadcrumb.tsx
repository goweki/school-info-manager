import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

const WithBreadcrumbLayout = ({
  paths,
  pageName,
  children,
}: Readonly<{
  paths: { [key: string]: string }[];
  pageName: string;
  children: React.ReactNode;
}>) => {
  return (
    <section className="pb-10 pt-8 lg:pb-20 lg:pt-12">
      <Breadcrumb className="px-4">
        <BreadcrumbList>
          {paths.map((path) => (
            <Fragment key={path.name}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={path.link}>{path.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          ))}

          <BreadcrumbItem>
            <BreadcrumbPage>{pageName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </section>
  );
};

export default WithBreadcrumbLayout;
