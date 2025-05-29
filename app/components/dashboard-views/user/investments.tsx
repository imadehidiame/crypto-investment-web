import React, { useState } from 'react';
import { useLoaderData, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import SectionWrapper from '@/components/shared/section-wrapper';
import { NumberFormat } from '@/components/number-field';
import { cn } from '@/lib/utils';

interface Earning {
  id: string;
  plan: string;
  invested: number;
  startDate: Date | string;
  duration: number;
  currentEarnings?: number;
  totalEarnings?: number;
  status: string;
  _status: number;
}

export interface EarningsData {
  active: Earning[];
  completed: Earning[];
}

interface PageProps {
  investmentsData: EarningsData;
}

const InvestmentsPage: React.FC<PageProps> = ({ investmentsData }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const investments = {
    active: investmentsData.active.map(e => ({ ...e, duration: `${e.duration} days` })),
    completed: investmentsData.completed.map(e => ({ ...e, duration: `${e.duration} days` })),
  };

  return (
    <SectionWrapper animationType="slideInRight" padding="0" md_padding="0">
      <div className="max-sm:py-6 max-sm:px-0 p-6 space-y-8">
        <CardTitle className="text-xl sm:text-2xl font-medium text-amber-300">My Investments</CardTitle>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-gray-700">
          <Button
            variant="ghost"
            className={cn(
              'flex-1 py-2 text-gray-300 hover:text-amber-300 hover:bg-gray-700',
              activeTab === 'active' ? 'border-b-2 border-amber-300 text-amber-300' : ''
            )}
            onClick={() => setActiveTab('active')}
          >
            Active Investments
          </Button>
          <Button
            variant="ghost"
            className={cn(
              'flex-1 py-2 text-gray-300 hover:text-amber-300 hover:bg-gray-700',
              activeTab === 'completed' ? 'border-b-2 border-amber-300 text-amber-300' : ''
            )}
            onClick={() => setActiveTab('completed')}
          >
            Completed Investments
          </Button>
        </div>

        {/* Tab Content */}
        <Card className="bg-gray-800 px-0 py-6 border border-amber-300/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-amber-300">
              {activeTab === 'active' ? 'Active Investments' : 'Completed Investments'}
            </CardTitle>
          </CardHeader>
          <CardContent className='max-sm:px-0'>
            {investments[activeTab].length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table className="text-gray-300">
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Plan</TableHead>
                        <TableHead className="text-gray-300">Invested</TableHead>
                        <TableHead className="text-gray-300">Start Date</TableHead>
                        <TableHead className="text-gray-300">Duration</TableHead>
                        <TableHead className="text-gray-300">{activeTab === 'active' ? 'Current Earnings' : 'Total Earnings'}</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investments[activeTab].map((inv) => (
                        <TableRow key={inv.id} className="border-gray-800 hover:bg-gray-700">
                          <TableCell className="font-medium text-white">{inv.plan}</TableCell>
                          <TableCell>${inv.invested.toFixed(2)}</TableCell>
                          <TableCell>{inv.startDate as string}</TableCell>
                          <TableCell>{inv.duration}</TableCell>
                          <TableCell className="text-amber-300">
                            ${activeTab === 'active'
                              ? inv.currentEarnings?.toFixed(2)
                              : NumberFormat.thousands(
                                  inv.totalEarnings ? inv.totalEarnings.toFixed(2) : inv.currentEarnings!.toFixed(2),
                                  { allow_decimal: true, length_after_decimal: 2, add_if_empty: false, allow_zero_start: true }
                                )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                'px-2 py-1 rounded-full text-xs font-semibold',
                                activeTab === 'active'
                                  ? 'bg-green-500/20 text-green-400'
                                  : inv._status === 1
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-blue-500/20 text-blue-400'
                              )}
                            >
                              {activeTab === 'active' ? inv.status : inv._status === 1 ? 'Withdrawal Request' : inv.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Vertical Layout */}
                <div className="md:hidden space-y-4 px-0">
                <SectionWrapper animationType="fadeInUp" padding="0" md_padding="0">
                  {investments[activeTab].map((inv) => (
                    <Card key={inv.id} className="bg-gray-900 p-6 border border-gray-700">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Plan</span>
                          <span className="font-medium text-white">{inv.plan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Invested</span>
                          <span className="text-white">${inv.invested.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Start Date</span>
                          <span className="text-white">{inv.startDate as string}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Duration</span>
                          <span className="text-white">{inv.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{activeTab === 'active' ? 'Current Earnings' : 'Total Earnings'}</span>
                          <span className="text-amber-300">
                            ${activeTab === 'active'
                              ? inv.currentEarnings?.toFixed(2)
                              : NumberFormat.thousands(
                                  inv.totalEarnings ? inv.totalEarnings.toFixed(2) : inv.currentEarnings!.toFixed(2),
                                  { allow_decimal: true, length_after_decimal: 2, add_if_empty: false, allow_zero_start: true }
                                )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span
                            className={cn(
                              'px-2 py-1 rounded-full text-xs font-semibold',
                              activeTab === 'active'
                                ? 'bg-green-500/20 text-green-400'
                                : inv._status === 1
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-blue-500/20 text-blue-400'
                            )}
                          >
                            {activeTab === 'active' ? inv.status : inv._status === 1 ? 'Withdrawal Request' : inv.status}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                  </SectionWrapper>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400">
                You have no {activeTab === 'active' ? 'active' : 'completed'} investments.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Link to Subscribe */}
        <div className="text-center mt-8">
          <Link to="/dashboard/subscribe">
            <Button size="lg" className="bg-amber-300 text-gray-900 hover:bg-amber-400">
              Invest in a New Plan
            </Button>
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default InvestmentsPage;