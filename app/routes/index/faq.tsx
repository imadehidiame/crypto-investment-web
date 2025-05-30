import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { HelpCircle } from 'lucide-react';
import  { Card } from '@/components/ui/card';
import SectionWrapper from '@/components/shared/section-wrapper';

const useScrollAnimation = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (elementRef.current && typeof window !== 'undefined') {
      import('gsap').then((gsap) => {
        import('gsap/ScrollTrigger').then((ScrollTrigger) => {
          gsap.default.registerPlugin(ScrollTrigger.default);
          gsap.default.fromTo(
            elementRef.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: elementRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
          ScrollTrigger.default.refresh();
        });
      });
    }
  }, []);
  return elementRef;
};

export default function FAQ() {
  const faqRef = useScrollAnimation();
  const supportRef = useScrollAnimation();
  const animations = ['fadeInUp','fadeIn','slideInRight','slideInLeft']; 

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-2 px-4 md:px-6">
      <div ref={faqRef}>
        <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-center text-gold">Frequently Asked Questions</h1>
        <p className="text-lg md:text-xl mb-12 text-center text-gray-400 font-medium max-w-3xl mx-auto">
          Find answers to common questions about COININVESTDESK, our investment plans, and security measures.
        </p>
        <div className="space-y-6">

        {[
          {q:'What is CoinInvest?',a:'COININVEST is a leading platform for cryptocurrency investments, offering secure and high-return opportunities.'},
          {q:'How secure is my investment?',a:'We use industry-standard encryption, cold storage, and multi-factor authentication to protect your funds.'},
          {q:'What is the minimum investment amount?',a:'You can start investing with just $100 in equivalent cryptocurrency.'},
          {q:'How are returns calculated?',a:'Returns are based on your investment plan, with monthly payouts tied to market performance and plan duration.'},
          {q:'How do I choose a plan?',a:'Consider your investment goals, risk tolerance, and the minimum/maximum investment amounts for each plan.'},
          {q:'When do I receive my returns?',a:'Returns are typically paid out daily, depending on the specific plan.'}
        ].map((e,i)=>(
          <SectionWrapper key={`index-${i}`} animationType={animations[1]} delay={0.1*i} className=''>
            <Card className="p-6 border border-gold-500/50 hover:border-brand-gold transition-all duration-300 transform hover:scale-105">
          <div className='flex items-start'>
            <HelpCircle className="w-8 h-8 text-gold mr-4" />
          <div>
            <h4 className="text-xl font-semibold mb-2 text-gold">{e.q}</h4>
            <p className="text-gray-400 mb-4">{e.a}</p>
          </div>
          </div>
          </Card>
          </SectionWrapper>
          
        ))
          }

          {/*<div className="card p-8 rounded-lg border border-gray">
            <div className="flex items-start">
              <HelpCircle className="w-8 h-8 text-gold mr-4" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gold">What is COININVESTDESK?</h3>
                <p className="text-white font-medium">COININVESTDESK is a leading platform for cryptocurrency investments, offering secure and high-return opportunities.</p>
              </div>
            </div>
          </div>
          <div className="card p-8 rounded-lg border border-gray">
            <div className="flex items-start">
              <HelpCircle className="w-8 h-8 text-gold mr-4" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gold">How secure is my investment?</h3>
                <p className="text-white font-medium">We use industry-standard encryption, cold storage, and multi-factor authentication to protect your funds.</p>
              </div>
            </div>
          </div>
          <div className="card bg-dark p-8 rounded-lg border border-gray">
            <div className="flex items-start">
              <HelpCircle className="w-8 h-8 text-gold mr-4" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gold">What is the minimum investment amount?</h3>
                <p className="text-white font-medium">You can start investing with just $100 in equivalent cryptocurrency.</p>
              </div>
            </div>
          </div>
          <div className="card bg-dark p-8 rounded-lg border border-gray">
            <div className="flex items-start">
              <HelpCircle className="w-8 h-8 text-gold mr-4" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gold">How are returns calculated?</h3>
                <p className="text-white font-medium">Returns are based on your investment plan, with monthly payouts tied to market performance and plan duration.</p>
              </div>
            </div>
          </div>*/}
        </div>
      </div>
      <div ref={supportRef} className="py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gold">Still Have Questions?</h2>
        <p className="text-gray-400 font-medium mb-8">Our support team is here to help. Reach out via our contact page or live chat.</p>
        <Link to="/contact" className="btn-gold">Contact Support</Link>
      </div>
    </div>
  );
}