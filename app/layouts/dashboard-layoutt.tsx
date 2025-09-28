import { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigation, Form } from 'react-router';
import { Button } from '@/components/ui/button';
import { Menu, User, DollarSign, History, Settings, MessageSquare, X, Wallet, TrendingUp, Loader2 } from 'lucide-react';
import { getSess } from './app-layout';
import type { Route } from './+types/dashboard-layoutt';
import { CIFullLogoDashboard } from './logos';
//import { useRef, useState } from 'react';
//import { NavLink } from 'react-router-dom';
//import { Button } from './ui/button'; // Adjust path based on your setup
//import { User, MessageSquare, Settings, X, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { log } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock data (replace with real data from your backend)
const portfolioData = [
  { date: '2025-05-01', value: 10000 },
  { date: '2025-05-02', value: 10500 },
  { date: '2025-05-03', value: 10000 },
  { date: '2025-05-04', value: 10800 },
  { date: '2025-05-05', value: 11000 },
  { date: '2025-05-06', value: 11500 },
];

const recentTransactions = [
  { id: '1', date: '2025-05-14', type: 'Buy', asset: 'BTC', amount: 0.5, value: 25000 },
  { id: '2', date: '2025-05-13', type: 'Sell', asset: 'ETH', amount: 2, value: 4000 },
];

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { account_info } = await import('@/lib/utils.server');
  const user_context = getSess(context);
  const account = await account_info(user_context?.user?._id!);
  //log(account,'Account info');
  //log(user_context,'USER CONTEXT')
  return { user: { name: user_context?.user?.name, email: user_context?.user?.email, role: user_context?.user?.role }, account };
};

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, dropdownOpen]);

  const handleLogout = () => {
    console.log('User logged out');
    setDropdownOpen(false);
  };



  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out overflow-visible`}
      >
        <div className="sticky top-0 z-30 bg-gray-900 min-h-[120px] overflow-visible">
          <div className="p-3 max-sm:p-2 flex justify-between items-start min-h-[120px] flex-shrink-0 overflow-visible">
            <CIFullLogoDashboard />
            <Button
              variant="ghost"
              className="md:hidden text-amber-300"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {loaderData.user.role === 'user' ? <nav className="mt-[-4px] px-4">
            <NavLink
              to="/dashboard"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
              end
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/profile"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </NavLink>
            <NavLink
              to="/dashboard/subscribe"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Subscriptions
            </NavLink>
            <NavLink
              to="/dashboard/transactions"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <History className="w-5 h-5 mr-2" />
              Transactions
            </NavLink>
            <NavLink
              to="/dashboard/investments"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Investments
            </NavLink>
            <NavLink
              to="/dashboard/deposits"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Deposits
            </NavLink>
            <NavLink
              to="/dashboard/settings"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </NavLink>
            <NavLink
              to="/dashboard/withdrawal"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <Wallet className="w-5 h-5 mr-2" />
              Withdrawals
            </NavLink>
            <NavLink
              to="/dashboard/messages"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Inbox
            </NavLink>

            {/*<NavLink
              to="/dashboard/chat-test"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat
            </NavLink>*/}

          </nav>
            :
            <nav className="mt-[-4px] px-4">
              <NavLink
                to="/dashboard/adm"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
                }
                end
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Dashboard
              </NavLink>
              <NavLink
                to="/dashboard/adm/profile"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
                }
              >
                <User className="w-5 h-5 mr-2" />
                Profile
              </NavLink>
              <NavLink
                to="/dashboard/adm/deposits"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
                }
              >
                <User className="w-5 h-5 mr-2" />
                Deposit
              </NavLink>
              <NavLink
                to="/dashboard/adm/adm-withdrawals"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
                }
              >
                <User className="w-5 h-5 mr-2" />
                Withdrawals
              </NavLink>
              <NavLink
                to="/dashboard/adm/messaging"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
                }
              >
                <User className="w-5 h-5 mr-2" />
                Messaging
              </NavLink>
              {/*<NavLink
                to="/dashboard/adm/chat-test-adm"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
                }
              >
                <User className="w-5 h-5 mr-2" />
                Chat
              </NavLink>
              <NavLink
              to="/dashboard/subscribe"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Subscriptions
            </NavLink>
            <NavLink
              to="/dashboard/transactions"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <History className="w-5 h-5 mr-2" />
              Transactions
            </NavLink>
            <NavLink
              to="/dashboard/investments"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Investments
            </NavLink>
            <NavLink
              to="/dashboard/deposits"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Deposits
            </NavLink>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </NavLink>
            <NavLink
              to="/dashboard/withdrawal"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <Wallet className="w-5 h-5 mr-2" />
              Withdrawals
            </NavLink>
            <NavLink
              to="/dashboard/messages"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-amber-300 text-black' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Inbox
            </NavLink>*/}
            </nav>
          }
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 w-full bg-gray-900 p-3 max-sm:p-2 flex justify-between items-center z-50 md:pl-[272px]">
          <Button
            variant="ghost"
            className="md:hidden text-amber-300"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="text-amber-300 font-semibold">Welcome, {loaderData.user.name?.split(' ')[0]}</div>

          <Header investable={loaderData.account?.investable!} earnings={loaderData.account?.earnings!} investments={loaderData.account?.investments!} role={loaderData.user.role as 'user'|'admin'} />

        </header>
        {/* Main content with padding to avoid overlap */}
        <div className="pt-16 md:ml-64">
          <Outlet />
        </div>
      </div>
    </div>
  );
}



interface HeaderDropdownProps {
  totalInvestableBalance: number;
  currentInvestmentTotal: number;
  investableBalance: number;
  handleLogout: () => void;
  role:'user'|'admin'
}

export function HeaderDropdown({
  totalInvestableBalance,
  currentInvestmentTotal,
  investableBalance,
  handleLogout,
  role
}: HeaderDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="text-amber-300 hover:text-amber-50 cursor-pointer"
        onClick={toggleDropdown}
        aria-label="User menu"
      >
        <User className="w-6 h-6" />
      </Button>
      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 md:w-80 sm:w-64">
          {/* Total Investable Balance */}
          <div className="flex items-center justify-between px-4 py-2 text-gray-300 border-b border-gray-700 md:flex-row sm:flex-col">
            <div className="flex items-center flex-nowrap">
              <Wallet className="w-4 h-4 mr-2 text-amber-300" />
              <span>Total Investable</span>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold bg-amber-300 text-gray-800">
              {formatCurrency(totalInvestableBalance)}
            </span>
          </div>

          {/* Current Investment Total */}
          <div className="flex items-center justify-between px-4 py-2 text-gray-300 border-b border-gray-700 md:flex-row sm:flex-col">
            <div className="flex items-center flex-nowrap">
              <TrendingUp className="w-4 h-4 mr-2 text-amber-300" />
              <span>Current Investments</span>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold bg-emerald-300 text-gray-800">
              {formatCurrency(currentInvestmentTotal)}
            </span>
          </div>

          {/* Investable Balance (Available to Invest Now) */}
          <div className="flex items-center justify-between px-4 py-2 text-gray-300 border-b border-gray-700 md:flex-row sm:flex-col">
            <div className="flex items-center flex-nowrap">
              <DollarSign className="w-4 h-4 mr-2 text-amber-300" />
              <span>Available to Invest</span>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold bg-blue-300 text-gray-800">
              {formatCurrency(investableBalance)}
            </span>
          </div>

          {/* Existing Navigation Links */}
          <NavLink
            to="/dashboard/profile"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700"
            onClick={() => setDropdownOpen(false)}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/messages"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700"
            onClick={() => setDropdownOpen(false)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Inbox
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700"
            onClick={() => setDropdownOpen(false)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </NavLink>

          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700">
                <X className="w-4 h-4 mr-2" />
                Logout
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-gray-100 border-amber-300/50">
              <DialogHeader>
                <DialogTitle className="text-white">Are you sure?</DialogTitle>
                <DialogDescription className="text-gray-300">
                  You'll have to log back in to access your earnings and wallet information
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                {/*<DialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">Cancel</AlertDialogCancel>*/}
                {/* Form to trigger the delete action when confirmed */}
                <Form method="POST" action={`/api/logout`} preventScrollReset={true}>
                  <input type="hidden" name="role" value={role} />

                  <Button type="submit" className="bg-red-500 text-white hover:bg-red-600" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin" />}
                    {isSubmitting  ? 'Logging out...' : 'Log out'}
                  </Button>
                </Form>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/*<button
            className="flex items-center w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
            
          >
            <X className="w-4 h-4 mr-2" />
            Logout
          </button>*/}
        </div>
      )}
    </div>
  );
}

const Header = ({ investments, investable, earnings, role }: { investments: number, investable: number, earnings: number, role:'user'|'admin' }) => {
  const handleLogout = () => {
    console.log('User logged out');
  };

  const [totalInvestableBalance, set_total] = useState<number>(earnings || 0);
  const [currentInvestmentTotal, set_investment] = useState<number>(investments || 0);
  const [investableBalance, set_investable] = useState<number>(investable || 0);

  useEffect(() => {
    set_total(totalInvestableBalance);
    set_investable(investableBalance);
    set_investment(currentInvestmentTotal);
  }, [totalInvestableBalance, currentInvestmentTotal, investableBalance])

  return (
    <HeaderDropdown
      totalInvestableBalance={totalInvestableBalance}
      currentInvestmentTotal={currentInvestmentTotal}
      investableBalance={investableBalance}
      handleLogout={handleLogout}
      role={role}
    />

  );
};