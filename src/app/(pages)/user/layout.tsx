import WithNavLayout from "@/components/layouts/withNavBar";

//
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WithNavLayout> {children}</WithNavLayout>;
}
