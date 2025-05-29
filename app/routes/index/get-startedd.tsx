// pages/GetStartedPage.tsx
import React from 'react';
//import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionWrapper from '@/components/shared/section-wrapper';
import { ShieldCheck, BarChart2, Users, UserCircle2Icon, ClockAlert } from 'lucide-react';
//import { Users } from 'node-appwrite';
// Import Lucide Icons for steps
// import { UserPlus, CreditCard, Package, TrendingUp } from 'lucide-react';

const GetStartedPage: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up quickly and securely to get started.',
      icon: 'UserPlusIcon', // Placeholder icon name
      link: '/auth',
      animation:'fadeInUp'
    },
    {
      number: 2,
      title: 'Fund Your Wallet',
      description: 'Deposit cryptocurrency or fiat to your CoinInvest wallet.',
      icon: 'CreditCardIcon', // Placeholder icon name
      // Link to a dashboard deposit page (after login)
      link: '/dashboard/deposit',
      animation:'fadeIn',
    },
    {
      number: 3,
      title: 'Choose a Plan',
      description: 'Browse our investment plans and select the one that fits your goals.',
      icon: 'PackageIcon', // Placeholder icon name
      link: '/plans',
      animation:'slideInLeft',
    },
    {
      number: 4,
      title: 'Start Earning',
      description: 'Invest in your chosen plan and watch your earnings grow.',
      icon: 'TrendingUpIcon', // Placeholder icon name
       // Link to a dashboard investments page (after login)
      link: '/dashboard/investments',
      animation:'slideInRight',
    },
  ];

  return (
    <>
    <SectionWrapper animationType='fadeInUp'>
      <section className="py-2 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-gold-500">Get Started with CoinInvest</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <SectionWrapper key={step.number} animationType={step.animation} delay={0.1 * index} padding={'2'} md_padding={'4'}>
                <Card className="p-6 border border-gold-500/50" style={{ '--delay': `${index * 0.2}s` } as React.CSSProperties}> {/* Add display-on-scroll */}
              <div className="text-gold-500 mb-4">
                 {/* Dynamically render Lucide Icon based on step.icon */}
                 {/* Example: {step.icon === 'UserPlusIcon' && <UserPlus className="h-12 w-12 mx-auto" />} */}
                 <div className="h-12 w-12 mx-auto text-4xl font-bold">{step.number}</div> {/* Using number as placeholder */}
              </div>
              <h2 className="text-xl font-semibold mb-2 text-white">{step.title}</h2>
              <p className="text-gray-300 mb-4">{step.description}</p>
               {step.link && (
                 <a href={step.link}>
                   <Button variant="outline" className="border-gold-500 text-gold-500">
                     {step.number === 1 ? 'Sign Up' : step.number === 3 ? 'Browse Plans' : 'Go'}
                   </Button>
                 </a>
               )}
            </Card>
            </SectionWrapper>

            
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4 text-gold-500">Ready to Begin?</h2>
          <p className="text-lg text-gray-300 mb-8">It only takes a few minutes to start your investment journey.</p>
          <a href="/auth">
            <Button size="lg" className="bg-gold-500 text-black hover:bg-gold-600">
              Create Your Account
            </Button>
          </a>
        </div>
      </section>
    </SectionWrapper>

    <SectionWrapper animationType="fadeInUp">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-brand-gold">
          Why Choose CoinInvest?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck size={48} className="text-brand-gold mb-4" />, title: 'Flexible Plans', description: 'Select from a range of investment plans designed to match your financial objectives.' },
            { icon: <ClockAlert size={48} className="text-brand-gold mb-4" />, title: '24/7 Customer Support Team', description: 'Our dedicated support team is available around the clock to assist you.' },
            { icon: <UserCircle2Icon size={48} className="text-brand-gold mb-4" />, title: 'Secure Crypto Vault', description: 'Advanced encryption and multi-factor authentication keep your investments safe.' },
          ].map(feature => (
            <Card key={feature.title} className="bg-brand-darkGray border-brand-lightGray text-center p-6 hover:shadow-xl hover:shadow-brand-gold/20 transition-shadow duration-300" style={ {'boxShadow' : '0 10px 20px rgba(0, 0, 0, 0.3)'}}>
              <CardHeader className="flex flex-col items-center">
                {feature.icon}
                <CardTitle className="text-brand-gold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>

    </>
  );
};

export default GetStartedPage;