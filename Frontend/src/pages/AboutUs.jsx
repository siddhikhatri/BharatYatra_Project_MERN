import { motion } from 'framer-motion';
import { Award, Shield, Headphones, Users } from 'lucide-react';

export default function AboutUs() {
  const features = [
    {
      icon: Award,
      title: 'Best Quality Service',
      description: 'We ensure premium quality in every aspect of your travel experience.',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your safety is our priority with verified hotels and trusted partners.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all your travel needs.',
    },
  ];

  return (

    <div id="about" className="min-h-screen bg-white pt-20">
      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="rounded-3xl   shadow-lg">
                <img
                  src="/TajMahal.webp"
                  alt="Taj Mahal"
                  className="w-full h-[600px] object-cover rounded-xl"
                />
              </div>
              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute -bottom-12 -right-6 bg-white rounded-2xl shadow-xl p-6 flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  👥
                </div>
                <div>
                  <p className="text-3xl font-bold text-dark">10K+</p>
                  <p className="text-black">Happy Travelers</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <p className="text-primary font-semibold text-lg mb-4">ABOUT US</p>
              <h2 className="text-5xl font-bold text-dark mb-6">
                Crafting Memorable
                <br />
                <span className="text-primary">Journeys Since</span>
                <br />
                <span className="text-secondary">2015</span>
              </h2>

              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Bharat Yatra is your trusted companion for exploring the incredible diversity of India. 
                From the snow-capped Himalayas to the serene backwaters of Kerala, we curate experiences 
                that create lasting memories.
              </p>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Our team of travel experts handpicks every destination, accommodation, and experience to 
                ensure you get the best of India without the hassle. We believe travel should be 
                transformative, not stressful.
              </p>

              {/* Features */}
              <div className="space-y-6">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={24} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-dark mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
              Why Choose Bharat Yatra
            </h2>
            <p className="text-gray-600 text-lg">
              Experience travel like never before
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'Curated Trips', desc: 'Handpicked destinations' },
              { icon: '💰', title: 'Best Price', desc: 'Competitive pricing' },
              // { icon: '⭐', title: 'Expert Guides', desc: 'Professional guides' },
              { icon: '🛡️', title: 'Safe Travel', desc: 'Secure partnerships' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}