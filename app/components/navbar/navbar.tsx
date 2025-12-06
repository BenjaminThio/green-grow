'use client';
import {useState} from 'react';
import { 
  CalendarDays, 
  Map as MapIcon, 
  Trees, 
  FileWarning, 
  Home,
  LucideIcon 
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export type Page = 'home' | 'events' | 'map' | 'my-trees' | 'report' | 'achievements' | 'admin' | 'login' | 'status-tracker' | 'profile';

export default function Navbar() {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const router = useRouter();
    const pathname = usePathname();

    const navigateTo = (page: Page) => {
        setCurrentPage(page);
        router.push(page);
        console.log(`Navigating to: ${page}`);
    };

    if (pathname === '/' || pathname === '/profile' || pathname === '/sign-up' || pathname === '/sign-in') return;

    return (
        <nav className="fixed bottom-0 w-full z-50 glass-nav pb-safe" style={{
          background: 'rgba(20, 83, 45, 0.4)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <div className="flex justify-around items-center h-20 max-w-2xl mx-auto px-2">
                <NavButton 
                    active={currentPage === 'home'} 
                    onClick={() => navigateTo('home')}
                    icon={Home} 
                    label="Home" 
                />
                <NavButton 
                    active={currentPage === 'events'} 
                    onClick={() => navigateTo('events')} 
                    icon={CalendarDays} 
                    label="Events" 
                />
                <button 
                    onClick={() => navigateTo('map')}
                    className={`
                        relative -top-6 w-14 h-14 rounded-full flex items-center justify-center
                        shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-transform duration-300 hover:scale-110
                        ${currentPage === 'map' 
                            ? 'bg-linear-to-br from-white to-gray-200 text-green-700' 
                            : 'bg-linear-to-br from-green-400 to-green-600 text-white'}
                    `}
                >
                    <MapIcon className="w-7 h-7" />
                </button>
                <NavButton 
                    active={currentPage === 'my-trees'} 
                    onClick={() => navigateTo('my-trees')} 
                    icon={Trees} 
                    label="Trees" 
                />
                <NavButton 
                    active={currentPage === 'report'} 
                    onClick={() => navigateTo('report')} 
                    icon={FileWarning} 
                    label="Report" 
                />
            </div>
        </nav>        
    );
}

interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    icon: LucideIcon;
    label: string;
}

function NavButton({ active, onClick, icon: Icon, label }: NavButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 w-16 transition-all duration-300
        ${active ? 'text-green-400 -translate-y-1' : 'text-gray-400 hover:text-gray-200'}
      `}
    >
      <Icon className={`w-6 h-6 transition-all duration-300 ${active ? 'fill-current opacity-100' : 'opacity-70'}`} />
      <span className={`text-[10px] font-medium transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
        {label}
      </span>
    </button>
  );
}