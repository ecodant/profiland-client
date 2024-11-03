import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BarChart, TrendingUp, DollarSign, Package } from "lucide-react";

export const reportsTab = () => {
  const generateReport = (reportType: string) => {
    // This is a placeholder function. In a real application, this would trigger the report generation process.
    console.log(`Generating ${reportType} report...`);
    // Here you would typically make an API call to generate the report
    alert(`${reportType} report generated successfully!`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sales Avarage Report</CardTitle>
          <CardDescription>Generate a report of your sales</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => generateReport("Sales")} className="w-full">
            <BarChart className="mr-2 h-4 w-4" /> Generate Sales Report
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Network Repor</CardTitle>
          <CardDescription>
            AGenerate a report of your contacts and their products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => generateReport("Performance")}
            className="w-full"
          >
            <TrendingUp className="mr-2 h-4 w-4" /> Generate Performance Report
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Generate a report of Contacts who bought some of your products
          </CardTitle>
          <CardDescription>Who are really you best contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => generateReport("Financial")}
            className="w-full"
          >
            <DollarSign className="mr-2 h-4 w-4" /> Generate Financial Report
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Another Report</CardTitle>
          <CardDescription>
            Check thing that may you interest in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => generateReport("Inventory")}
            className="w-full"
          >
            <Package className="mr-2 h-4 w-4" /> Generate Inventory Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
