import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Plus, TrendingUp, Calendar, Truck, Package, ChevronLeft, ChevronRight, X, Trash2, Wallet, CalendarDays, BarChart3, UtensilsCrossed, Target, Settings, Moon } from 'lucide-react';

// 광고 배너 컴포넌트 (나중에 AdMob으로 교체)
const AdBanner = () => (
  <div className="bg-gray-800 rounded-xl p-3 flex items-center justify-center border border-gray-700">
    <span className="text-gray-500 text-sm">📢 광고 영역</span>
  </div>
);

// 달돈 로고 컴포넌트
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <Moon className="w-8 h-8 text-yellow-400 fill-yellow-400" />
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-900">₩</span>
    </div>
    <span className="text-xl font-bold text-gray-800">달돈</span>
  </div>
);

// 목표 설정 모달
const GoalModal = ({ isOpen, onClose, currentGoal, onSave }) => {
  const [goal, setGoal] = useState(currentGoal || '');

  useEffect(() => {
    if (isOpen) {
      setGoal(currentGoal || '');
    }
  }, [isOpen, currentGoal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-11/12 max-w-sm rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">🎯 이번달 목표 설정</h3>
          <button onClick={onClose} className="p-2"><X className="w-5 h-5" /></button>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">목표 금액</label>
          <input 
            type="text"
            inputMode="numeric"
            value={goal} 
            onChange={(e) => setGoal(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="0" 
            className="w-full p-3 border border-gray-200 rounded-xl text-xl font-bold text-right"
          />
          {goal && (
            <p className="text-right text-sm text-gray-500 mt-1">
              {new Intl.NumberFormat('ko-KR').format(parseInt(goal))}원
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => { onSave(0); onClose(); }} className="flex-1 p-3 border border-gray-300 rounded-xl text-gray-600">초기화</button>
          <button onClick={() => { if (goal) { onSave(parseInt(goal)); onClose(); } }} className="flex-1 p-3 bg-yellow-500 text-gray-900 rounded-xl font-semibold">저장</button>
        </div>
      </div>
    </div>
  );
};

// 입력 모달
const InputModal = ({ isOpen, onClose, onSave, initialDate }) => {
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [platform, setPlatform] = useState('coupang');
  const [deliveryCount, setDeliveryCount] = useState('');
  const [amount, setAmount] = useState('');

  const COLORS = { coupang: '#00A0E0', baemin: '#2DC6C6', yogiyo: '#FA0050', other: '#9333EA' };
  const PLATFORM_NAMES = { coupang: '쿠팡이츠', baemin: '배민커넥트', yogiyo: '요기요', other: '기타' };

  useEffect(() => {
    if (isOpen) {
      setDate(initialDate || new Date().toISOString().split('T')[0]);
      setPlatform('coupang');
      setDeliveryCount('');
      setAmount('');
    }
  }, [isOpen, initialDate]);

  const handleSave = () => {
    if (amount && deliveryCount) {
      onSave({ date, platform, deliveryCount: parseInt(deliveryCount), amount: parseInt(amount), memo: '' });
      onClose();
    }
  };

  const PlatformIcon = ({ p }) => {
    if (p === 'coupang') return <Package className="w-5 h-5" style={{ color: COLORS.coupang }} />;
    if (p === 'baemin') return <Truck className="w-5 h-5" style={{ color: COLORS.baemin }} />;
    if (p === 'yogiyo') return <UtensilsCrossed className="w-5 h-5" style={{ color: COLORS.yogiyo }} />;
    return <Wallet className="w-5 h-5" style={{ color: COLORS.other }} />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-lg rounded-t-3xl p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">수익 입력</h3>
          <button onClick={onClose} className="p-2"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">날짜</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-base" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">플랫폼</label>
            <div className="grid grid-cols-4 gap-2">
              {['coupang', 'baemin', 'yogiyo', 'other'].map(p => (
                <button key={p} type="button" onClick={() => setPlatform(p)} className={`p-2 rounded-xl border-2 ${platform === p ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
                  <div className="flex flex-col items-center gap-1">
                    <PlatformIcon p={p} />
                    <span className="text-xs">{PLATFORM_NAMES[p]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-2">🚚 배달 건수</label>
              <input 
                type="text"
                inputMode="numeric"
                value={deliveryCount} 
                onChange={(e) => setDeliveryCount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0" 
                className="w-full p-3 border border-gray-200 rounded-xl text-xl font-bold text-center"
              />
              {deliveryCount && <p className="text-center text-sm text-gray-500 mt-1">{deliveryCount}건</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">💰 금액</label>
              <input 
                type="text"
                inputMode="numeric"
                value={amount} 
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0" 
                className="w-full p-3 border border-gray-200 rounded-xl text-xl font-bold text-center"
              />
              {amount && <p className="text-center text-sm text-gray-500 mt-1">{new Intl.NumberFormat('ko-KR').format(parseInt(amount))}원</p>}
            </div>
          </div>
          {deliveryCount && amount && (
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-sm text-gray-500">건당 평균: </span>
              <span className="font-bold text-yellow-600">{new Intl.NumberFormat('ko-KR').format(Math.round(parseInt(amount) / parseInt(deliveryCount)))}원</span>
            </div>
          )}
          <button 
            type="button"
            onClick={handleSave} 
            disabled={!amount || !deliveryCount}
            className={`w-full p-4 rounded-xl font-semibold ${amount && deliveryCount ? 'bg-yellow-500 text-gray-900 active:bg-yellow-600' : 'bg-gray-200 text-gray-400'}`}
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
  const [monthlyGoal, setMonthlyGoal] = useState(() => {
    const saved = localStorage.getItem('monthlyGoal');
    if (saved) return parseInt(saved);
    return 0;
  });
  
  const [showInputModal, setShowInputModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [inputDate, setInputDate] = useState(null);
  
  // 선택된 날짜 (홈 화면용)
  const [selectedDay, setSelectedDay] = useState(new Date());

  const COLORS = { coupang: '#00A0E0', baemin: '#2DC6C6', yogiyo: '#FA0050', other: '#9333EA' };
  const PLATFORM_NAMES = { coupang: '쿠팡이츠', baemin: '배민커넥트', yogiyo: '요기요', other: '기타' };

  const saveToStorage = (newRecords) => {
    localStorage.setItem('deliveryRecords', JSON.stringify(newRecords));
  };

  const saveGoal = (goal) => {
    setMonthlyGoal(goal);
    localStorage.setItem('monthlyGoal', goal.toString());
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

  // 날짜 이동 함수
  const goToPrevDay = () => {
    const newDate = new Date(selectedDay);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDay(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDay);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDay(newDate);
  };

  const goToToday = () => {
    setSelectedDay(new Date());
  };

  const isToday = () => {
    const today = new Date();
    return selectedDay.toISOString().split('T')[0] === today.toISOString().split('T')[0];
  };

  const getSelectedDateString = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${selectedDay.getMonth() + 1}월 ${selectedDay.getDate()}일 (${days[selectedDay.getDay()]})`;
  };

  const getStatsForDate = (date, platform = 'all') => {
    const dateStr = date.toISOString().split('T')[0];
    let filtered = records.filter(r => r.date === dateStr);
    if (platform !== 'all') filtered = filtered.filter(r => r.platform === platform);
    const total = filtered.reduce((sum, r) => sum + r.amount, 0);
    const totalCount = filtered.reduce((sum, r) => sum + (r.deliveryCount || 1), 0);
    return { total, count: filtered.length, totalDeliveries: totalCount, avg: totalCount > 0 ? Math.round(total / totalCount) : 0 };
  };

  const getStats = (period = 'all', platform = 'all') => {
    let filtered = [...records];
    const today = new Date();
    if (period === 'today') filtered = filtered.filter(r => r.date === today.toISOString().split('T')[0]);
    else if (period === 'week') { const d = new Date(today); d.setDate(d.getDate() - 7); filtered = filtered.filter(r => new Date(r.date) >= d); }
    else if (period === 'month') { const d = new Date(today); d.setMonth(d.getMonth() - 1); filtered = filtered.filter(r => new Date(r.date) >= d); }
    else if (period === 'thisMonth') { filtered = filtered.filter(r => { const d = new Date(r.date); return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth(); }); }
    else if (period === 'year') { const d = new Date(today); d.setFullYear(d.getFullYear() - 1); filtered = filtered.filter(r => new Date(r.date) >= d); }
    if (platform !== 'all') filtered = filtered.filter(r => r.platform === platform);
    const total = filtered.reduce((sum, r) => sum + r.amount, 0);
    const totalCount = filtered.reduce((sum, r) => sum + (r.deliveryCount || 1), 0);
    return { total, count: filtered.length, totalDeliveries: totalCount, avg: totalCount > 0 ? Math.round(total / totalCount) : 0 };
  };

  const getDailyData = (days = 7) => {
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today); date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayRecords = records.filter(r => r.date === dateStr);
      const coupang = dayRecords.filter(r => r.platform === 'coupang').reduce((s, r) => s + r.amount, 0);
      const baemin = dayRecords.filter(r => r.platform === 'baemin').reduce((s, r) => s + r.amount, 0);
      const yogiyo = dayRecords.filter(r => r.platform === 'yogiyo').reduce((s, r) => s + r.amount, 0);
      const other = dayRecords.filter(r => r.platform === 'other').reduce((s, r) => s + r.amount, 0);
      const coupangCount = dayRecords.filter(r => r.platform === 'coupang').reduce((s, r) => s + (r.deliveryCount || 1), 0);
      const baeminCount = dayRecords.filter(r => r.platform === 'baemin').reduce((s, r) => s + (r.deliveryCount || 1), 0);
      const yogiyoCount = dayRecords.filter(r => r.platform === 'yogiyo').reduce((s, r) => s + (r.deliveryCount || 1), 0);
      const otherCount = dayRecords.filter(r => r.platform === 'other').reduce((s, r) => s + (r.deliveryCount || 1), 0);
      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        쿠팡이츠: coupang, 배민커넥트: baemin, 요기요: yogiyo, 기타: other,
        쿠팡건수: coupangCount, 배민건수: baeminCount, 요기요건수: yogiyoCount, 기타건수: otherCount,
        합계: coupang + baemin + yogiyo + other,
        총건수: coupangCount + baeminCount + yogiyoCount + otherCount,
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
      const coupang = monthRecords.filter(r => r.platform === 'coupang').reduce((s, r) => s + r.amount, 0);
      const baemin = monthRecords.filter(r => r.platform === 'baemin').reduce((s, r) => s + r.amount, 0);
      const yogiyo = monthRecords.filter(r => r.platform === 'yogiyo').reduce((s, r) => s + r.amount, 0);
      const other = monthRecords.filter(r => r.platform === 'other').reduce((s, r) => s + r.amount, 0);
      const coupangCount = monthRecords.filter(r => r.platform === 'coupang').reduce((s, r) => s + (r.deliveryCount || 1), 0);
      const baeminCount = monthRecords.filter(r => r.platform === 'baemin').reduce((s, r) => s + (r.deliveryCount || 1), 0);
      const yogiyoCount = monthRecords.filter(r => r.platform === 'yogiyo').reduce((s, r) => s + (r.deliveryCount || 1), 0);
      const otherCount = monthRecords.filter(r => r.platform === 'other').reduce((s, r) => s + (r.deliveryCount || 1), 0);
      data.push({
        date: `${date.getMonth() + 1}월`,
        쿠팡이츠: coupang, 배민커넥트: baemin, 요기요: yogiyo, 기타: other,
        쿠팡건수: coupangCount, 배민건수: baeminCount, 요기요건수: yogiyoCount, 기타건수: otherCount,
        합계: coupang + baemin + yogiyo + other,
        총건수: coupangCount + baeminCount + yogiyoCount + otherCount,
      });
    }
    return data;
  };

  const getPlatformRatio = () => [
    { name: '쿠팡이츠', emoji: '🔵', value: records.filter(r => r.platform === 'coupang').reduce((s, r) => s + r.amount, 0), count: records.filter(r => r.platform === 'coupang').reduce((s, r) => s + (r.deliveryCount || 1), 0), color: COLORS.coupang },
    { name: '배민커넥트', emoji: '🩵', value: records.filter(r => r.platform === 'baemin').reduce((s, r) => s + r.amount, 0), count: records.filter(r => r.platform === 'baemin').reduce((s, r) => s + (r.deliveryCount || 1), 0), color: COLORS.baemin },
    { name: '요기요', emoji: '🔴', value: records.filter(r => r.platform === 'yogiyo').reduce((s, r) => s + r.amount, 0), count: records.filter(r => r.platform === 'yogiyo').reduce((s, r) => s + (r.deliveryCount || 1), 0), color: COLORS.yogiyo },
    { name: '기타', emoji: '🟣', value: records.filter(r => r.platform === 'other').reduce((s, r) => s + r.amount, 0), count: records.filter(r => r.platform === 'other').reduce((s, r) => s + (r.deliveryCount || 1), 0), color: COLORS.other }
  ];

  const formatMoney = (amount) => new Intl.NumberFormat('ko-KR').format(amount) + '원';
  const formatShortMoney = (amount) => {
    if (amount === 0) return '0';
    const man = amount / 10000;
    if (man < 10) return man.toFixed(1) + '만';
    return Math.round(man) + '만';
  };

  const getThisMonthProgress = () => {
    const thisMonthStats = getStats('thisMonth');
    if (monthlyGoal <= 0) return 0;
    return Math.min(100, Math.round((thisMonthStats.total / monthlyGoal) * 100));
  };

  const PlatformIcon = ({ platform, size = 5 }) => {
    const cls = `w-${size} h-${size}`;
    if (platform === 'coupang') return <Package className={cls} style={{ color: COLORS.coupang }} />;
    if (platform === 'baemin') return <Truck className={cls} style={{ color: COLORS.baemin }} />;
    if (platform === 'yogiyo') return <UtensilsCrossed className={cls} style={{ color: COLORS.yogiyo }} />;
    return <Wallet className={cls} style={{ color: COLORS.other }} />;
  };

  // 홈 화면
  const HomeScreen = () => {
    const dayStats = getStatsForDate(selectedDay);
    const weekStats = getStats('week');
    const thisMonthStats = getStats('thisMonth');
    const progress = getThisMonthProgress();

    return (
      <div className="p-4 pb-24">
        {/* 일별 수익 - 화살표로 날짜 이동 */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 text-white mb-4 shadow-lg">
          {/* 날짜 네비게이션 */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={goToPrevDay} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <p className="text-yellow-400 font-medium">📅 {getSelectedDateString()}</p>
              {!isToday() && (
                <button onClick={goToToday} className="text-xs text-gray-400 underline mt-1">오늘로 이동</button>
              )}
            </div>
            <button onClick={goToNextDay} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          {/* 수익 표시 */}
          <p className="text-4xl font-bold text-center text-yellow-400 mb-2">{formatMoney(dayStats.total)}</p>
          <p className="text-gray-400 text-sm text-center mb-4">🚚 {dayStats.totalDeliveries}건 배달</p>
          
          {/* 플랫폼별 */}
          <div className="flex gap-2 text-xs flex-wrap justify-center">
            <span className="bg-white/10 px-2 py-1 rounded-full">🔵 쿠팡 {formatMoney(getStatsForDate(selectedDay, 'coupang').total)}</span>
            <span className="bg-white/10 px-2 py-1 rounded-full">🩵 배민 {formatMoney(getStatsForDate(selectedDay, 'baemin').total)}</span>
            <span className="bg-white/10 px-2 py-1 rounded-full">🔴 요기요 {formatMoney(getStatsForDate(selectedDay, 'yogiyo').total)}</span>
            <span className="bg-white/10 px-2 py-1 rounded-full">🟣 기타 {formatMoney(getStatsForDate(selectedDay, 'other').total)}</span>
          </div>
        </div>

        {/* 광고 배너 */}
        <div className="mb-4">
          <AdBanner />
        </div>

        {/* 이번달 목표 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">🎯 이번달 목표</h3>
            <button onClick={() => setShowGoalModal(true)} className="p-1 text-gray-400">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          {monthlyGoal > 0 ? (
            <>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">{formatMoney(thisMonthStats.total)}</span>
                <span className="text-gray-500">{formatMoney(monthlyGoal)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className={`h-4 rounded-full transition-all ${progress >= 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-center">
                <span className={`text-2xl font-bold ${progress >= 100 ? 'text-green-500' : 'text-yellow-600'}`}>{progress}%</span>
                <span className="text-gray-500 text-sm ml-1">달성</span>
                {progress >= 100 && <span className="ml-2">🎉</span>}
              </div>
              <p className="text-center text-sm text-gray-400 mt-1">
                {monthlyGoal - thisMonthStats.total > 0 
                  ? `목표까지 ${formatMoney(monthlyGoal - thisMonthStats.total)} 남음`
                  : `목표 초과 달성! +${formatMoney(thisMonthStats.total - monthlyGoal)}`
                }
              </p>
            </>
          ) : (
            <button onClick={() => setShowGoalModal(true)} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              목표 금액을 설정해보세요
            </button>
          )}
        </div>
        
        <button onClick={() => openInputModal(selectedDay.toISOString().split('T')[0])} className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-gray-900 rounded-xl p-4 mb-4 font-semibold shadow-lg active:bg-yellow-600">
          <Plus className="w-5 h-5" />
          <span>수익 입력하기</span>
        </button>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">최근 7일 수익</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={getDailyData(7)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatShortMoney(v)} />
              <Tooltip formatter={(v) => formatMoney(v)} />
              <Bar dataKey="쿠팡이츠" stackId="a" fill={COLORS.coupang} />
              <Bar dataKey="배민커넥트" stackId="a" fill={COLORS.baemin} />
              <Bar dataKey="요기요" stackId="a" fill={COLORS.yogiyo} />
              <Bar dataKey="기타" stackId="a" fill={COLORS.other} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 광고 배너 */}
        <div className="mb-4">
          <AdBanner />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">이번 주</p>
            <p className="text-xl font-bold text-gray-800">{formatMoney(weekStats.total)}</p>
            <p className="text-xs text-gray-400">{weekStats.totalDeliveries}건</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">이번 달</p>
            <p className="text-xl font-bold text-gray-800">{formatMoney(thisMonthStats.total)}</p>
            <p className="text-xs text-gray-400">{thisMonthStats.totalDeliveries}건</p>
          </div>
        </div>
      </div>
    );
  };

  // 통계 화면
  const StatsScreen = () => {
    const [period, setPeriod] = useState('month');
    const [platform, setPlatform] = useState('all');
    const [viewType, setViewType] = useState('amount');
    const stats = getStats(period, platform);
    const dailyData = getDailyData(period === 'week' ? 7 : 30);
    const monthlyData = getMonthlyData();
    const ratio = getPlatformRatio();

    return (
      <div className="p-4 pb-24">
        <h2 className="text-xl font-bold text-gray-800 mb-4">수익 통계</h2>
        
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button onClick={() => setViewType('amount')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${viewType === 'amount' ? 'bg-white shadow text-yellow-600' : 'text-gray-500'}`}>
            💰 금액
          </button>
          <button onClick={() => setViewType('count')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${viewType === 'count' ? 'bg-white shadow text-yellow-600' : 'text-gray-500'}`}>
            🚚 건수
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {[{ key: 'week', label: '📅 주간' }, { key: 'month', label: '🗓️ 월간' }, { key: 'year', label: '📆 년간' }].map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)} className={`px-4 py-2 rounded-full text-sm ${period === p.key ? 'bg-yellow-500 text-gray-900' : 'bg-gray-100 text-gray-600'}`}>{p.label}</button>
          ))}
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[{ key: 'all', label: '📊 통합' }, { key: 'coupang', label: '🔵 쿠팡' }, { key: 'baemin', label: '🩵 배민' }, { key: 'yogiyo', label: '🔴 요기요' }, { key: 'other', label: '🟣 기타' }].map(p => (
            <button key={p.key} onClick={() => setPlatform(p.key)} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${platform === p.key ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}>{p.label}</button>
          ))}
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 mb-4 text-white">
          <p className="text-gray-400 text-sm mb-1">{period === 'week' ? '최근 7일' : period === 'month' ? '최근 30일' : '최근 1년'}{platform !== 'all' && ` · ${PLATFORM_NAMES[platform]}`}</p>
          {viewType === 'amount' ? (
            <>
              <p className="text-3xl font-bold text-yellow-400 mb-3">{formatMoney(stats.total)}</p>
              <div className="flex gap-4 text-sm">
                <div><p className="text-gray-400">배달 건수</p><p className="font-semibold">{stats.totalDeliveries}건</p></div>
                <div><p className="text-gray-400">건당 평균</p><p className="font-semibold">{formatMoney(stats.avg)}</p></div>
              </div>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-yellow-400 mb-3">{stats.totalDeliveries}건</p>
              <div className="flex gap-4 text-sm">
                <div><p className="text-gray-400">총 금액</p><p className="font-semibold">{formatMoney(stats.total)}</p></div>
                <div><p className="text-gray-400">건당 평균</p><p className="font-semibold">{formatMoney(stats.avg)}</p></div>
              </div>
            </>
          )}
        </div>

        {/* 광고 배너 */}
        <div className="mb-4">
          <AdBanner />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">{period === 'year' ? '월별' : '일별'} {viewType === 'amount' ? '수익' : '배달 건수'} 추이</h3>
          <ResponsiveContainer width="100%" height={200}>
            {period === 'year' ? (
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => viewType === 'amount' ? formatShortMoney(v) : v} />
                <Tooltip formatter={(v) => viewType === 'amount' ? formatMoney(v) : `${v}건`} />
                {viewType === 'amount' ? (
                  <>
                    <Bar dataKey="쿠팡이츠" stackId="a" fill={COLORS.coupang} />
                    <Bar dataKey="배민커넥트" stackId="a" fill={COLORS.baemin} />
                    <Bar dataKey="요기요" stackId="a" fill={COLORS.yogiyo} />
                    <Bar dataKey="기타" stackId="a" fill={COLORS.other} radius={[4, 4, 0, 0]} />
                  </>
                ) : (
                  <>
                    <Bar dataKey="쿠팡건수" stackId="a" fill={COLORS.coupang} name="쿠팡이츠" />
                    <Bar dataKey="배민건수" stackId="a" fill={COLORS.baemin} name="배민커넥트" />
                    <Bar dataKey="요기요건수" stackId="a" fill={COLORS.yogiyo} name="요기요" />
                    <Bar dataKey="기타건수" stackId="a" fill={COLORS.other} name="기타" radius={[4, 4, 0, 0]} />
                  </>
                )}
              </BarChart>
            ) : (
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => viewType === 'amount' ? formatShortMoney(v) : v} />
                <Tooltip formatter={(v) => viewType === 'amount' ? formatMoney(v) : `${v}건`} />
                <Line type="monotone" dataKey={viewType === 'amount' ? '합계' : '총건수'} stroke="#EAB308" strokeWidth={2} dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">📋 {period === 'year' ? '월별' : '일별'} 상세</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(period === 'year' ? monthlyData : dailyData).slice().reverse().map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">{item.date}</span>
                <div className="text-right">
                  <p className="font-bold text-yellow-600">{formatMoney(item.합계)}</p>
                  <p className="text-xs text-gray-400">{item.총건수}건</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {platform === 'all' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">플랫폼별 비율</h3>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={120}>
                <PieChart><Pie data={ratio} cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey={viewType === 'amount' ? 'value' : 'count'}>{ratio.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {ratio.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{item.emoji}</span>
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-semibold ml-auto">
                      {viewType === 'amount' ? formatMoney(item.value) : `${item.count}건`}
                    </span>
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
    const getDayCount = (day) => getDateRecords(day).reduce((s, r) => s + (r.deliveryCount || 1), 0);
    const getMonthTotal = () => records.filter(r => { const d = new Date(r.date); return d.getFullYear() === year && d.getMonth() === month; }).reduce((s, r) => s + r.amount, 0);
    const getColorIntensity = (amt) => amt === 0 ? 'bg-gray-50' : amt < 50000 ? 'bg-yellow-100' : amt < 100000 ? 'bg-yellow-200' : amt < 150000 ? 'bg-yellow-300' : amt < 200000 ? 'bg-yellow-400' : 'bg-yellow-500';

    const days = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    const selectedRecords = selectedDate ? getDateRecords(selectedDate) : [];

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
        <button onClick={() => setCurrentMonth(new Date())} className="mx-auto block px-4 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full mb-4">오늘</button>
        
        {/* 광고 배너 */}
        <div className="mb-4">
          <AdBanner />
        </div>

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
              const isTodayDate = new Date().toISOString().split('T')[0] === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayOfWeek = (firstDay + day - 1) % 7;
              return (
                <button key={day} onClick={() => setSelectedDate(selectedDate === day ? null : day)} className={`aspect-square rounded-lg flex flex-col items-center justify-center ${getColorIntensity(total)} ${selectedDate === day ? 'ring-2 ring-yellow-500' : ''} ${isTodayDate ? 'ring-2 ring-orange-400' : ''}`}>
                  <span className={`text-sm font-medium ${dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-700'} ${total > 150000 ? 'text-gray-900' : ''}`}>{day}</span>
                  {total > 0 && <span className={`text-xs ${total > 150000 ? 'text-gray-700' : 'text-gray-600'}`}>{formatShortMoney(total)}</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm mb-4">
          <p className="text-xs text-gray-500 mb-2">수익 범례</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-50 border"></span>0</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-100"></span>~5만</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-200"></span>~10만</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-300"></span>~15만</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400"></span>~20만</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500"></span>20만+</span>
          </div>
        </div>
        {selectedDate && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">{month + 1}월 {selectedDate}일</h3>
              <div className="text-right">
                <p className="text-lg font-bold text-yellow-600">{formatMoney(getDayTotal(selectedDate))}</p>
                <p className="text-xs text-gray-400">{getDayCount(selectedDate)}건</p>
              </div>
            </div>
            {selectedRecords.length === 0 ? <p className="text-gray-400 text-center py-4">기록이 없습니다</p> : (
              <div className="space-y-2">
                {selectedRecords.map(r => (
                  <div key={r.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: COLORS[r.platform] + '20' }}>
                      <PlatformIcon platform={r.platform} size={4} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{PLATFORM_NAMES[r.platform]}</p>
                      <p className="text-xs text-gray-400">{r.deliveryCount || 1}건</p>
                    </div>
                    <p className="font-semibold">{formatMoney(r.amount)}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => { openInputModal(`${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`); }} className="w-full mt-3 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 flex items-center justify-center gap-2">
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
          <button onClick={() => openInputModal()} className="bg-yellow-500 text-gray-900 p-2 rounded-full"><Plus className="w-5 h-5" /></button>
        </div>

        {/* 광고 배너 */}
        <div className="mb-4">
          <AdBanner />
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12 text-gray-400"><Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>아직 기록이 없습니다</p></div>
        ) : (
          Object.entries(grouped).map(([date, recs]) => (
            <div key={date} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-500">{formatDate(date)}</h3>
                <div className="text-right">
                  <span className="text-sm text-gray-600 font-medium">{formatMoney(recs.reduce((s, r) => s + r.amount, 0))}</span>
                  <span className="text-xs text-gray-400 ml-2">{recs.reduce((s, r) => s + (r.deliveryCount || 1), 0)}건</span>
                </div>
              </div>
              <div className="space-y-2">
                {recs.map(r => (
                  <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: COLORS[r.platform] + '20' }}>
                      <PlatformIcon platform={r.platform} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{PLATFORM_NAMES[r.platform]}</p>
                      <p className="text-xs text-gray-400">{r.deliveryCount || 1}건</p>
                    </div>
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
    <div className="min-h-screen bg-gray-100">
      {/* 상단 헤더 - 달돈 로고 */}
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Logo />
          {activeTab === 'home' && (
            <span className="text-sm text-gray-500">배달 수익 관리</span>
          )}
          {activeTab === 'stats' && (
            <span className="text-sm text-gray-500">수익 통계</span>
          )}
          {activeTab === 'calendar' && (
            <span className="text-sm text-gray-500">달력</span>
          )}
          {activeTab === 'records' && (
            <span className="text-sm text-gray-500">기록</span>
          )}
        </div>
      </header>
      <main>
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'stats' && <StatsScreen />}
        {activeTab === 'calendar' && <CalendarScreen />}
        {activeTab === 'records' && <RecordsScreen />}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-around safe-area-bottom">
        {[{ key: 'home', icon: TrendingUp, label: '홈' }, { key: 'stats', icon: BarChart3, label: '통계' }, { key: 'calendar', icon: CalendarDays, label: '달력' }, { key: 'records', icon: Calendar, label: '기록' }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex flex-col items-center gap-1 ${activeTab === tab.key ? 'text-yellow-500' : 'text-gray-400'}`}>
            <tab.icon className="w-6 h-6" /><span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      <InputModal isOpen={showInputModal} onClose={() => setShowInputModal(false)} onSave={saveRecord} initialDate={inputDate} />
      <GoalModal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} currentGoal={monthlyGoal} onSave={saveGoal} />
      
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 12px); }
      `}</style>
    </div>
  );
}
