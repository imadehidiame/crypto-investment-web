// app/routes/dashboard._index.tsx
import React from 'react';
import { Link } from 'react-router';
import { Card } from '@/components/ui/card';
//import { Table } from 'lucide-react';
import { TableBody, Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import SectionWrapper from '@/components/shared/section-wrapper';
// Import Chart components (e.g., from 'react-chartjs-2')
// import { Line, Pie } from 'react-chartjs-2';

export interface RecentTransactionsData {
    id:number;
    type:string;
    date:string|Date;
    amount:number;
    plan?:string
}

type RecentTransactions = RecentTransactionsData[]

interface DatasetInterface {
    label?: string;
    data?: number[];
    borderColor?: string; // amber-300
    backgroundColor?: string | string[] ; // amber-300 with opacity
    tension?: number;
}

interface EarningsChartData {
    labels:string[];
    datasets:DatasetInterface[]; 
}
interface PortfolioChartData {
    labels: string[];
    datasets: DatasetInterface[]
}

interface DashboardData {
    balance: number;
    totalEarnings: number;
    activeInvestments: number;
    recentTransactions:RecentTransactions;
    earningsChartData:EarningsChartData;
    portfolioChartData:PortfolioChartData;
}

// Loader to fetch dashboard home data
export const loader = async ({ request, context }: any) => {
    // User data is available in context from middleware loader (if applied to parent /dashboard route)
    //const { user } = context.get(authContext); // Access user data

    // TODO: Fetch dashboard specific data from your backend:
    // - Current balance
    // - Total earnings
    // - Number of active investments
    // - Recent transactions
    // - Data for charts (earnings history, portfolio breakdown)

    const dashboardData = {
        balance: 7890.12, // Placeholder
        totalEarnings: 2567.89, // Placeholder
        activeInvestments: 5, // Placeholder
        recentTransactions: [ // Placeholder
            { id: 1, type: 'Deposit', amount: 1000, date: '2023-10-25' },
            { id: 2, type: 'Earning', amount: 15.50, date: '2023-10-26' },
            { id: 3, type: 'Investment', amount: 500, date: '2023-10-26', plan: 'Bronze' },
        ],
        earningsChartData: { // Placeholder data for Line chart
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Earnings',
                data: [100, 150, 200, 180, 250, 300],
                borderColor: '#FCD34D', // amber-300
                backgroundColor: 'rgba(252, 211, 77, 0.2)', // amber-300 with opacity
                tension: 0.4,
              },
            ],
         },
         portfolioChartData: { // Placeholder data for Pie chart
             labels: ['Bitcoin Plan', 'Ethereum Plan', 'Altcoin Plan'],
             datasets: [
                 {
                     data: [40, 30, 30], // Percentages
                     backgroundColor: ['#FCD34D', '#D97706', '#CA8A04'], // Shades of amber/gold
                 }
             ]
         }
    };

    //return { user, dashboardData };
};

interface PageProps {
    name:string;
    dashboard:DashboardData
}

const DashboardHome: React.FC<PageProps> = ({name,dashboard}) => {
    //const { user, dashboardData } = useLoaderData<typeof loader>();

  return (
    <SectionWrapper animationType='fadeInUp' padding='0' md_padding='0'>
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-amber-300">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 p-6 border border-amber-300/50">
          <h2 className="text-lg font-semibold mb-2 text-gray-300">Current Balance</h2>
          <p className="text-2xl font-bold text-white">${dashboard.balance.toFixed(2)}</p>
        </Card>
         <Card className="bg-gray-800 p-6 border border-amber-300/50">
           <h2 className="text-lg font-semibold mb-2 text-gray-300">Total Earnings</h2>
           <p className="text-2xl font-bold text-amber-300">${dashboard.totalEarnings.toFixed(2)}</p>
         </Card>
          <Card className="bg-gray-800 p-6 border border-amber-300/50">
            <h2 className="text-lg font-semibold mb-2 text-gray-300">Active Investments</h2>
            <p className="text-2xl font-bold text-white">{dashboard.activeInvestments}</p>
          </Card>
      </div>

      {/* Charts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Card className="bg-gray-800 p-6 border border-amber-300/50">
             <h2 className="text-xl font-bold mb-4 text-amber-300">Earnings Over Time</h2>
              <div className="h-64"> {/* Set a height for the chart container */}
                 {/* Replace with your Line chart component */}
                 {/* <Line data={dashboardData.earningsChartData} options={{ maintainAspectRatio: false }} /> */}
                 <p className="text-gray-400 text-center">Placeholder Earnings Chart</p>
              </div>
           </Card>
            <Card className="bg-gray-800 p-6 border border-amber-300/50">
              <h2 className="text-xl font-bold mb-4 text-amber-300">Portfolio Allocation</h2>
               <div className="h-64"> {/* Set a height */}
                 {/* Replace with your Pie chart component */}
                  {/* <Pie data={dashboardData.portfolioChartData} options={{ maintainAspectRatio: false }} /> */}
                  <p className="text-gray-400 text-center">Placeholder Portfolio Chart</p>
               </div>
            </Card>
       </div>


      {/* Recent Activity */}
       <Card className="bg-gray-800 p-6 border border-amber-300/50">
          <h2 className="text-xl font-bold mb-4 text-amber-300">Recent Activity</h2>
           {/* Use Shadcn Table or a list for recent transactions */}
            <div className="overflow-x-auto">
               <Table className="text-gray-300">
                 <TableHeader>
                   <TableRow className="border-gray-700">
                     <TableHead className="text-gray-300">Type</TableHead>
                     <TableHead className="text-gray-300">Amount</TableHead>
                     <TableHead className="text-gray-300">Date</TableHead>
                     {/* Add more columns */}
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {dashboard.recentTransactions.map(tx => (
                     <TableRow key={tx.id} className="border-gray-800 hover:bg-gray-700">
                        <TableCell>{tx.type}</TableCell>
                        <TableCell>${tx.amount.toFixed(2)}</TableCell>
                        <TableCell>{tx.date.toString()}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
            </div>
       </Card>


      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link to="/dashboard/subscribe">
           <Button className="bg-amber-300 text-gray-900 hover:bg-amber-400">Subscribe to New Plan</Button>
        </Link>
         {/* Add deposit/withdraw buttons linked to relevant pages/modals */}
          <Button variant="outline" className="border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-gray-900">Deposit Funds</Button>
      </div>
    </div>
    </SectionWrapper>
  );
};

export default DashboardHome;