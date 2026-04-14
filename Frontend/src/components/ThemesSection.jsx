import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  TreePine,
  Footprints,
  Mountain,
  Sparkles,
  Landmark,
  Heart,
} from "lucide-react";

//  correct path (very important)
import { themes } from "../data/travelData";

/* ---------------- Icon Map ---------------- */
const iconMap = {
  Users,
  TreePine,
  Footprints,
  Mountain,
  Sparkles,
  Landmark,
  Heart,
};

const ThemesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-500 font-semibold text-sm uppercase tracking-wide">
            Choose Your Style
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Travel by Theme
          </h2>

          <p className="text-gray-600 mt-3 max-w-xl mx-auto">
            Whether you seek adventure, relaxation, or cultural exploration,
            we have something special for you.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {themes.map((theme, index) => {
            const IconComponent = iconMap[theme.icon];

            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              > 
                <Link
                  to={`/packages?theme=${theme.id}`}
                  className="group relative h-44 rounded-2xl overflow-hidden block"
                >
                  <img
                    src={theme.image}
                    alt={theme.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                    <div className="w-12 h-12 mb-2 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white transition">
                      {IconComponent && (
                        <IconComponent className="w-6 h-6 text-white group-hover:text-blue-500" />
                      )}
                    </div>

                    <h3 className="text-white font-semibold text-sm">
                      {theme.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ThemesSection;
