import { motion } from "framer-motion"
import { Heart, Cake, LeafyGreen, ChefHat } from "lucide-react"

export default function AboutUs() {
  const features = [
    {
      icon: <LeafyGreen className="w-6 h-6" />,
      title: "100% Vegetarian",
      description: "Pure vegetarian delights crafted with care"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Preservative-Free",
      description: "Fresh, homemade goodness in every bite"
    },
    {
      icon: <Cake className="w-6 h-6" />,
      title: "Variety of Treats",
      description: "From cupcakes to ice creams, we have it all"
    },
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "Eggless",
      description: "Baked with love, completely egg-free for everyone to enjoy"
    }
  ]

  return (
    <section className="py-16 bg-pink-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Our Sweet Story
              </h2>
              <div className="w-24 h-1 bg-pink-500 mx-auto rounded-full mb-6"></div>
            </motion.div>

            <motion.p
              className="text-gray-700 leading-relaxed text-lg mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Welcome to Bindi's Cupcakery, where sweetness meets artistry. Every creation
              that leaves our cloud kitchen is a testament to our passion for baking and our
              commitment to quality. We take pride in crafting preservative-free, vegetarian
              desserts that bring joy to every celebration.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * index }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-pink-100 p-3 rounded-lg text-pink-500">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-8"
          >
          <div>
            <h3 className="text-2xl text-center font-bold text-gray-800 mb-4">Find Us Here</h3>
            <div className="w-24 h-1 bg-pink-500 mx-auto rounded-full mb-6"></div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1779.7708922126694!2d72.79214347884053!3d21.174841846525148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ddd6c47ac89%3A0x91125e2f18dbb796!2s24%20Carats%20Mithai%20Magic!5e0!3m2!1sen!2sin!4v1739715320892!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl shadow-md"
            ></iframe>
          </div>
        </motion.div>
      </motion.div>
    </div>
    </section >
  )
}