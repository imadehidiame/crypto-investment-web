import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SectionWrapper from '@/components/shared/section-wrapper';

interface Transaction {
  id: string;
  date: string | Date;
  type: string;
  amount: number | string;
  status: string;
  description?: string;
}

type TransactionData = Transaction[];

interface PageProps {
  transactions: TransactionData;
}

const TransactionHistoryPage: React.FC<PageProps> = ({ transactions }) => {
  return (
    <SectionWrapper animationType="fadeInUp" padding="0" md_padding="0">
      <div className="space-y-8 p-6 max-sm:py-6 max-sm:px-1">
        <CardTitle className="text-2xl font-medium text-amber-300">Transaction History</CardTitle>

        <Card className="bg-gray-800 max-sm:px-3 p-6 border border-amber-300/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-amber-300">All Transactions</CardTitle>
          </CardHeader>
          <CardContent className='max-sm:px-0'>
            {transactions.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table className="text-gray-300">
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Amount</TableHead>
                        <TableHead className="text-gray-300">Description</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id} className="border-gray-800 hover:bg-gray-700">
                          <TableCell>{tx.date as string}</TableCell>
                          <TableCell>{tx.type}</TableCell>
                          <TableCell
                            className={`${(tx.amount as string).startsWith('-') ? 'text-red-400' : 'text-green-400'}`}
                          >
                            {tx.amount}
                          </TableCell>
                          <TableCell>{tx.description || '-'}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                tx.status === 'Completed'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Vertical Layout */}
                <div className="md:hidden space-y-4">
                  {transactions.map((tx) => (
                    <Card key={tx.id} className="bg-gray-900 p-6 border border-gray-700">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Date</span>
                          <span className="text-white">{tx.date as string}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type</span>
                          <span className="text-white">{tx.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount</span>
                          <span
                            className={`${(tx.amount as string).startsWith('-') ? 'text-red-400' : 'text-green-400'}`}
                          >
                            {tx.amount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              tx.status === 'Completed'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-gray-400">Description</span>
                          <span className="text-white">{tx.description || '-'}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400">No transactions found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
};

export default TransactionHistoryPage;