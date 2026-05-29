import { ViewType } from '../types';

interface NavbarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export default function Navbar({ currentView, setView }: NavbarProps) {
  const menuItems: { id: ViewType; label: string }[] = [
    { id: 'inicio', label: 'Início' },
    { id: 'imc', label: 'IMC' },
    { id: 'cambio', label: 'Câmbio' },
    { id: 'medidas', label: 'Medidas' },
    { id: 'juros', label: 'Juros' },
    { id: 'sorteador', label: 'Sorteador' },
    { id: 'validador', label: 'Validador de CPF e CNPJ' },
  ];

  return (
    <header className="bg-black text-white shadow-md border-b-4 border-red-600" id="app-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 md:h-14 gap-2">
          {/* Brand/Logo */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('inicio')}
              className="text-xl font-black tracking-wider cursor-pointer hover:text-red-500 active:scale-98 transition-all"
              id="brand-logo"
            >
              MvcMaryIsa
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-1.5 sm:gap-2" id="nav-menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-md transition-all cursor-pointer ${
                  currentView === item.id
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
