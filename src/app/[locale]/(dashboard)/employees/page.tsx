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
import { getTranslations } from "@/lib/translations";

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

  const t = getTranslations(locale);
  const employees = (await Employee.find()
    .sort({ createdAt: -1 })
    .lean()) as unknown as LeanEmployee[];
  return (
    <div className="space-y-6 p-4 md:p-6 min-w-0">
      <h1 className="text-2xl font-semibold">{t("employees.title")}</h1>

      <Card>
        <CardHeader>
          <div className="font-medium">{t("employees.addEmployee")}</div>
        </CardHeader>
        <CardContent>
          <form
            action={addEmployee}
            className="grid grid-cols-1 md:grid-cols-5 gap-3"
          >
            <div>
              <Label htmlFor="firstName">{t("employees.firstName")}</Label>
              <Input id="firstName" name="firstName" placeholder="Jane" />
            </div>
            <div>
              <Label htmlFor="lastName">{t("employees.lastName")}</Label>
              <Input id="lastName" name="lastName" placeholder="Doe" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">{t("employees.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <Label htmlFor="basePay">{t("employees.basePay")}</Label>
              <Input
                id="basePay"
                name="basePay"
                type="number"
                step="0.01"
                placeholder="15.00"
              />
            </div>
            <div className="md:col-span-5">
              <Button type="submit">{t("employees.addEmployee")}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="font-medium">{t("employees.directory")}</div>
        </CardHeader>
        <CardContent className="min-w-0">
          <Table>
            <THead>
              <TR>
                <TH>{t("employees.name")}</TH>
                <TH>{t("employees.email")}</TH>
                <TH>{t("employees.basePay")}</TH>
                <TH>{t("employees.status")}</TH>
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
