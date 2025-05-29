
//import { type LoaderFunctionArgs,  } from 'react-router';
import { NavLink } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Calendar, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import SectionWrapper from '@/components/shared/section-wrapper';
//import { a } from 'node_modules/framer-motion/dist/types.d-CQt5spQA';

// Mock data (replace with MongoDB query)
export interface Withdrawal {
  _id: string;
  plan: string;
  userId: string;
  invested: number;
  startDate: Date;
  isWithdrawal: boolean;
  withdrawal: number; 
  endDate: Date;
  residual_after_withdrawal: number;
 duration: number;
 earnings: number; 
 total: number; 
 dailyReturn:number
 is_active: boolean; 
 remaining_days: number;
status:number
}


interface PageProps {
    withdrawals:Withdrawal[]
}



export default function Withdrawals({withdrawals}:PageProps) {
  //const { withdrawals } = useLoaderData<typeof loader>();
  const [search,set_search] = useState('');
  const [is_asc,set_is_asc] = useState(true);
  const [filteredWithdrawals,setFilteredWithdrawals] = useState(withdrawals);
  const handleFilterClick = ()=>{
    console.log('Sorting');
    //setFilteredWithdrawals(prev=>prev.sort((a,b)=>a.plan.lo))
    setFilteredWithdrawals(prev=>prev.sort((a,b)=>( is_asc ? (a.startDate.getTime() - b.startDate.getTime()) : (b.startDate.getTime() - a.startDate.getTime()) )))
    set_is_asc(prev=>!prev);
    console.log(filteredWithdrawals);
  }

  useEffect(()=>{
    setFilteredWithdrawals(withdrawals.filter(e=>e.plan.toLocaleLowerCase().includes(search.toLocaleLowerCase())))
  },[search]);


  return (
    <SectionWrapper animationType='fadeInUp' padding='0' md_padding='0'>
    <div className="max-sm:py-6 max-sm:px-0 p-6 bg-black text-white min-h-screen">
      <Card className="bg-gray-800 border border-amber-300/50">
        <CardHeader>
          <CardTitle className="text-2xl font-medium text-amber-300">Withdrawals</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by plan name..."
                className="pl-10 bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300"
                value={search}
                onChange={(ee) => {
                    set_search(prev=>ee.target.value);
                    
                }}
              />
            </div>
            <Button
              variant="outline"
              className="border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-gray-900"
              onClick={handleFilterClick}
            >
              {is_asc && <SortAsc className="w-5 h-5" />}
              {!is_asc && <SortDesc className="w-5 h-5" />}
              Sort by Date
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {filteredWithdrawals.length > 0 ? (
            filteredWithdrawals.map((withdrawal) => (
              <div
                key={withdrawal._id}
                className="max-sm:p-6 p-6 bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 max-sm:text-sm">
                      <DollarSign className="w-5 h-5 text-amber-300" />
                      <span className="text-lg font-semibold text-white">
                        {withdrawal.plan}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300 max-sm:text-sm">
                      <span>Invested:</span>
                      <span className="font-medium text-gray-300">${withdrawal.invested.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300 max-sm:text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        Current Total:
                      </span>
                      <span className="font-medium text-gray-300">
                                ${withdrawal.total.toFixed(2)}
                            </span>
                    </div>
                    {(withdrawal.isWithdrawal) &&  (
                      <div className="flex items-center gap-2 text-amber-300 max-sm:text-sm">
                        <span>{ withdrawal.status === 2 ? 'Withdrawn:' : 'Withdrawal Request:'}</span>
                        <span className="font-medium text-gray-300">${withdrawal.withdrawal.toFixed(2)}</span>
                      </div>
                    )}
                    {withdrawal.isWithdrawal === true && (
                        <div className="flex items-center gap-2 text-amber-300 max-sm:text-sm">
                            <span>Residual:</span>
                            <span className="font-medium text-gray-300">
                                ${withdrawal.residual_after_withdrawal.toFixed(2)}
                            </span>
                        </div>
                    )}
                        
                    <div className="flex items-center gap-2 text-amber-300 max-sm:text-sm">
                      <Calendar className="w-4 h-4" />
                      <span className='text-gray-300'>
                        {new Date(withdrawal.startDate).toLocaleDateString()} -{' '}
                        {new Date(withdrawal.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300">
                      <Clock className="w-4 h-4" />
                      <span className='text-amber-300'>Status: </span> <span className='text-gray-300'> {withdrawal.isWithdrawal ? 'Withdrawn' : 'Active'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300 max-sm:text-sm">
                            <span>Duration:</span>
                            <span className="font-medium text-gray-300">
                                {withdrawal.duration} day(s)
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-amber-300 max-sm:text-sm">
                            <span>Daily Return:</span>
                            <span className="font-medium text-gray-300">
                                {withdrawal.dailyReturn.toFixed(2)}%
                            </span>
                        </div>
                  </div>


                    {
                      (withdrawal.is_active && withdrawal.withdrawal === 0) &&
                      <Button
                      className="bg-amber-300 text-gray-900 hover:bg-amber-400 w-full sm:w-auto"
                      disabled={(withdrawal.is_active && withdrawal.withdrawal == 0) || withdrawal.withdrawal > 0}
                    >
                       {`Withdraw in ${withdrawal.remaining_days} day(s) time`}
                    </Button>
                    }

                    {
                      (!withdrawal.is_active && withdrawal.withdrawal === 0) &&
                      <NavLink to={`/dashboard/withdrawal/request/${withdrawal._id}`}>
                    <Button
                      className="bg-amber-300 text-gray-900 hover:bg-amber-400 w-full sm:w-auto"
                      disabled={(withdrawal.is_active && withdrawal.withdrawal == 0) || withdrawal.withdrawal > 0}
                    >
                      Withdraw Funds
                    </Button>
                  </NavLink>
                    }

                    {(withdrawal.withdrawal > 0) && 
                    <Button
                      className="bg-amber-300 text-gray-900 hover:bg-amber-400 w-full sm:w-auto"
                      disabled={true}
                    >
                        { withdrawal.status === 1 ? 'Withdrawal Request Sent' : 'Withdrawal Complete' }
                    </Button>
                    }



                  {/*<NavLink to={`/dashboard/withdrawal/request/${withdrawal._id}`}>
                    <Button
                      className="bg-amber-300 text-gray-900 hover:bg-amber-400 w-full sm:w-auto"
                      disabled={(withdrawal.is_active && withdrawal.withdrawal == 0) || withdrawal.withdrawal > 0}
                    >
                      {withdrawal.is_active && withdrawal.withdrawal === 0 ? `Withdraw in ${withdrawal.remaining_days} day(s) time` : withdrawal.withdrawal == 0 ? 'Withdraw' :'Withdrawn' }
                    </Button>
                  </NavLink>*/}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-6">
              <p>No withdrawals found.</p>
              <NavLink to="/dashboard/withdrawal/request">
                <Button className="mt-4 bg-amber-300 text-gray-900 hover:bg-amber-400">
                  Request Withdrawal
                </Button>
              </NavLink>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </SectionWrapper>
    )
}