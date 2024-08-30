import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const newsItems = [
  "Breaking News: Market hits all-time high!",
  "Sports Update: Local team wins championship!",
  "Weather Alert: Heavy rain expected this weekend.",
  "Tech News: New smartphone model released today.",
  "Health Tips: 10 ways to stay healthy this winter.",
];

export const NewsBannerScrolling = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 3000); // Change news item every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="whitespace-nowrap animate-marquee overflow-hidden bg-white">
      {newsItems[currentIndex]}
    </div>
  );
};
