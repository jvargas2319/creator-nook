import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageCircle } from "lucide-react";
import type { Content } from "./types";

const placeholderImages = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
];

interface ContentCarouselProps {
  content: Content[];
}

export const ContentCarousel = ({ content }: ContentCarouselProps) => {
  if (content.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, index) => (
          <Card key={index} className="bg-[#1A1A1A] border-gray-800">
            <CardContent className="p-4">
              <img
                src={placeholderImages[index % placeholderImages.length]}
                alt="Placeholder"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-white">Sample Content</h3>
                <p className="text-sm text-gray-400">
                  This is a placeholder for your future content. Start creating!
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((item, index) => (
        <Card key={item.id} className="bg-[#1A1A1A] border-gray-800">
          <CardContent className="p-4">
            <img
              src={placeholderImages[index % placeholderImages.length]}
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                {item.is_premium && (
                  <span className="px-2 py-1 text-xs bg-primary text-white rounded">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">{item.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>0</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>0</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};