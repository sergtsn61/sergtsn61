import { Calculator, History, Sun, Moon, Globe } from 'lucide-react';
import { useI18n, Lang } from '../../i18n';
import { Theme } from '../../hooks/useTheme';

export type SidebarTab = 'calculator' | 'history';

interface SidebarProps {
  active: SidebarTab;
  onChange: (tab: SidebarTab) => void;
  historyCount: number;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Sidebar({ active, onChange, historyCount, theme, onToggleTheme }: SidebarProps) {
  const { t, lang, setLang } = useI18n();

  const tabs = [
    { id: 'calculator' as SidebarTab, icon: Calculator, label: t.tabs.calculator },
    { id: 'history' as SidebarTab, icon: History, label: t.tabs.history },
  ];

  const toggleLang = () => setLang(lang === 'ru' ? 'en' : 'ru' as Lang);

  return (
    <div className="w-16 flex flex-col items-center py-4 gap-2 bg-bg-secondary border-r border-border-subtle transition-colors duration-300">
      {/* Логотип */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: 'linear-gradient(135deg, #FF6B2B, #FF8F5A)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="w-full h-px bg-border-subtle mx-2 mb-2" />

      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5
              transition-all duration-200
              ${isActive
                ? 'bg-accent-muted text-accent-primary'
                : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
              }
            `}
            title={tab.label}
          >
            <Icon size={16} />
            {tab.id === 'history' && historyCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {historyCount > 99 ? '99' : historyCount}
              </span>
            )}
          </button>
        );
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Язык */}
      <button
        onClick={toggleLang}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-all duration-200"
        title={lang === 'ru' ? 'English' : 'Русский'}
      >
        <Globe size={15} />
      </button>

      {/* Тема */}
      <button
        onClick={onToggleTheme}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-all duration-200"
        title={theme === 'dark' ? t.theme.light : t.theme.dark}
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </div>
  );
}
