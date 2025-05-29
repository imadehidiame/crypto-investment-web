import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const PlanCard = ({ name, price, roi, duration, features = [], ctaText = "Choose Plan", onChoosePlan }:{
    name:string,
    price:number|string,
    roi:number|string,
    duration:number|string,
    features:string[],
    ctaText: string,
    onChoosePlan:()=>void
}) => (
    <Card className="bg-brand-darkGray border-gold text-white flex flex-col hover:border-brand-gold transition-all duration-300 transform hover:scale-105">
      <CardHeader className="bg-brand-lightGray p-6 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-brand-gold">{name}</CardTitle>
        <p className="text-3xl font-semibold text-white mt-2">{price}</p>
        <p className="text-sm text-gray-300">{roi} over {duration}</p>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <Star size={16} className="text-brand-gold mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <div className="p-6 pt-0">
        <Button className="w-full bg-brand-gold text-brand-black hover:bg-opacity-80 cursor-pointer" onClick={onChoosePlan}>
          {ctaText}
        </Button>
      </div>
    </Card>
  );