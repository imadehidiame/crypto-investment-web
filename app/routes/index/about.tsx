import SectionWrapper from '@/components/shared/section-wrapper';
import { Card } from '@/components/ui/card';
import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <SectionWrapper animationType="fadeInUp">
      <section className="py-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gold">About CoinInvest</h1>

        <div className="max-w-5xl mx-auto text-gray-300 space-y-8">
          <p className='text-gray-400'>
            Welcome to CoinInvest, your trusted partner in cryptocurrency investments.
            Our mission is to provide a secure, transparent, and profitable platform
            for individuals to participate in the exciting world of digital assets.
          </p>
          <p className='text-gray-400'>
            Founded in 2019, CoinInvest was built on the principles of transparency,
            innovation, and accessibility. We believe that everyone should have
            access to the potential of crypto investments, regardless of their
            prior experience.
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-gold">Our Vision</h2>
          <p className='text-gray-400'>
            Our vision is to be a leading global platform for crypto investments,
            empowering our users to achieve financial freedom through smart and
            informed investment decisions.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-gold">Why We Are Different</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>AI-driven investment insights for personalized portfolio strategies.</li>
            <li>Low, transparent fees to maximize your returns.</li>
            <li>Diverse investment options, from Bitcoin to emerging altcoins.</li>
          </ul>

          {/* Team Section (Optional) */}
           {/*<h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-gold-500">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <Card className="bg-gray-800 p-6 text-center border border-gold-500/50">
                  <img src="/placeholder-avatar.png" alt="Team Member Name" className="h-24 w-24 rounded-full mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white">Team Member Name</h3>
                  <p className="text-gray-400">Title</p>
              </Card> 

              <Card className="bg-gray-800 p-6 text-center border border-gold-500/50">
                  <img src="/placeholder-avatar.png" alt="Team Member Name" className="h-24 w-24 rounded-full mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white">Team Member Name</h3>
                  <p className="text-gray-400">Title</p>
              </Card> 

              
              
          </div> */}

          <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-gold">Security and Trust</h2>
          <p className='text-gray-400'>
            We prioritize the security of your assets and personal information.
            CoinInvest employs advanced security measures, including end-to-end encryption,
            multi-factor authentication, and cold storage for 95% of assets, to ensure a safe investment
            environment.
          </p>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default AboutUsPage;