import api from "./api";

interface MonthlyReportParams {
  sellerId: string;
  year: number;
  month: number;
}

function downloadFile(response: any) {
  // Get filename from content-disposition header or use a default
  const contentDisposition = response.headers['content-disposition'];
  let filename = 'report.txt';
  
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }

  // Create blob from response data
  const blob = new Blob([response.data], { type: 'text/plain' });
  
  // Create download link and trigger download
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function getInventoryReport(): Promise<void> {
  try {
    const response = await api.get('/profiland/reports/inventory', {
      responseType: 'blob'
    });
    downloadFile(response);
  } catch (error) {
    console.error('Error downloading inventory report:', error);
    throw new Error('Failed to download inventory report');
  }
}

export async function getMonthlySalesReport(params: MonthlyReportParams): Promise<void> {
  try {
    const response = await api.get(
      `/profiland/reports/monthly-sales/${params.sellerId}`,
      {
        params: {
          year: params.year,
          month: params.month
        },
        responseType: 'blob'
      }
    );
    downloadFile(response);
  } catch (error) {
    console.error('Error downloading monthly sales report:', error);
    throw new Error('Failed to download monthly sales report');
  }
}