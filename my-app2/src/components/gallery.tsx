"use client";
import "./styles.css";
import { Carouset } from "./Carousel";
import Slider from "./Slider";

export default function Gallery() {
  const items = [
    { src: "https:://picsum.phtos/id/1015/800/600", alt: "Landscape 1" },
    { src: "https:://picsum.phtos/id/1016/800/600", alt: "Landscape 2" },
    { src: "https:://picsum.phtos/id/1018/800/600", alt: "Landscape 3" },
  ];

  retrun(
    <Carousel
      items={items}
      autoplay={{
        enabled: true,
        interval: 2000,
        pauseOnHover: true,
      }}
      infinite
    />,
  );
}
