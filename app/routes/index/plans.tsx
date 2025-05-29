// pages/SubscriptionPlansPage.tsx
import React from 'react';
//import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'; // Shadcn Accordion
import SectionWrapper from '@/components/shared/section-wrapper';

const SubscriptionPlansPage: React.FC = () => {
  const plans = [
    {
      id: 1,
      name: 'Bronze Plan',
      minInvestment: 100,
      maxInvestment: 1000,
      duration: '30 Days',
      dailyReturn: '1.5%',
      features: ['Daily Payouts', 'Basic Support'],
    },
    {
      id: 2,
      name: 'Silver Plan',
      minInvestment: 1001,
      maxInvestment: 5000,
      duration: '60 Days',
      dailyReturn: '2.0%',
      features: ['Daily Payouts', 'Priority Support', 'Investment Tracking'],
    },
    {
      id: 3,
      name: 'Gold Plan',
      minInvestment: 5001,
      maxInvestment: 10000,
      duration: '90 Days',
      dailyReturn: '2.5%',
      features: ['Daily Payouts', '24/7 Support', 'Advanced Analytics', 'Compounding Option'],
    },
    // Add more plans
  ];

  const faqs = [
    {q:'What is CoinInvest?',a:'COININVEST is a leading platform for cryptocurrency investments, offering secure and high-return opportunities.'},
          {q:'How secure is my investment?',a:'We use industry-standard encryption, cold storage, and multi-factor authentication to protect your funds.'},
          {q:'What is the minimum investment amount?',a:'You can start investing with just $100 in equivalent cryptocurrency.'},
          {q:'How are returns calculated?',a:'Returns are based on your investment plan, with monthly payouts tied to market performance and plan duration.'},
    {
      q: 'How do I choose a plan?',
      a: 'Consider your investment goals, risk tolerance, and the minimum/maximum investment amounts for each plan.',
    },
    {
      q: 'When do I receive my returns?',
      a: 'Returns are typically paid out daily, depending on the specific plan.',
    },
    // Add more FAQs
  ];

  return (
    <SectionWrapper animationType="fadeInUp">
      <section className="py-2">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gold">Investment Plans</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6 border border-gold flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gold">{plan.name}</h2>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Investment Range:</span> ${plan.minInvestment} - ${plan.maxInvestment}
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Duration:</span> {plan.duration}
                </p>
                <p className="text-gray-300 mb-4">
                  <span className="font-semibold">Daily Return:</span> {plan.dailyReturn}
                </p>
                <h3 className="text-lg font-semibold mb-2 text-white">Features:</h3>
                <ul className="list-disc list-inside text-gray-300">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 items-center align-items-center text-center">
                {/* Link to Get Started or a specific plan details page */}
                <a href={`/get-started?plan=${plan.id}`}> {/* Example linking */}
                  <Button size="lg" variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black text-lg px-8 py-6">
                                Invest Now
                </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>

        <section className="py-16">
           <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gold">Frequently Asked Questions</h2>
           <Accordion type="single" collapsible className="max-w-3xl mx-auto">
               {faqs.map((faq, index) => (
                   <AccordionItem value={`item-${index}`} key={index} className="border-gold-500/50">
                       <AccordionTrigger className="text-white hover:text-gold-500">{faq.q}</AccordionTrigger>
                       <AccordionContent className="text-gray-300">
                           {faq.a}
                       </AccordionContent>
                   </AccordionItem>
               ))}
           </Accordion>
        </section>

      </section>
      </SectionWrapper>
    
  );
};

export default SubscriptionPlansPage;