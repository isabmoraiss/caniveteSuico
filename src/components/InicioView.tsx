import { motion } from 'motion/react';

export default function InicioView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
      id="inicio-view-container"
    >
      <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-4" id="inicio-title">
        Bem-vindo ao <span className="text-red-600">Canivete Suíço</span>!
      </h1>
      <p className="text-lg text-neutral-600 max-w-xl font-normal leading-relaxed" id="inicio-subtitle">
        Selecione uma ferramenta básica no menu superior para começar.
      </p>
    </motion.div>
  );
}
