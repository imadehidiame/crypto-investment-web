import React from 'react';
import { Link, NavLink } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ShieldCheck, BarChart2, Users, Star } from 'lucide-react';
import SectionWrapper from '@/components/shared/section-wrapper';
import { PlanCard } from '@/components/shared/plan-card';
import { TestimonialCard } from '@/components/shared/testimonial-card';
//import  CoinInvestLogo  from '@/assets/logo_full.svg';
//import  CoinInvestMobile  from '@/assets/logo_mobile.svg';
import { CIFullLogo, CIShortLogo } from '@/layouts/logos';


// Mock Data (replace with API calls)
const featuredPlans = [
  { id: 1, name: 'Starter Plan', price: '$100', roi: '10% Monthly', duration: '3 Months', features: ['Basic Support', 'Low Risk'], ctaText: 'Subscribe', onChoosePlan: () => {} },
  { id: 2, name: 'Pro Plan', price: '$1000', roi: '15% Monthly', duration: '6 Months', features: ['Priority Support', 'Medium Risk', 'Analytics'], ctaText: 'Subscribe', onChoosePlan: () => {} },
];

const testimonials = [
  { id: 1, name: 'Sarah L.', quote: 'CoinInvest helped me grow my savings significantly!', avatar: '/path-to-avatar1.png', rating: 5 },
  { id: 2, name: 'John B.', quote: 'Transparent and reliable. Highly recommend!', avatar: '/path-to-avatar2.png', rating: 5 },
];

const HomePage = () => {
  return (
    <div className="bg-brand-black text-white">
      {/* Hero Section */}
      <SectionWrapper className="relative h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/crypto1.jpg'), linear-gradient(135deg, #1C2526 0%, #2A3435 100%)", top: 0, left: 0 }}>
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>
        <div className="relative z-10">
        <div className="flex justify-center items-center w-full max-w-full p-0">
          <CIFullLogo />
        </div>
  
          <h1 className="text-4xl md:text-6xl font-bold text-gold-500 mb-4 animate-fadeIn">
            Invest in Crypto, Grow Your Future
          </h1>
          <p className="text-lg md:text-xl mb-8 animate-fadeIn animate-delay-200">
            Secure and profitable crypto investment opportunities for everyone.
          </p>
          <NavLink to={'/get-started'}>
          <Button size="lg" variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black text-lg px-8 py-6 cursor-pointer">
              Get Started
            </Button>  
          </NavLink>
          
        </div>
      </SectionWrapper>

      {/* Intro Section */}
      <SectionWrapper className="bg-gradient-to-br from-brand-black via-brand-darkGray to-brand-black text-center min-h-[70vh] flex flex-col justify-center items-center" animationType="fadeIn">
        <p className="text-lg md:text-xl text-center text-gray-300 mb-8 max-w-2xl mx-auto">
          Unlock the power of cryptocurrency investments. Secure, transparent, and profitable plans tailored for you.
        </p>
        <div className="space-x-4">
          <Link to="/get-started">
            <Button size="lg" className="bg-brand-gold text-brand-black hover:bg-opacity-80 text-lg px-8 py-6">
              Start Investing
            </Button>
          </Link>
          <Link to="/plans">
            <Button size="lg" variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black text-lg px-8 py-6">
              View Plans
            </Button>
          </Link>
        </div>
        <div className="mt-12 flex justify-center space-x-8 text-amber-300">
          <Zap size={32} />
          <ShieldCheck size={32} />
          <BarChart2 size={32} />
        </div>
      </SectionWrapper>

      {/* Why Choose Us Section */}
      <SectionWrapper animationType="fadeInUp">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gold">
          Why Choose CoinInvest?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 border-gold">
          {[
            { icon: <ShieldCheck size={48} className="text-brand-gold mb-4" />, title: 'Secure Investments', description: 'State-of-the-art security measures to protect your assets.' },
            { icon: <BarChart2 size={48} className="text-brand-gold mb-4" />, title: 'Profitable Returns', description: 'Competitive ROI on various investment plans.' },
            { icon: <Users size={48} className="text-brand-gold mb-4" />, title: 'Expert Support', description: 'Dedicated support team to assist you 24/7.' },
          ].map(feature => (
            <Card
              key={feature.title}
              className="bg-brand-darkGray border-2 border-gold text-center p-6 hover:shadow-xl hover:shadow-brand-gold/20 transition-shadow duration-300"
              style={{ boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' }}
            >
              <CardHeader className="flex flex-col items-center">
                {feature.icon}
                <CardTitle className="text-gray-300">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Featured Plans Section */}
      <SectionWrapper className="bg-brand-darkGray" animationType="slideInLeft">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gold">
          Our Popular Plans
        </h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 border-gold gap-8 max-w-4xl mx-auto">
          {featuredPlans.map(plan => (
            <PlanCard key={plan.id} {...plan} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/plans">
          <NavLink to={'/plans'}>
          <Button size="lg" variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black text-lg px-8 py-6 cursor-pointer">
              See All Plans
            </Button>  
          </NavLink>
          </Link>
        </div>
      </SectionWrapper>

      {/* Testimonials Snippet */}
      <SectionWrapper animationType="fadeInUp">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gold border-gold">
          What Our Investors Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto border-gold">
          {testimonials.slice(0, 2).map(testimonial => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/testimonials">
            <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black">
              Read More Testimonials
            </Button>
          </Link>
        </div>
      </SectionWrapper>

      {/* Our Partners Section */}
      <SectionWrapper animationType="fadeInUp">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gold">
          Our Partners
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(image => (
            <Card
              key={image}
              className="bg-brand-darkGray border-2 border-gold text-center p-6 hover:shadow-xl hover:shadow-brand-gold/20 transition-shadow duration-900"
              style={{ boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' }}
            >
              <CardContent className='border-gold'>
                <img src={`/img/partner${image}.png`} alt={"Partner " + image} className="partner-image" />
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Call to Action */}
      <SectionWrapper className="bg-brand-gold text-brand-black" animationType="fadeIn">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Elevate Your Crypto Portfolio?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto text-gray-400">
            Join thousands of successful investors who trust CoinInvest.
          </p>
          <NavLink to={'/auth/signup'}>
          <Button size="sm" variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black text-lg px-8 py-6 cursor-pointer">
              Create Your Account Now
            </Button>  
          </NavLink>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default HomePage;