import { ShoppingCart, TriangleAlert, CheckCircle } from "lucide-react";

function Toast({ toasts = [] }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-5 right-5 flex flex-col gap-3 z-[9999]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="
            w-[260px]
            bg-[#111827]
            border border-[#86E1FF]
            text-white
            px-4 py-3
            rounded-xl
            shadow-lg
            transition-all duration-300
          "
        >
          <div className="flex items-center gap-3">
            {t.mensaje.includes("No hay más") ? (
              <TriangleAlert size={20} className="text-yellow-400" />
            ) : (
              <CheckCircle size={20} className="text-[#86E1FF]" />
            )}
            <p className="text-sm text-gray-300">{t.mensaje}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Toast;
