import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

export default function ProductSection({ title, products }) {
  const scrollContainerRef = useRef(null)

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="py-20 bg-pink-50">
      <div className="container mx-auto px-8 max-w-7xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">{title}</h2>

        <div className="relative px-14">
          <div 
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="flex-none w-72 bg-white rounded-lg shadow-md overflow-hidden group"
                whileHover={{ y: -5 }}
              >
                <div className="relative h-56">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                  <p className="text-pink-500 font-medium mt-2 text-lg">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-7 h-7 text-gray-600" />
          </button>

          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-7 h-7 text-gray-600" />
          </button>
        </div>

        <div className="flex justify-end mt-12">
          <motion.button 
            className="px-6 py-2 bg-[#bfc8ed] text-gray-800 border border-black rounded-md hover:bg-[#6c79b0] hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            See All
          </motion.button>
        </div>
      </div>
    </section>
  )
}