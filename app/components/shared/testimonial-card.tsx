import { Star } from "lucide-react";
import { Card } from "../ui/card";

export const TestimonialCard = ({ name, quote, avatar, rating, role }:{name:string,quote:string,avatar:string,rating:number,role?:string}) => (
    <Card className="bg-brand-darkGray border-gold text-white p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:shadow-brand-gold/30 hover:shadow-lg">
      {/* <img src={avatar || `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=D4AF37&color=0D0D0D`} alt={name} className="w-20 h-20 rounded-full mb-4 border-2 border-brand-gold" /> */}
      <div className="w-20 h-20 rounded-full mb-4 border-2 border-gold bg-brand-gold flex items-center justify-center text-brand-black text-2xl font-bold">
          {name.substring(0,1)}
      </div>
      <p className="text-lg italic text-gray-300 mb-4">"{quote}"</p>
      <div className="flex mb-2">
        {[...Array(rating)].map((_, i) => <Star key={i} fill="#D4AF37" strokeWidth={0} size={20} />)}
        {[...Array(5-rating)].map((_, i) => <Star key={i} stroke="#D4AF37" strokeWidth={1} size={20} />)}
      </div>
      <h4 className="font-semibold text-brand-gold text-xl">{name}</h4>
      {role && <p className="text-sm text-gray-400">{role}</p>}
    </Card>
  );