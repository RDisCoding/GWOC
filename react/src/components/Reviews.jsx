import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { useState } from "react"

const reviews = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    text: "The best cupcakes I've ever had! The frosting is perfectly sweet and the cake is so moist.",
  },
  {
    id: 2,
    name: "John D.",
    rating: 3,
    text: "Ordered a custom cake for my daughter's birthday and it exceeded all expectations!",
  },
  {
    id: 3,
    name: "Emily R.",
    rating: 5,
    text: "Absolutely loved the variety of flavors! Perfect for any occasion.",
  },
  {
    id: 4,
    name: "Michael T.",
    rating: 5,
    text: "The presentation was beautiful, and the taste was even better!",
  },
  {
    id: 5,
    name: "Sophia L.",
    rating: 4,
    text: "Great quality and service. Will definitely order again!",
  },
  {
    id: 6,
    name: "David K.",
    rating: 5,
    text: "A must-try for anyone who loves desserts. Simply amazing!",
  },
  {
    id: 7,
    name: "Olivia P.",
    rating: 5,
    text: "The delivery was on time, and the cake was fresh and delicious.",
  },
]

export default function Reviews() {
  const [showAll, setShowAll] = useState(false)

  // Show only 6 reviews initially, or all reviews if "See All Reviews" is clicked
  const visibleReviews = showAll ? reviews : reviews.slice(0, 6)

  return (
    <section className="py-16 bg-pink-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Customer Reviews</h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto rounded-full mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {visibleReviews.map((review) => (
            <motion.div
              key={review.id}
              className="bg-[#d9d9d9] rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed">{review.text}</p>
              <p className="font-medium text-gray-800">{review.name}</p>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-end">
          <motion.button
            className="px-6 py-2 bg-[#bfc8ed] text-gray-800 border border-black rounded-md hover:bg-[#6c79b0] hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAll(!showAll)} // Toggle between showing all and limited reviews
          >
            {showAll ? "Show Less" : "See All Reviews"}
          </motion.button>
        </div>
      </div>
    </section>
  )
}