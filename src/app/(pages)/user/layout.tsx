import WithNavLayout from "@/components/layouts/withNavBar";
import { UserProviders } from "@/components/mols/userProviders";
//
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProviders>
      <WithNavLayout> {children}</WithNavLayout>
    </UserProviders>
  );
}
