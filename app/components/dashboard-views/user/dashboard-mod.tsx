import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, TrendingUp, Layers, DollarSign } from 'lucide-react';
import SectionWrapper from '@/components/shared/section-wrapper';
import { NumberFormat } from '@/components/number-field';

// Interfaces
export interface RecentTransactionsData {
  id: number;
  type: string;
  date: string | Date;
  amount: number;
  plan?: string;
}

type RecentTransactions = RecentTransactionsData[];

interface DatasetInterface {
  label?: string;
  data?: number[];
  borderColor?: string;
  backgroundColor?: string | string[];
  tension?: number;
}

interface EarningsChartData {
  labels: string[];
  datasets: DatasetInterface[];
}

interface PortfolioChartData {
  labels: string[];
  datasets: DatasetInterface[];
}

interface DashboardData {
  balance: number | string;
  totalEarnings: number;
  activeInvestments: number;
  recentTransactions: RecentTransactions;
  earningsChartData: EarningsChartData;
  portfolioChartData: PortfolioChartData;
  marketTrends: { asset: string; price: number; change: number }[];
  earnings_title?:string;
}

interface PageProps {
  name?: string;
  dashboard: DashboardData;
}

const DashboardHome: React.FC<PageProps> = ({ dashboard }) => {
  const [currency_data,set_currency_data] = useState<{
    img:string,
    currency:string,
    value:string|number
  }[]>([]);

  useEffect(()=>{

    const run = async ()=>{
      const search = new URLSearchParams({ price: '1' }).toString();
      const fetched = await fetch(`https://api.cryptapi.io/info/?${search}`, { method: 'GET' });
      const {btc,eth,trc20} = await fetched.json();
      const needed_data = Object.entries({btc,eth,trc20});
      const formatted_data = needed_data.reduce((acc,[currency,ccurrency_data_value])=>{
        if(currency == 'trc20'){
          ccurrency_data_value = ccurrency_data_value.usdt;
        }
        const {logo,prices,ticker} = ccurrency_data_value;

        const ret = {
          currency:ticker.toLocaleUpperCase(),
          img:logo,
          value: NumberFormat.thousands(prices['USD'] as string,{add_if_empty:true,length_after_decimal:2,allow_decimal:true,allow_zero_start:true}) 
        }
        return acc.concat([ret]);
      },[] as {
        img:string,
        currency:string,
        value:string|number
      }[]);
      set_currency_data(formatted_data);
    }
    run();

  },[]);

  return (
    <SectionWrapper animationType="fadeInUp" padding="0" md_padding="0">
      <div className="p-4 max-sm:px-0 space-y-8 max-w-full overflow-x-hidden">
        
        <CardTitle className="text-xl sm:text-2xl font-medium text-amber-300">Dashboard Overview</CardTitle>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="bg-gray-800 p-6 border border-amber-300/50 w-full">
            <CardHeader className="flex items-center gap-2 p-0">
              <Wallet className="w-6 h-6 text-amber-300" />
              <CardTitle className="text-lg font-semibold text-amber-300">Current Balance</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <p className="text-2xl font-medium text-gray-300">
                ${NumberFormat.thousands(dashboard.balance, {
                  allow_decimal: true,
                  length_after_decimal: 2,
                  add_if_empty: true,
                  allow_zero_start: true,
                })}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 p-6 border border-amber-300/50 w-full">
            <CardHeader className="flex items-center gap-2 p-0">
              <TrendingUp className="w-6 h-6 text-amber-300" />
              <CardTitle className="text-lg font-semibold text-amber-300">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <p className="text-2xl font-medium text-gray-300">${dashboard.totalEarnings.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 p-6 border border-amber-300/50 w-full">
            <CardHeader className="flex items-center gap-2 p-0">
              <Layers className="w-6 h-6 text-amber-300" />
              <CardTitle className="text-lg font-semibold text-amber-300">Active Investments</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <p className="text-2xl font-medium text-gray-300">{dashboard.activeInvestments}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 p-6 border border-amber-300/50 w-full">
            <CardHeader className="flex items-center gap-2 p-0">
              <DollarSign className="w-6 h-6 text-amber-300" />
              <CardTitle className="text-lg font-semibold text-amber-300">Market Trends</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2 space-y-2">
              {currency_data.map((trend) => (
                <div key={trend.currency} className="text-gray-300 flex gap-2">
                  <span className=''>{trend.currency}: </span> <img src={trend.img} className='h-5 w-5' /> ${trend.value} 
                  {/*(
                  <span className={trend.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {trend.change >= 0 ? '+' : ''}{trend.change}%
                  </span>
                  )*/}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
  <Card className="bg-gray-800 p-6 max-sm:px-2 max-sm:py-2 border border-amber-300/50 w-full mx-auto">
    <CardHeader>
      <CardTitle className="text-xl font-medium text-amber-300">{dashboard.earnings_title ?? 'Earnings Over Time'}</CardTitle>
    </CardHeader>
    <CardContent className="p-0 max-sm:py-0 min-h-[410px] max-sm:min-h-[410px] box-content">
      <div className="flex items-center justify-center w-full h-full">
        <ResponsiveContainer
          width="100%"
          height={300}
          className="max-sm:h-[400px] sm:h-[400px] md:h-[420px]"
        >
          <LineChart
            data={dashboard.earningsChartData.datasets[0].data?.map((value, index) => ({
              date: dashboard.earningsChartData.labels[index],
              value,
            }))}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis dataKey="date" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Line type="monotone" dataKey="value" stroke="#FCD34D" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
  <Card className="bg-gray-800 p-6 max-sm:px-2 max-sm:py-2 border border-amber-300/50 w-full mx-auto">
    <CardHeader>
      <CardTitle className="text-xl font-medium text-amber-300">Active Plans</CardTitle>
    </CardHeader>
    <CardContent className="p-0 max-sm:py-0 min-h-[450px] max-sm:min-h-[450px] box-content">
      <div className="flex items-center justify-center w-full h-full">
        <ResponsiveContainer
          width="100%"
          height={300}
          className="max-sm:h-[440px] sm:h-[400px] md:h-[420px]"
        >
          <PieChart>
            <Pie
              data={dashboard.portfolioChartData.labels
                .map((label, index) => ({
                  name: label,
                  value: dashboard.portfolioChartData.datasets[0].data?.[index] || 0,
                }))
                .filter((item) => item.value > 0)} // Remove zero/negative values
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={115}
              label={({ name, value, cx, cy, midAngle, outerRadius }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 15; // Reduced distance
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#fff"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize={12}
                  >
                    {`${name}: ${value}`}
                  </text>
                );
              }}
              labelLine
            >
              {dashboard.portfolioChartData.labels
                .map((_, index) => ({
                  index,
                  value: dashboard.portfolioChartData.datasets[0].data?.[index] || 0,
                }))
                .filter((item) => item.value > 0)
                .map((item, idx) => (
                  <Cell
                    key={`cell-${item.index}-${item.value}`} // Unique key
                    fill={dashboard.portfolioChartData.datasets[0].backgroundColor?.[item.index] as string}
                  />
                ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                color: '#FCD34D',
                border: '2px solid #FCD34D',
                borderRadius: '4px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
</div>

        {/* Recent Activity */}
        <Card className="bg-gray-800 max-sm:px-3 p-2 border border-amber-300/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-amber-300">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className='max-sm:px-0'>
            {dashboard.recentTransactions.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table className="text-gray-300">
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-amber-300">Type</TableHead>
                        <TableHead className="text-amber-300">Amount</TableHead>
                        <TableHead className="text-amber-300">Date</TableHead>
                        <TableHead className="text-amber-300">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboard.recentTransactions.map((tx) => (
                        <TableRow key={tx.id} className="border-gray-800 hover:bg-gray-700">
                          <TableCell>{tx.type}</TableCell>
                          <TableCell
                            className={`${tx.type.includes('Withdrawal') || tx.type.includes('Investment')  ? 'text-red-400' : 'text-green-400'}`}
                          >
                            {tx.amount}
                          </TableCell>
                          <TableCell>{tx.date.toString()}</TableCell>
                          <TableCell>{tx.plan || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Vertical Layout */}
                <div className="md:hidden space-y-4 max-sm:px-0">
                  {dashboard.recentTransactions.map((tx) => (
                    <Card key={tx.id} className="bg-gray-900 p-4 border border-gray-700">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type</span>
                          <span className="text-white">{tx.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount</span>
                          <span
                            className={`${tx.type.includes('Withdrawal') || tx.type.includes('Investment') ? 'text-red-400' : 'text-green-400'}`}
                          >
                            {tx.amount}
                          </span>
                        </div>
                        <div className="flex justify-between"> 
                          <span className="text-gray-400">Date</span>
                          <span className="text-white">{tx.date.toString()}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-gray-400">Description</span>
                          <span className="text-white">{tx.plan || '-'}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400">No recent transactions found.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <NavLink to="/dashboard/subscribe" className="w-full sm:w-auto">
            <Button className="bg-amber-300 text-gray-900 hover:bg-amber-400 w-full sm:w-auto cursor-pointer">
              Subscribe to New Plan
            </Button>
          </NavLink>
          <NavLink to="/dashboard/deposits" className="w-full sm:w-auto cursor-pointer">
          <Button
            variant="outline"
            className="border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-gray-900 w-full sm:w-auto cursor-pointer"
          >
            Deposit Funds
          </Button>
          </NavLink>
          <NavLink to="/dashboard/withdrawwal" className="w-full sm:w-auto cursor-pointer">
          <Button
            variant="outline"
            className="border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-gray-900 w-full sm:w-auto cursor-pointer"
          >
            Withdraw Funds
          </Button>
          </NavLink>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default DashboardHome;