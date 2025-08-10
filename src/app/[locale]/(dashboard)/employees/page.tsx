import { connectToDatabase } from "@/lib/db";
import { Employee } from "@/models/Employee";
import { addEmployee } from "./actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
// import { getTranslations } from "next-intl/server";

type LeanEmployee = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  basePay: number;
  status: string;
};

export default async function EmployeesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/login`);
  await connectToDatabase();

  // const t = await getTranslations();
  const employees = (await Employee.find()
    .sort({ createdAt: -1 })
    .lean()) as unknown as LeanEmployee[];
  return (
    <div className="space-y-6 p-4 md:p-6 min-w-0">
      <h1 className="text-2xl font-semibold">Xodimlar</h1>

      <Card>
        <CardHeader>
          <div className="font-medium">Xodim qo'shish</div>
        </CardHeader>
        <CardContent>
          <form
            action={addEmployee}
            className="grid grid-cols-1 md:grid-cols-5 gap-3"
          >
            <div>
              <Label htmlFor="firstName">Ism</Label>
              <Input id="firstName" name="firstName" placeholder="Jane" />
            </div>
            <div>
              <Label htmlFor="lastName">Familiya</Label>
              <Input id="lastName" name="lastName" placeholder="Doe" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">Elektron pochta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <Label htmlFor="basePay">Asosiy maosh</Label>
              <Input
                id="basePay"
                name="basePay"
                type="number"
                step="0.01"
                placeholder="15.00"
              />
            </div>
            <div className="md:col-span-5">
              <Button type="submit">Xodim qo'shish</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="font-medium">Katalog</div>
        </CardHeader>
        <CardContent className="min-w-0">
          <Table>
            <THead>
              <TR>
                <TH>Ism</TH>
                <TH>Elektron pochta</TH>
                <TH>Asosiy maosh</TH>
                <TH>Holat</TH>
              </TR>
            </THead>
            <TBody>
              {employees.map((e) => (
                <TR key={e._id}>
                  <TD className="font-medium">
                    {e.firstName} {e.lastName}
                  </TD>
                  <TD className="text-neutral-600">{e.email}</TD>
                  <TD>${e.basePay}/hr</TD>
                  <TD>{e.status}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
