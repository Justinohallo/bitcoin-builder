import type { Slide } from "@/lib/types";

interface SlideRendererProps {
  slide: Slide;
}

export function SlideRenderer({ slide }: SlideRendererProps) {
  switch (slide.type) {
    case "title":
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-100 mb-6">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-neutral-300">
              {slide.subtitle}
            </h2>
          )}
        </div>
      );

    case "content":
      return (
        <div className="flex flex-col justify-center h-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-4xl mx-auto">
          {slide.title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-100 mb-6 sm:mb-8">
              {slide.title}
            </h2>
          )}
          {slide.body && (
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-neutral-300 whitespace-pre-line leading-relaxed">
              {slide.body}
            </div>
          )}
        </div>
      );

    case "image":
      return (
        <div className="flex flex-col items-center justify-center h-full px-4 sm:px-8">
          {slide.image && (
            <div className="max-w-full max-h-[60vh] sm:max-h-[70vh] mb-4 sm:mb-6">
              <img
                src={slide.image.src}
                alt={slide.image.alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          )}
          {slide.image?.caption && (
            <p className="text-base sm:text-lg md:text-xl text-neutral-400 text-center max-w-2xl px-4">
              {slide.image.caption}
            </p>
          )}
        </div>
      );

    case "mixed":
      return (
        <div className="flex flex-col justify-center h-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-4xl mx-auto">
          {slide.title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-100 mb-6 sm:mb-8">
              {slide.title}
            </h2>
          )}
          {slide.image && (
            <div className="mb-6 sm:mb-8 max-w-full">
              <img
                src={slide.image.src}
                alt={slide.image.alt}
                className="max-w-full max-h-[40vh] sm:max-h-[50vh] object-contain rounded-lg mx-auto"
              />
              {slide.image.caption && (
                <p className="text-xs sm:text-sm md:text-base text-neutral-400 text-center mt-2 px-4">
                  {slide.image.caption}
                </p>
              )}
            </div>
          )}
          {slide.body && (
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-300 whitespace-pre-line leading-relaxed">
              {slide.body}
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-neutral-400">Unknown slide type</p>
        </div>
      );
  }
}
