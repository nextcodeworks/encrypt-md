import React from 'react';
import { Switch } from '@/components/ui/switch';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/components/ui/use-toast';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    
    toast({
      title: `${newTheme === 'dark' ? 'Dark' : 'Light'} Mode Activated`,
      description: `Switched to ${newTheme} mode.`,
      duration: 1500,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <SunIcon size={16} className={`transition-opacity ${isDark ? 'opacity-50' : 'opacity-100'}`} />
      <div className="relative flex items-center">
        <Switch 
          id="theme-toggle"
          checked={isDark}
          onCheckedChange={toggleTheme}
          aria-label="Toggle theme"
          className={`
            data-[state=checked]:bg-gray-400 
            data-[state=unchecked]:bg-gray-300
            relative
          `}
        />
      </div>
      <MoonIcon size={16} className={`transition-opacity ${isDark ? 'opacity-100' : 'opacity-50'}`} />
    </div>
  );
};