import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Plus, TrendingUp, Calendar, Truck, Package, ChevronLeft, ChevronRight, X, Trash2, Wallet, CalendarDays, BarChart3 } from 'lucide-react';

// 입력 모달을 별도 컴포넌트로 분리 (키보드 문제 해결)
const InputModal = ({ isOpen, onClose, onSave, initialDate }) => {
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [platform, setPlatform] = useState('coupang');
  const [amount, setAmount] = useState('');

  const COLORS = { coupang: '#00A0E0', baemin: '#2DC6C6', other: '#9333EA' };
  const PLATFORM_NAMES = { coupang: '쿠팡이츠', baemin: '배민커넥트', other: '기타' };

  useEffect(() => {
    if (isOpen) {
      setDate(initialDate || new Date().toISOString().split('T')[0]);
      setPlatform('coupang');
      setAmount('');
    }
  }, [isOpen, initialDate]);

  const handleSave = () => {
    if (amount) {
      onSave({ date, platform, amount: parseInt(amount), memo: '' });
      onClose();
    }
  };

  const PlatformIcon = ({ p }) => {
    if (p === 'coupang') return <Package className="w-5 h-5" style={{ color: COLORS.coupang }} />;
    if (p === 'baemin') return <Truck className="w-5 h-5" style={{ color: COLORS.baemin }} />;
    return <Wallet className="w-5 h-5" style={{ color: COLORS.other }} />;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">수익 입력</h3>
          <button onClick={onClose} className="p-2"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">날짜</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full p-3 border border-gray-200 rounded-xl text-base"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">플랫폼</label>
            <div className="grid grid-cols-3 gap-3">
              {['coupang', 'baemin', 'other'].map(p => (
                <button 
                  key={p} 
                  type="button"
                  onClick={() => setPlatform(p)} 
                  className={`p-3 rounded-xl border-2 ${platform === p ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <PlatformIcon p={p} />
                    <span className="text-sm">{PLATFORM_NAMES[p]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">금액</label>
            <input 
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={amount} 
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setAmount(val);
              }}
              placeholder="0" 
              className="w-full p-3 border border-gray-200 rounded-xl text-2xl font-bold text-right"
              autoComplete="off"
            />
            {amount && (
              <p className="text-right text-sm text-gray-500 mt-1">
                {new Intl.NumberFormat('ko-KR').format(parseInt(amount))}원
              </p>
            )}
          </div>
          <button 
            type="button"
            onClick={handleSave} 
            disabled={!amount}
            className={`w-full p-4 rounded-xl font-semibold ${amount ? 'bg-blue-500 text-white active:bg-blue-600' : 'bg-gray-200 text-gray-400'}`}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('deliveryRecords');
    if (saved) return JSON.parse(saved);
    return [];
  });
  
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputDate, setInputDate] = useState(null);

  const COLORS = { coupang: '#00A0E0', baemin: '#2DC6C6', other: '#9333EA' };
  const PLATFORM_NAMES = { coupang: '쿠팡이츠', baemin: '배민커넥트', other: '기타' };

  const saveToStorage = (newRecords) => {
    localStorage.setItem('deliveryRecords', JSON.stringify(newRecords));
  };

  const saveRecord = (data) => {
    const newRecords = [...records, { id: Date.now(), ...data }];
    setRecords(newRecords);
    saveToStorage(newRecords);
  };

  const deleteRecord = (id) => {
    const newRecords = records.filter(r => r.id !== id);
    setRecords(newRecords);
    saveToStorage(newRecords);
  };

  const openInputModal = (date = null) => {
    setInputDate(date);
    setShowInputModal(true);
  };

  const getStats = (period = 'all', platform = 'all') => {
    let filtered = [...records];
    const today = new Date();
    if (period === 'today') filtered = filtered.filter(r => r.date === today.toISOString().split('T')[0]);
    else if (period === 'week') { const d = new Date(today); d.setDate(d.getDate() - 7); filtered = filtered.filter(r => new Date(r.date) >= d); }
    else if (period === 'month') { const d = new Date(today); d.setMonth(d.getMonth() - 1); filtered = filtered.filter(r => new Date(r.date) >= d); }
    else if (period === 'year') { const d = new Date(today); d.setFullYear(d.getFullYear() - 1); filtered = filtered.filter(r => new Date(r.date) >= d); }
    if (platform !== 'all') filtered = filtered.filter(r => r.platform === platform);
    const total = filtered.reduce((sum, r) => sum + r.amount, 0);
    return { total, count: filtered.length, avg: filtered.length > 0 ? Math.round(total / filtered.length) : 0 };
  };

  const getDailyData = (days = 7) => {
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today); date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayRecords = records.filter(r => r.date === dateStr);
      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        쿠팡이츠: dayRecords.filter(r => r.platform === 'coupang').reduce((s, r) => s + r.amount, 0),
        배민커넥트: dayRecords.filter(r => r.platform === 'baemin').reduce((s, r) => s + r.amount, 0),
        기타: dayRecords.filter(r => r.platform === 'other').reduce((s, r) => s + r.amount, 0),
      });
    }
    return data;
  };

  const getMonthlyData = () => {
    const data = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthRecords = records.filter(r => { const d = new Date(r.date); return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth(); });
      data.push({
        date: `${date.getMonth() + 1}월`,
        쿠팡이츠: monthRecords.filter(r => r.platform === 'coupang').reduce((s, r) => s + r.amount, 0),
        배민커넥트: monthRecords.filter(r => r.platform === 'baemin').reduce((s, r) => s + r.amount, 0),
        기타: monthRecords.filter(r => r.platform === 'other').reduce((s, r) => s + r.amount, 0),
      });
    }
    return data;
  };

  const getPlatformRatio = () => [
    { name: '쿠팡이츠', emoji: '🔵', value: records.filter(r => r.platform === 'coupang').reduce((s, r) => s + r.amount, 0), color: COLORS.coupang },
    { name: '배민커넥트', emoji: '🩵', value: records.filter(r => r.platform === 'baemin').reduce((s, r) => s + r.amount, 0), color: COLORS.baemin },
    { name: '기타', emoji: '🟣', value: records.filter(r => r.platform === 'other').reduce((s, r) => s + r.amount, 0), color: COLORS.other }
  ];

  const formatMoney = (amount) => new Intl.NumberFormat('ko-KR').format(amount) + '원';
  
  const formatShortMoney = (amount) => {
    if (amount === 0) return '0';
    const man = amount / 10000;
    if (man < 10) {
      return man.toFixed(1) + '만';
    }
    return Math.round(man) + '만';
  };

  const PlatformIcon = ({ platform, size = 5 }) => {
    const cls = `w-${size} h-${size}`;
    if (platform === 'coupang') return <Package className={cls} style={{ color: COLORS.coupang }} />;
    if (platform === 'baemin') return <Truck className={cls} style={{ color: COLORS.baemin }} />;
    return <Wallet className={cls} style={{ color: COLORS.other }} />;
  };

  // 홈 화면
  const HomeScreen = () => {
    const todayStats = getStats('today');
    const weekStats = getStats('week');
    const monthStats = getStats('month');
    return (
      <div className="p-4 pb-24">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <p className="text-blue-100 text-sm mb-1">오늘의 수익</p>
          <p className="text-4xl font-bold mb-4">{formatMoney(todayStats.total)}</p>
          <div className="flex gap-3 text-sm flex-wrap">
            <span>🔵 쿠팡 {formatMoney(getStats('today', 'coupang').total)}</span>
            <span>🩵 배민 {formatMoney(getStats('today', 'baemin').total)}</span>
            <span>🟣 기타 {formatMoney(getStats('today', 'other').total)}</span>
          </div>
        </div>
        
        <button 
          onClick={() => openInputModal()} 
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white rounded-xl p-4 mb-6 font-semibold shadow-lg active:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
          <span>수익 입력하기</span>
        </button>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">최근 7일 수익</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getDailyData(7)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatShortMoney(v)} />
              <Tooltip formatter={(v) => formatMoney(v)} />
              <Bar dataKey="쿠팡이츠" stackId="a" fill={COLORS.coupang} />
              <Bar dataKey="배민커넥트" stackId="a" fill={COLORS.baemin} />
              <Bar dataKey="기타" stackId="a" fill={COLORS.other} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">이번 주</p>
            <p className="text-xl font-bold text-gray-800">{formatMoney(weekStats.total)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">이번 달</p>
            <p className="text-xl font-bold text-gray-800">{formatMoney(monthStats.total)}</p>
          </div>
        </div>
      </div>
    );
  };

  // 통계 화면
  const StatsScreen = () => {
    const [period, setPeriod] = useState('month');
    const [platform, setPlatform] = useState('all');
    const stats = getStats(period, platform);
    const dailyData = getDailyData(period === 'week' ? 7 : 30);
    const monthlyData = getMonthlyData();
    const ratio = getPlatformRatio();

    return (
      <div className="p-4 pb-24">
        <h2 className="text-xl font-bold text-gray-800 mb-4">수익 통계</h2>
        <div className="flex gap-2 mb-4">
          {[{ key: 'week', label: '📅 주간' }, { key: 'month', label: '🗓️ 월간' }, { key: 'year', label: '📆 년간' }].map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)} className={`px-4 py-2 rounded-full text-sm ${period === p.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{p.label}</button>
          ))}
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[{ key: 'all', label: '📊 통합' }, { key: 'coupang', label: '🔵 쿠팡이츠' }, { key: 'baemin', label: '🩵 배민커넥트' }, { key: 'other', label: '🟣 기타' }].map(p => (
            <button key={p.key} onClick={() => setPlatform(p.key)} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${platform === p.key ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{p.label}</button>
          ))}
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 mb-6 text-white">
          <p className="text-white/80 text-sm mb-1">{period === 'week' ? '최근 7일' : period === 'month' ? '최근 30일' : '최근 1년'}{platform !== 'all' && ` · ${PLATFORM_NAMES[platform]}`}</p>
          <p className="text-3xl font-bold mb-3">{formatMoney(stats.total)}</p>
          <div className="flex gap-4 text-sm">
            <div><p className="text-white/70">건수</p><p className="font-semibold">{stats.count}건</p></div>
            <div><p className="text-white/70">평균</p><p className="font-semibold">{formatMoney(stats.avg)}</p></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">{period === 'year' ? '월별' : '일별'} 수익 추이</h3>
          <ResponsiveContainer width="100%" height={200}>
            {period === 'year' ? (
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatShortMoney(v)} />
                <Tooltip formatter={(v) => formatMoney(v)} />
                <Bar dataKey="쿠팡이츠" stackId="a" fill={COLORS.coupang} />
                <Bar dataKey="배민커넥트" stackId="a" fill={COLORS.baemin} />
                <Bar dataKey="기타" stackId="a" fill={COLORS.other} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatShortMoney(v)} />
                <Tooltip formatter={(v) => formatMoney(v)} />
                <Line type="monotone" dataKey={platform === 'all' ? '쿠팡이츠' : PLATFORM_NAMES[platform]} stroke={platform === 'all' ? COLORS.coupang : COLORS[platform]} strokeWidth={2} dot={false} />
                {platform === 'all' && <Line type="monotone" dataKey="배민커넥트" stroke={COLORS.baemin} strokeWidth={2} dot={false} />}
                {platform === 'all' && <Line type="monotone" dataKey="기타" stroke={COLORS.other} strokeWidth={2} dot={false} />}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        {platform === 'all' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">플랫폼별 비율</h3>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={120}>
                <PieChart><Pie data={ratio} cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value">{ratio.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {ratio.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{item.emoji}</span>
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-semibold ml-auto">{formatMoney(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 달력 화면
  const CalendarScreen = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const getDateRecords = (day) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return records.filter(r => r.date === dateStr);
    };
    const getDayTotal = (day) => getDateRecords(day).reduce((s, r) => s + r.amount, 0);
    const getMonthTotal = () => records.filter(r => { const d = new Date(r.date); return d.getFullYear() === year && d.getMonth() === month; }).reduce((s, r) => s + r.amount, 0);
    const getColorIntensity = (amt) => amt === 0 ? 'bg-gray-50' : amt < 50000 ? 'bg-green-100' : amt < 100000 ? 'bg-green-200' : amt < 150000 ? 'bg-green-300' : amt < 200000 ? 'bg-green-400' : 'bg-green-500';

    const days = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    const selectedRecords = selectedDate ? getDateRecords(selectedDate) : [];

    const handleAddRecord = () => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      openInputModal(dateStr);
    };

    return (
      <div className="p-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="p-2"><ChevronLeft className="w-5 h-5" /></button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">{year}년 {month + 1}월</h2>
            <p className="text-sm text-gray-500">총 {formatMoney(getMonthTotal())}</p>
          </div>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="p-2"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <button onClick={() => setCurrentMonth(new Date())} className="mx-auto block px-4 py-1 text-sm bg-blue-100 text-blue-600 rounded-full mb-4">오늘</button>
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
              <div key={d} className={`text-center text-sm font-medium py-2 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) return <div key={idx} className="aspect-square" />;
              const total = getDayTotal(day);
              const isToday = new Date().toISOString().split('T')[0] === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayOfWeek = (firstDay + day - 1) % 7;
              return (
                <button key={day} onClick={() => setSelectedDate(selectedDate === day ? null : day)} className={`aspect-square rounded-lg flex flex-col items-center justify-center ${getColorIntensity(total)} ${selectedDate === day ? 'ring-2 ring-blue-500' : ''} ${isToday ? 'ring-2 ring-orange-400' : ''}`}>
                  <span className={`text-sm font-medium ${dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-700'} ${total > 150000 ? 'text-white' : ''}`}>{day}</span>
                  {total > 0 && <span className={`text-xs ${total > 150000 ? 'text-white/90' : 'text-gray-600'}`}>{formatShortMoney(total)}</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm mb-4">
          <p className="text-xs text-gray-500 mb-2">수익 범례</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-50 border"></span>0</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100"></span>~5만</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200"></span>~10만</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-300"></span>~15만</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400"></span>~20만</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500"></span>20만+</span>
          </div>
        </div>
        {selectedDate && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">{month + 1}월 {selectedDate}일</h3>
              <span className="text-lg font-bold text-blue-500">{formatMoney(getDayTotal(selectedDate))}</span>
            </div>
            {selectedRecords.length === 0 ? <p className="text-gray-400 text-center py-4">기록이 없습니다</p> : (
              <div className="space-y-2">
                {selectedRecords.map(r => (
                  <div key={r.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: COLORS[r.platform] + '20' }}>
                      <PlatformIcon platform={r.platform} size={4} />
                    </div>
                    <div className="flex-1"><p className="font-medium text-gray-800">{PLATFORM_NAMES[r.platform]}</p></div>
                    <p className="font-semibold">{formatMoney(r.amount)}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleAddRecord} className="w-full mt-3 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />이 날짜에 추가
            </button>
          </div>
        )}
      </div>
    );
  };

  // 기록 화면
  const RecordsScreen = () => {
    const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
    const grouped = sorted.reduce((g, r) => { (g[r.date] = g[r.date] || []).push(r); return g; }, {});
    const formatDate = (d) => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (d === today) return '오늘';
      if (d === yesterday) return '어제';
      const date = new Date(d);
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    return (
      <div className="p-4 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">수익 기록</h2>
          <button onClick={() => openInputModal()} className="bg-blue-500 text-white p-2 rounded-full"><Plus className="w-5 h-5" /></button>
        </div>
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12 text-gray-400"><Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>아직 기록이 없습니다</p><p className="text-sm mt-1">위의 + 버튼을 눌러 수익을 입력해보세요!</p></div>
        ) : (
          Object.entries(grouped).map(([date, recs]) => (
            <div key={date} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-500">{formatDate(date)}</h3>
                <span className="text-sm text-gray-400">{formatMoney(recs.reduce((s, r) => s + r.amount, 0))}</span>
              </div>
              <div className="space-y-2">
                {recs.map(r => (
                  <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: COLORS[r.platform] + '20' }}>
                      <PlatformIcon platform={r.platform} />
                    </div>
                    <div className="flex-1"><p className="font-semibold text-gray-800">{PLATFORM_NAMES[r.platform]}</p></div>
                    <p className="font-bold text-gray-800">{formatMoney(r.amount)}</p>
                    <button onClick={() => deleteRecord(r.id)} className="ml-3 p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">
          {activeTab === 'home' && '배달 수익 관리'}
          {activeTab === 'stats' && '수익 통계'}
          {activeTab === 'calendar' && '달력'}
          {activeTab === 'records' && '수익 기록'}
        </h1>
      </header>
      <main>
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'stats' && <StatsScreen />}
        {activeTab === 'calendar' && <CalendarScreen />}
        {activeTab === 'records' && <RecordsScreen />}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-around safe-area-bottom">
        {[{ key: 'home', icon: TrendingUp, label: '홈' }, { key: 'stats', icon: BarChart3, label: '통계' }, { key: 'calendar', icon: CalendarDays, label: '달력' }, { key: 'records', icon: Calendar, label: '기록' }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex flex-col items-center gap-1 ${activeTab === tab.key ? 'text-blue-500' : 'text-gray-400'}`}>
            <tab.icon className="w-6 h-6" /><span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      <InputModal 
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onSave={saveRecord}
        initialDate={inputDate}
      />
      
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 12px); }
      `}</style>
    </div>
  );
}
