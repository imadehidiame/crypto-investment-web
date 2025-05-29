// pages/TestimonialsPage.tsx
import React from 'react';
//import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import SectionWrapper from '@/components/shared/section-wrapper';
import { Quote, QuoteIcon } from 'lucide-react';
// Import Lucide Icons for quotes or stars if needed
// import { Quote } from 'lucide-react';

const TestimonialsPage: React.FC = () => {
  // TODO: Fetch testimonials data
  const testimonials = [
    {
      id: 1,
      quote: "CoinInvest has been a game-changer for my portfolio. The returns are consistent and the platform is incredibly easy to use.",
      author: "Sarah K.",
      title: "Satisfied Investor",
      a:'fadeInUp'
    },
    {
      id: 2,
      quote: "I was new to crypto investing, but CoinInvest's clear plans and helpful support made it simple to get started. Highly recommended!",
      author: "David L.",
      title: "New User Success",
      a:'slideInLeft'
    },
    {
        id: 3,
        quote: "The security measures at CoinInvest give me peace of mind. I feel confident investing my funds here.",
        author: "Michael P.",
        title: "Trusting Client",
        a:'slideInRight',
    },
    // Add more testimonials
  ];

  return (
    <SectionWrapper animationType='fadeIn' md_padding='4' padding='2'>
      <section className="py-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gold-500">What Our Users Say</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <SectionWrapper key={testimonial.id} animationType={testimonial.a} delay={0.1*index} padding='2' md_padding='4'>
                <Card className="p-6 border border-gold italic text-gray-300" style={{ '--delay': `${index * 0.2}s` } as React.CSSProperties}> {/* Add display-on-scroll */}
               { /*<Quote className="h-8 w-8 text-gold-500 mb-4" />*/ }
              <p className="mb-4"><Quote className='h-4 w-4 mr-2 text-gold' />{testimonial.quote}<Quote className='h-4 w-4 text-gold' /></p>
              <p className="text-right font-semibold text-gold-500">- {testimonial.author}</p>
              {testimonial.title && <p className="text-right text-sm text-gray-400">{testimonial.title}</p>}
            </Card>
            </SectionWrapper>
            
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
};

export default TestimonialsPage;