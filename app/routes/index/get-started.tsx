import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router';
import { UserPlus, Wallet, TrendingUp } from 'lucide-react';

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

export default function GetStarted() {
  const stepsRef = useScrollAnimation();
  const benefitsRef = useScrollAnimation();

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-16 px-4 md:px-6 bg-dark">
      <div ref={stepsRef}>
        <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-center text-white">Get Started with COININVESTDESK</h1>
        <p className="text-lg md:text-xl mb-8 text-center text-white font-medium max-w-3xl mx-auto">
          Start your journey to financial freedom in just a few simple steps. Our platform makes crypto investing seamless and rewarding.
        </p>
        <div className="space-y-8">
          <div className="card flex items-start bg-dark p-8 rounded-lg border border-gray">
            <UserPlus className="w-10 h-10 text-gold mr-6" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gold">Create Your Account</h3>
              <p className="text-white font-medium">Sign up in minutes with your email and a secure password. Complete identity verification for full access.</p>
            </div>
          </div>
          <div className="card flex items-start bg-dark p-8 rounded-lg border border-gray">
            <Wallet className="w-10 h-10 text-gold mr-6" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gold">Deposit Funds</h3>
              <p className="text-white font-medium">Securely deposit cryptocurrencies like Bitcoin or Ethereum using our integrated wallet system.</p>
            </div>
          </div>
          <div className="card flex items-start bg-dark p-8 rounded-lg border border-gray">
            <TrendingUp className="w-10 h-10 text-gold mr-6" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gold">Start Investing</h3>
              <p className="text-white font-medium">Choose an investment plan tailored to your goals and watch your wealth grow with monthly returns.</p>
            </div>
          </div>
        </div>
      </div>
      <div ref={benefitsRef} className="py-16">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center text-white">Why Invest with Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-dark p-8 rounded-lg border border-gray">
            <img
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485"
              alt="Flexible investment plans dashboard"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-4 text-gold">Flexible Plans</h3>
            <p className="text-white font-medium">Select from a range of investment plans designed to match your financial objectives.</p>
          </div>
          <div className="card bg-dark p-8 rounded-lg border border-gray">
            <img
              src="https://images.unsplash.com/photo-1516321310764-8181e22897a1"
              alt="24/7 customer support team"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-4 text-gold">24/7 Support</h3>
            <p className="text-white font-medium">Our dedicated support team is available around the clock to assist you.</p>
          </div>
          <div className="card bg-dark p-8 rounded-lg border border-gray">
            <img
              src="https://images.unsplash.com/photo-1642543492481-808d7c15a7f6"
              alt="Secure crypto vault"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-4 text-gold">Trusted Security</h3>
            <p className="text-white font-medium">Advanced encryption and multi-factor authentication keep your investments safe.</p>
          </div>
        </div>
        <div className="text-center mt-12">
          <Link to="/contact" className="btn-gold">Contact Us for More Info</Link>
        </div>
      </div>
    </div>
  );
}