import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BarChart, Package } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getInventoryReport, getMonthlySalesReport } from "@/services/reportService";
import { useSellers } from "@/hooks/hooks";
import MonthPicker from "./MonthPicker"; // Adjust the import path as needed

export const reportsTab = () => {
  const [isLoading, setIsLoading] = useState({
    sales: false,
    inventory: false,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const { sessionSeller } = useSellers();

  const generateSalesReport = async () => {
    setIsLoading(prev => ({ ...prev, sales: true }));
    try {
      await getMonthlySalesReport({
        sellerId: sessionSeller.id,
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
      });
      
      toast({
        title: "Success",
        description: "Sales report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate sales report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, sales: false }));
    }
  };

  const generateInventoryReport = async () => {
    setIsLoading(prev => ({ ...prev, inventory: true }));
    try {
      await getInventoryReport();
      toast({
        title: "Success",
        description: "Inventory report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate inventory report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, inventory: false }));
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sales Report</CardTitle>
          <CardDescription>Generate a monthly sales report</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Select Month</label>
            <MonthPicker
              selectedDate={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
          
          <Button 
            onClick={generateSalesReport} 
            className="w-full"
            disabled={isLoading.sales}
          >
            <BarChart className="mr-2 h-4 w-4" />
            {isLoading.sales ? "Generating..." : "Generate Sales Report"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Report</CardTitle>
          <CardDescription>
            This one generates a general reports of the sellers in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={generateInventoryReport}
            className="w-full"
            disabled={isLoading.inventory}
          >
            <Package className="mr-2 h-4 w-4" />
            {isLoading.inventory ? "Generating..." : "Generate Inventory Report"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};