"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const images = ["/animations/GWOC_Carousel.png", "https://c.ndtvimg.com/2020-04/chd4rs3g_dessert_625x300_07_April_20.jpg", "/animations/GWOC_Carousel.png", "https://c.ndtvimg.com/2020-04/chd4rs3g_dessert_625x300_07_April_20.jpg"]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="bg-pink-50 py-8">
      <div 
        className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-lg group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Aspect ratio container */}
        <div className="relative w-full" style={{ paddingTop: "39.0625%" }}> {/* (500/1280 * 100) */}
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <img
                  src={images[currentIndex] || "/placeholder.svg"}
                  alt={`Slide ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-pink-50 
                         hover:bg-pink transition-all duration-300 flex items-center justify-center
                         opacity-0 group-hover:opacity-100 shadow-lg z-10"
              onClick={prevSlide}
            >
              <span className="text-2xl text-gray-800">←</span>
            </button>
            
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-pink-50 
                         hover:bg-pink transition-all duration-300 flex items-center justify-center
                         opacity-0 group-hover:opacity-100 shadow-lg z-10"
              onClick={nextSlide}
            >
              <span className="text-2xl text-gray-800">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-3 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 
                       ${index === currentIndex ? "bg-pink-500" : "bg-pink-200"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}