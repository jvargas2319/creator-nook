import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const suggestions = [
  {
    id: 1,
    name: "Sarah Cr...",
    username: "@sarahcr",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    isVerified: true,
  },
  {
    id: 2,
    name: "Lele",
    username: "@YourArtist2001",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    isVerified: true,
  },
  {
    id: 3,
    name: "Kap",
    username: "@thekitty",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    isVerified: true,
  },
  {
    id: 4,
    name: "CANDY",
    username: "@candyw",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    isVerified: true,
  },
];

export const Suggestions = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Suggestions</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-gray-800 border-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-gray-800 border-gray-700"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Carousel className="w-full">
        <CarouselContent>
          {suggestions.map((suggestion) => (
            <CarouselItem key={suggestion.id} className="basis-full sm:basis-1/2 lg:basis-full">
              <Card className="bg-[#1A1A1A] border-gray-800 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={suggestion.imageUrl}
                    alt={suggestion.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-white truncate">
                        {suggestion.name}
                      </p>
                      {suggestion.isVerified && (
                        <svg
                          className="h-4 w-4 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {suggestion.username}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
                  >
                    Follow
                  </Button>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};