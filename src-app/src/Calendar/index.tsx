import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { SolarDay } from 'tyme4ts';
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import '../Calendar.css';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [colorMode, setColorMode] = useState('auto');
  
  const [view, setView] = useState('month');
  const [hideHeader, setHideHeader] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const hideHeaderParam = params.get('hideHeader');
    const defaultThemeParam = params.get('defaultTheme');
    const colorModeParam = params.get('colorMode');

    if (viewParam) setView(viewParam);
    if (hideHeaderParam === 'true') setHideHeader(true);
    if (colorModeParam) setColorMode(colorModeParam);
    
    // 如果有 defaultTheme 参数，可以通过 DOM dataset 或类似方式应用到顶级节点，
    // 原逻辑中是用 CSS 控制，这里保留该入口以供兼容
    if (defaultThemeParam) {
      document.documentElement.dataset.theme = defaultThemeParam;
    }
  }, []);

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
    // 兼容 tyme4ts 版本可能导致的 getDayYi 返回值类型问题
    return {
      yi: (currentLunar as any).getDayYi ? ((currentLunar as any).getDayYi().map((item: any) => item.getName ? item.getName() : item) || []) : [],
      ji: (currentLunar as any).getDayJi ? ((currentLunar as any).getDayJi().map((item: any) => item.getName ? item.getName() : item) || []) : [],
    };
  }, [currentLunar]);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className={`app-container ${view === 'week' ? 'is-week-view' : ''} ${hideHeader ? 'hide-header' : ''}`}>
      <div className="calendar-container" data-mode={colorMode}>
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