import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { SolarDay } from 'tyme4ts';
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import '../Calendar.css';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [colorMode, setColorMode] = useState('auto');
  const [currentTheme, setCurrentTheme] = useState('red');
  const [showThemePicker, setShowThemePicker] = useState(false);
  
  const [view, setView] = useState('month');
  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const hideHeaderParam = params.get('hideHeader');
    const defaultThemeParam = params.get('defaultTheme');
    const colorModeParam = params.get('colorMode');

    if (viewParam) setView(viewParam);
    if (hideHeaderParam === 'true') setHideHeader(true);
    if (colorModeParam) setColorMode(colorModeParam);
    
    // 如果有 defaultTheme 参数，应用该主题
    if (defaultThemeParam) {
      setCurrentTheme(defaultThemeParam);
    }
  }, []);

  useEffect(() => {
    const isDark = colorMode === 'dark' || (colorMode === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const themeMap: Record<string, any> = {
      'default': { primaryColor: '#A3D5E0', bgColor: isDark ? '#1a1a1a' : '#f9fafb', accentColor: '#7db4c4' },
      'ink': { primaryColor: isDark ? '#9ca3af' : '#111827', bgColor: isDark ? '#111827' : '#f3f4f6', accentColor: isDark ? '#6b7280' : '#374151' },
      'red': { primaryColor: '#b91c1c', bgColor: isDark ? '#1a1a1a' : '#fff1f2', accentColor: '#b91c1c' },
      'gold': { primaryColor: '#b45309', bgColor: isDark ? '#1a1a1a' : '#fffbeb', accentColor: '#b45309' },
      'cyan': { primaryColor: '#1e40af', bgColor: isDark ? '#1a1a1a' : '#eff6ff', accentColor: '#1e40af' },
      'auto': { primaryColor: '#b91c1c', bgColor: isDark ? '#1a1a1a' : '#fff1f2', accentColor: '#b91c1c' } // Fallback for auto
    };

    const theme = themeMap[currentTheme] || themeMap['red']; // Default fallback to red as requested
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--bg-color', theme.bgColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--saved-primary-color', theme.primaryColor);

    if (isDark) {
      root.style.setProperty('--header-bg', '#1e1e1e');
      root.style.setProperty('--panel-bg', '#2d2d2d');
      root.style.setProperty('--cell-bg', '#2d2d2d');
      root.style.setProperty('--hover-bg', '#3d3d3d');
      root.style.setProperty('--border-color', '#ffffff14');
      root.style.setProperty('--text-color', '#e5e7eb');
      root.style.setProperty('--secondary-text', '#9ca3af');
      root.style.setProperty('--almanac-gold', '#E9BB4E');
      root.style.setProperty('--almanac-gold-soft', '#E9BB4E80');
      root.style.setProperty('--almanac-bg', '#262626');
      root.style.setProperty('--almanac-line', '#ffffff14');
      root.style.setProperty('--almanac-soft-line', '#ffffff0a');
      root.style.setProperty('--almanac-board-bg', '#1e1e1e');
      root.style.setProperty('--almanac-detail-bg', '#1e1e1e');
      root.style.setProperty('--almanac-ganzhi-bg', '#333333');
      root.style.setProperty('--almanac-luck-ji-bg', '#4a361e');
      root.style.setProperty('--almanac-luck-xiong-bg', '#3d3d3d');
      root.style.setProperty('--almanac-text-shadow-color', 'rgba(0, 0, 0, 0.8)');
      root.style.setProperty('--almanac-shadow-color', 'rgba(0, 0, 0, 0.5)');
    } else {
      root.style.setProperty('--header-bg', '#ffffff');
      root.style.setProperty('--panel-bg', '#ffffff');
      root.style.setProperty('--cell-bg', '#ffffff');
      root.style.setProperty('--hover-bg', 'rgba(0,0,0,0.03)');
      root.style.setProperty('--border-color', 'rgba(0,0,0,0.06)');
      root.style.setProperty('--text-color', '#1f2937');
      root.style.setProperty('--secondary-text', '#6b7280');
      root.style.setProperty('--almanac-gold', '#b45309');
      root.style.setProperty('--almanac-gold-soft', 'rgba(180, 83, 9, 0.5)');
      root.style.setProperty('--almanac-bg', '#fcfaf8');
      root.style.setProperty('--almanac-line', 'rgba(180, 83, 9, 0.15)');
      root.style.setProperty('--almanac-soft-line', 'rgba(180, 83, 9, 0.08)');
      root.style.setProperty('--almanac-board-bg', '#ffffff');
      root.style.setProperty('--almanac-detail-bg', '#ffffff');
      root.style.setProperty('--almanac-ganzhi-bg', '#fcfaf8');
      root.style.setProperty('--almanac-luck-ji-bg', '#fef3c7');
      root.style.setProperty('--almanac-luck-xiong-bg', '#f3f4f6');
      root.style.setProperty('--almanac-text-shadow-color', 'rgba(180, 83, 9, 0.15)');
      root.style.setProperty('--almanac-shadow-color', 'rgba(180, 83, 9, 0.05)');
    }
  }, [currentTheme, colorMode]);

  const handleScroll = useCallback((e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      setCurrentMonth(prev => prev.add(1, 'month'));
    } else if (e.deltaY < 0) {
      setCurrentMonth(prev => prev.subtract(1, 'month'));
    }
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prev => prev.subtract(1, 'month'));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => prev.add(1, 'month'));
  }, []);

  const handleDateClick = useCallback((date: dayjs.Dayjs) => {
    setSelectedDate(date);
    if (date.month() !== currentMonth.month()) {
      setCurrentMonth(date.startOf('month'));
    }
  }, [currentMonth]);

  const calendarDays = useMemo(() => {
    const days = [];
    if (view === 'week') {
      let start = selectedDate.startOf('week');
      for (let i = 0; i < 7; i++) {
        days.push(start.add(i, 'day'));
      }
    } else {
      let start = currentMonth.startOf('month').startOf('week');
      for (let i = 0; i < 42; i++) {
        days.push(start.add(i, 'day'));
      }
    }
    return days;
  }, [currentMonth, selectedDate, view]);

  const currentSolar = useMemo(() => SolarDay.fromYmd(selectedDate.year(), selectedDate.month() + 1, selectedDate.date()), [selectedDate]);
  const currentLunar = useMemo(() => currentSolar.getLunarDay(), [currentSolar]);

  const currentAlmanac = useMemo(() => {
    // 兼容 tyme4ts 版本的 getRecommends 和 getAvoids
    return {
      yi: (currentLunar as any).getRecommends ? ((currentLunar as any).getRecommends().map((item: any) => item.getName ? item.getName() : item) || []) : [],
      ji: (currentLunar as any).getAvoids ? ((currentLunar as any).getAvoids().map((item: any) => item.getName ? item.getName() : item) || []) : [],
    };
  }, [currentLunar]);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const isDark = colorMode === 'dark' || (colorMode === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  return (
    <div className={`app-container ${view === 'week' ? 'is-week-view' : ''} ${hideHeader ? 'hide-header' : ''}`}>
      <div className={`calendar-container ${isDark ? 'dark-mode' : 'light-mode'}`} data-mode={isDark ? 'dark' : 'light'}>
        <div className="calendar-header">
          <div className="header-left">
            <div className="current-info">
              <div className="year-month">
                {currentMonth.format('YYYY年 MM月')}
              </div>
            </div>
            <div className="actions">
              <button className="icon-btn" onClick={handlePrevMonth}><ChevronLeft size={18} /></button>
              <button className="text-btn" onClick={() => setCurrentMonth(dayjs())}>今</button>
              <button className="icon-btn" onClick={handleNextMonth}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="header-right">
            <div className="theme-picker">
              <button className="icon-btn" onClick={() => setShowThemePicker(!showThemePicker)}>
                <Palette size={18} />
              </button>
              {showThemePicker && (
                <div className="theme-options">
                  <div className="color-mode-switch">
                    <button className={`mode-btn ${colorMode === 'light' ? 'active' : ''}`} onClick={() => setColorMode('light')}>浅色</button>
                    <button className={`mode-btn ${colorMode === 'dark' ? 'active' : ''}`} onClick={() => setColorMode('dark')}>深色</button>
                    <button className={`mode-btn ${colorMode === 'auto' ? 'active' : ''}`} onClick={() => setColorMode('auto')}>自动</button>
                  </div>
                  <div className="settings-separator"></div>
                  <div className="theme-color-switch">
                    <div 
                      className="theme-option-item"
                      onClick={() => setCurrentTheme('default')}
                    >
                      <div style={{ background: '#A3D5E0' }} className={`theme-dot ${currentTheme === 'default' ? 'active' : ''}`}></div>
                      <span className="theme-name">素雅</span>
                    </div>
                    <div 
                      className="theme-option-item"
                      onClick={() => setCurrentTheme('ink')}
                    >
                      <div style={{ background: '#111827' }} className={`theme-dot ${currentTheme === 'ink' ? 'active' : ''}`}></div>
                      <span className="theme-name">水墨</span>
                    </div>
                    <div 
                      className="theme-option-item"
                      onClick={() => setCurrentTheme('red')}
                    >
                      <div style={{ background: '#b91c1c' }} className={`theme-dot ${currentTheme === 'red' ? 'active' : ''}`}></div>
                      <span className="theme-name">朱红</span>
                    </div>
                    <div 
                      className="theme-option-item"
                      onClick={() => setCurrentTheme('gold')}
                    >
                      <div style={{ background: '#b45309' }} className={`theme-dot ${currentTheme === 'gold' ? 'active' : ''}`}></div>
                      <span className="theme-name">鎏金</span>
                    </div>
                    <div 
                      className="theme-option-item"
                      onClick={() => setCurrentTheme('cyan')}
                    >
                      <div style={{ background: '#1e40af' }} className={`theme-dot ${currentTheme === 'cyan' ? 'active' : ''}`}></div>
                      <span className="theme-name">黛蓝</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="calendar-grid-wrapper" onWheel={handleScroll}>
            <div className="week-header">
              {weekDays.map(day => <div key={day} className="week-day">{day}</div>)}
            </div>
            <div className="grid">
              {calendarDays.map((date, index) => {
                const isSelected = date.isSame(selectedDate, 'day');
                const isToday = date.isSame(dayjs(), 'day');
                const isOtherMonth = date.month() !== currentMonth.month();
                const solar = SolarDay.fromYmd(date.year(), date.month() + 1, date.date());
                const lunar = solar.getLunarDay() as any;
                const festival = lunar.getFestival ? lunar.getFestival() : null;
                const festivals = lunar.getFestivals ? lunar.getFestivals() : (festival ? [festival] : []);
                const festivalNames = festivals.map((f: any) => f.getName ? f.getName() : f);
                const lunarText = festivalNames.length > 0 ? festivalNames[0] : (lunar.getName ? lunar.getName() : '');
                const isWeekend = date.day() === 0 || date.day() === 6;

                return (
                  <div
                    key={index}
                    className={`day-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isOtherMonth ? 'other-month' : ''} ${isWeekend ? 'weekend' : ''}`}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="solar-day">{date.format('D')}</div>
                    <div className={`lunar-day ${festivalNames.length > 0 ? 'festival' : ''}`}>{lunarText}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="almanac-panel">
            <div className="almanac-header">
              <div className="big-day">{selectedDate.format('D')}</div>
              <div className="detail-info">
                <div className="solar-full">{selectedDate.format('YYYY年MM月DD日 dddd')}</div>
                <div className="lunar-full">{(currentLunar as any).getLunarYear ? (currentLunar as any).getLunarYear().getGanZhi() : ''}年 {(currentLunar as any).getLunarMonth ? (currentLunar as any).getLunarMonth().getName() : ''}月{(currentLunar as any).getName ? (currentLunar as any).getName() : ''}</div>
              </div>
            </div>
            <div className="almanac-body">
              <div className="almanac-board">
                <div className="yi-ji">
                  <div className="item yi">
                    <div className="label">宜</div>
                    <div className="content">
                      {(currentAlmanac.yi || []).slice(0, 5).join(' ')}
                    </div>
                  </div>
                  <div className="item ji">
                    <div className="label">忌</div>
                    <div className="content">
                      {(currentAlmanac.ji || []).slice(0, 5).join(' ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;