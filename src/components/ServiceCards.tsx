import { motion } from 'motion/react';
import { Umbrella, Coffee, ShowerHead, Trees, DoorOpen } from 'lucide-react';

export function ServiceCards() {
  const services = [
    {
      title: "Lettini e Ombrelloni",
      desc: "Sdraio, lettini e ombrelloni per il tuo relax.",
      glow: "hover:shadow-orange-200/60", border: "hover:border-orange-300", shine: "from-orange-400/10",
      icon: <Umbrella className="w-10 h-10 text-orange-500" strokeWidth={1.5} />
    },
    {
      title: "Bar e Tavola Calda",
      desc: "Colazioni, pranzi, aperitivi e spuntini.",
      glow: "hover:shadow-amber-200/60", border: "hover:border-amber-300", shine: "from-amber-400/10",
      icon: <Coffee className="w-10 h-10 text-amber-500" strokeWidth={1.5} />
    },
    {
      title: "Docce Calde e Fredde",
      desc: "Servizi igienici e docce sempre disponibili.",
      glow: "hover:shadow-cyan-200/60", border: "hover:border-cyan-300", shine: "from-cyan-400/10",
      icon: <ShowerHead className="w-10 h-10 text-cyan-500" strokeWidth={1.5} />
    },
    {
      title: "Zone Ombra e Picnic",
      desc: "Aree picnic all'ombra con tavoli attrezzati.",
      glow: "hover:shadow-emerald-200/60", border: "hover:border-emerald-300", shine: "from-emerald-400/10",
      icon: <Trees className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
    },
    {
      title: "Cabine Private",
      desc: "Cabine riservate per cambiarsi in totale privacy.",
      glow: "hover:shadow-blue-200/60", border: "hover:border-blue-300", shine: "from-blue-400/10",
      icon: <DoorOpen className="w-10 h-10 text-blue-500" strokeWidth={1.5} />
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {services.map((s, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: index * 0.1 }}
          whileHover={{ y: -10, scale: 1.03 }}
          className={`bg-white p-6 rounded-2xl shadow-sm border border-stone-200 ${s.border} ${s.glow} hover:shadow-xl text-center flex flex-col items-center relative overflow-hidden group cursor-default transition-all duration-300`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${s.shine} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <motion.div
            whileHover={{ scale: 1.12, rotate: 4 }}
            className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-all duration-300 group-hover:shadow-md"
          >
            {s.icon}
          </motion.div>
          <h3 className="text-base font-bold text-stone-900 mb-1.5 leading-tight relative z-10">{s.title}</h3>
          <p className="text-stone-500 text-xs leading-relaxed relative z-10">{s.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
