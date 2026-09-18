import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, CircleHelp, Download, Gift, Home as HomeIcon, Megaphone, Package, Plus, QrCode, Search, Settings2, WalletCards, X } from 'lucide-react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();
type Icon = typeof HomeIcon;
const nav = [
  { href: '/', label: '홈', icon: HomeIcon },
  { href: '/check-in', label: '체크인', icon: QrCode },
  { href: '/benefits', label: '특전', icon: Gift },
  { href: '/notice', label: '공지·문의', icon: Megaphone },
  { href: '/settlement', label: '정산', icon: WalletCards },
];

function usePersist<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}

function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return <div className="app-shell">
    <aside className="desktop-rail">
      <div className="brand">Fan <em>Event</em> Studio</div>
      {nav.map(({ href, label, icon: IconComp }) => <Link key={href} href={href} className={`rail-link ${location === href ? 'active' : ''}`} data-testid={`link-rail-${label}`}><IconComp size={17}/>{label}</Link>)}
      <div style={{ marginTop: 'auto' }}>
        <Link href="/create" className="rail-link" data-testid="link-rail-create"><Plus size={17}/>새 이벤트 만들기</Link>
      </div>
    </aside>
    <main className="app-content">{children}</main>
    <nav className="bottom-nav">{nav.map(({ href, label, icon: IconComp }) => <Link key={href} href={href} className={`nav-item ${location === href ? 'active' : ''}`} data-testid={`link-nav-${label}`}><IconComp/>{label}</Link>)}</nav>
  </div>;
}

function Header({ title, eyebrow, back = false, action }: { title: string; eyebrow?: string; back?: boolean; action?: React.ReactNode }) {
  const [, setLocation] = useLocation();
  return <header className="page-header">
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {back && <button className="icon-btn back-btn" onClick={() => setLocation('/')} data-testid="button-back"><ChevronLeft size={21}/></button>}
      <div><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1></div>
    </div>
    {action}
  </header>;
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const timer = setTimeout(onDone, 2400); return () => clearTimeout(timer); }, [onDone]);
  return <div className="toast" data-testid="status-toast">{message}</div>;
}

function DateTabs() {
  const dates = [['금', '3/14'], ['토', '3/15'], ['일', '3/16']];
  const [selected, setSelected] = useState(1);
  return <div className="date-row">{dates.map(([day, date], i) => <button key={date} className={`date-chip ${selected === i ? 'active' : ''}`} onClick={() => setSelected(i)} data-testid={`button-date-${i}`}><strong>{date}</strong><small>{day}요일</small></button>)}</div>;
}

function Home() {
  const [toast, setToast] = useState('');
  const [schedule, setSchedule] = usePersist('fes-schedule', { '11:00': 4, '13:00': 3, '17:00': 5 });
  const slots = [['11:00', '15:00', 4, 4], ['15:00', '20:00', 3, 5]];
  return <Shell><Header eyebrow="인혁 · 시프트" title="인혁 · 시프트" action={<div style={{ display: 'flex', gap: 7 }}><Link href="/create" className="icon-btn" data-testid="link-create-event"><Plus size={18}/></Link><button className="icon-btn" onClick={() => setToast('검색할 내용을 입력해 주세요')} data-testid="button-search"><Search size={18}/></button></div>}/>
    <section className="hero-event coral-card">
      <span className="pill" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>LIVE · Day 2</span>
      <h1>지훈 생일카페 2026</h1><p>팬들과 함께 만드는 가장 따뜻한 하루</p><div className="event-date">2026. 3. 14 — 3. 16 · 서울 마포구</div>
    </section>
    <div className="section-head"><h2>예약 현황</h2><button onClick={() => setToast('예약 관리 화면을 준비하고 있어요')} data-testid="button-manage-reservations">전체 보기 <ChevronRight size={13}/></button></div>
    <DateTabs/>
    {slots.map(([start, end, count, max], i) => <div className="card schedule-card" key={start} data-testid={`card-schedule-${i}`}>
      <div className="schedule-top"><div><div className="schedule-time">{start} – {end}</div><div className="schedule-meta">예약 {count}명 · 대기 {i + 1}명</div></div><span className={`pill ${count === max ? 'pill-amber' : 'pill-green'}`}>{count}/{max}</span></div>
      <div className="benefit-dots"><span>사인</span><span>특전</span><span>포토</span><span>굿즈</span></div>
    </div>)}
    <div className="section-head"><h2>지원 대기 <span className="pill pill-pink">2</span></h2><button onClick={() => setToast('대기 명단을 확인했어요')} data-testid="button-waiting">관리하기</button></div>
    <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div className="avatar">유</div><div className="row-main"><strong>류나 · @yuna_st</strong><span>3/15 13:00 신청 · 방금 전</span></div><button className="icon-btn" onClick={() => { setSchedule({ ...schedule, '13:00': schedule['13:00'] + 1 }); setToast('대기 손님을 예약으로 확정했어요'); }} data-testid="button-approve-waiting"><ChevronRight size={17}/></button></div>
    {toast && <Toast message={toast} onDone={() => setToast('')}/>}
  </Shell>;
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button className={`switch ${on ? 'on' : ''}`} onClick={onClick} aria-label="토글" data-testid="button-toggle"><i/></button>;
}

function Create() {
  const [, setLocation] = useLocation();
  const [step, setStep] = usePersist('fes-create-step', 0);
  const [draft, setDraft] = usePersist('fes-draft', { name: '지훈 생일카페 2026', intro: '지훈의 생일을 함께 축하해요.', place: '카페 오월', address: '서울 마포구 동교동', type: '생일카페', capacity: '30' });
  const [toggles, setToggles] = usePersist('fes-create-toggles', { live: true, photo: true, music: false });
  const [saved, setSaved] = useState(false);
  const update = (key: string, value: string) => setDraft({ ...draft, [key]: value });
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 1500); };
  const steps = ['기본 정보', '일정·장소', '특전', '신청 폼'];
  return <Shell><Header title="새 이벤트 만들기" back action={<button className="btn btn-ghost" onClick={save} data-testid="button-save-draft">임시저장</button>}/>
    <div className="stepper">{steps.map((_, i) => <i key={i} className={i <= step ? 'on' : ''}/>)}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 18 }}><div><div className="eyebrow">STEP {step + 1} / 4</div><h2 style={{ margin: '5px 0 0', font: '800 20px var(--font-display)', letterSpacing: '-.05em' }}>{steps[step]}</h2></div><span className="pill">{step === 3 ? '마지막 단계' : '작성 중'}</span></div>
    <div className="card form-card fade-in">
      {step === 0 && <><div className="field"><label>이벤트 이름</label><input value={draft.name} onChange={e => update('name', e.target.value)} data-testid="input-event-name"/></div><div className="field"><label>한 줄 소개</label><input value={draft.intro} onChange={e => update('intro', e.target.value)} data-testid="input-event-intro"/></div><div className="field"><label>이벤트 유형</label><div className="chip-row">{['생일카페','팬미팅','전시','팝업'].map(x => <button key={x} className={`choice ${draft.type === x ? 'selected' : ''}`} onClick={() => update('type', x)} data-testid={`button-type-${x}`}>{x}</button>)}</div></div></>}
      {step === 1 && <><div className="field"><label>장소 이름</label><input value={draft.place} onChange={e => update('place', e.target.value)} data-testid="input-place"/></div><div className="field"><label>주소</label><input value={draft.address} onChange={e => update('address', e.target.value)} data-testid="input-address"/></div><div className="field"><label>운영 날짜</label><div style={{ display: 'flex', gap: 8 }}><input type="date" defaultValue="2026-03-14" data-testid="input-start-date"/><input type="date" defaultValue="2026-03-16" data-testid="input-end-date"/></div></div><div className="field"><label>회차당 정원</label><input value={draft.capacity} onChange={e => update('capacity', e.target.value)} type="number" data-testid="input-capacity"/></div></>}
      {step === 2 && <><div className="field"><label>제공할 특전을 선택해 주세요</label><div className="toggle-row"><div className="toggle-copy"><strong>로토카드 세트 A</strong><span>예약자 전원 · 1인 1세트</span></div><Toggle on={toggles.live} onClick={() => setToggles({ ...toggles, live: !toggles.live })}/></div><div className="toggle-row"><div className="toggle-copy"><strong>아크릴 키링</strong><span>수량 100개 · 현장 수령</span></div><Toggle on={toggles.photo} onClick={() => setToggles({ ...toggles, photo: !toggles.photo })}/></div><div className="toggle-row"><div className="toggle-copy"><strong>포토 프린트</strong><span>선택 특전 · 장당 2,000원</span></div><Toggle on={toggles.music} onClick={() => setToggles({ ...toggles, music: !toggles.music })}/></div></div></>}
      {step === 3 && <><div className="field"><label>신청 시 받을 정보</label><div className="toggle-row"><div className="toggle-copy"><strong>닉네임</strong><span>필수 입력 항목</span></div><Toggle on onClick={() => {}}/></div><div className="toggle-row"><div className="toggle-copy"><strong>연락처</strong><span>예약 안내 발송용</span></div><Toggle on onClick={() => {}}/></div><div className="toggle-row"><div className="toggle-copy"><strong>응원 메시지</strong><span>선택 입력 항목</span></div><Toggle on={toggles.music} onClick={() => setToggles({ ...toggles, music: !toggles.music })}/></div></div><div className="card" style={{ padding: 15, background: 'hsl(344 100% 97%)', border: 0 }}><strong style={{ fontSize: 13 }}>공개 전 미리보기</strong><span style={{ display: 'block', fontSize: 11, color: 'hsl(var(--muted-foreground))', marginTop: 5 }}>저장 후 이벤트 상세 페이지에서 확인할 수 있어요.</span></div></>}
    </div>
    <div className="sticky-actions">{step > 0 && <button className="btn btn-soft" onClick={() => setStep(step - 1)} data-testid="button-create-prev">이전</button>}{step < 3 ? <button className="btn btn-primary" onClick={() => { save(); setStep(step + 1); }} data-testid="button-create-next">다음 · {steps[step + 1]}</button> : <button className="btn btn-primary" onClick={() => { localStorage.setItem('fes-created', 'true'); setLocation('/event'); }} data-testid="button-create-complete">이벤트 공개하기</button>}</div>
    {saved && <Toast message="임시 저장했어요" onDone={() => setSaved(false)}/>}
  </Shell>;
}

function EventDetail() {
  const [selected, setSelected] = useState(1);
  const [reserved, setReserved] = usePersist('fes-reserved', false);
  const [toast, setToast] = useState('');
  const slots = [['11:00', '2자리 남음'], ['13:00', '마감 임박'], ['17:00', '5자리 남음'], ['19:00', '8자리 남음']];
  return <Shell><div className="public-layout"><Header title="이벤트 둘러보기" back action={<button className="icon-btn"><HeartIcon/></button>}/><section className="hero-event coral-card"><span className="pill" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>생일카페 · 오프라인</span><h1>지훈 생일카페 2026</h1><p>지훈의 생일을 함께 축하해요</p><div className="event-date">3/14(토) — 3/16(월) · 카페 오월</div></section><div className="section-head"><h2>날짜</h2></div><DateTabs/><div className="section-head"><h2>시간대</h2><span className="eyebrow">원하는 회차를 선택해 주세요</span></div><div className="slot-grid">{slots.map(([time, remain], i) => <button key={time} disabled={i === 3} className={`slot ${selected === i ? 'selected' : ''} ${i === 3 ? 'disabled' : ''}`} onClick={() => setSelected(i)} data-testid={`button-slot-${i}`}><strong>{time}</strong><small>{remain}</small></button>)}</div><div className="section-head"><h2>받을 특전</h2></div><div className="card card-pad"><div className="inventory-row"><div className="item-icon"><Gift size={17}/></div><div className="row-main"><strong>로토카드 세트 A</strong><span>예약자 전원 · 현장 수령</span></div><span className="pill pill-green">무료</span></div><div className="inventory-row"><div className="item-icon"><Package size={17}/></div><div className="row-main"><strong>아크릴 키링</strong><span>선택 특전 · 잔여 48개</span></div><span className="row-value">6,000원</span></div></div></div><div className="sticky-actions"><button className="btn btn-primary btn-wide" onClick={() => { setReserved(true); setToast('예약 신청이 완료됐어요'); }} data-testid="button-reserve">{reserved ? '예약 완료 · 내 티켓 보기' : '예약하기'}</button></div>{toast && <Toast message={toast} onDone={() => setToast('')}/>}</Shell>;
}

function HeartIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 8.7c0 5.5-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z"/></svg>; }

function CheckIn() {
  const [checked, setChecked] = usePersist('fes-checked', 18);
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState('');
  return <Shell><Header eyebrow="LIVE · Day 2 · 14:32" title="지훈 생일카페 2026" action={<button className="icon-btn" onClick={() => setToast('체크인 설정을 열었어요')} data-testid="button-checkin-settings"><Settings2 size={18}/></button>}/><div className="card dark-card card-pad" style={{ marginBottom: 12 }}><div className="eyebrow" style={{ color: '#f58ca9' }}>전체 예약자</div><div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginTop: 5 }}><strong style={{ font: '800 32px var(--font-display)' }}>{checked}<small style={{ font: '500 13px var(--font-sans)', marginLeft: 5 }}>명 체크인</small></strong><span style={{ opacity: .7, fontSize: 12 }}>총 30명 중</span></div><div className="progress" style={{ background: '#ffffff25', marginTop: 13 }}><i style={{ width: `${checked / 30 * 100}%`, background: '#f58ca9' }}/></div></div><button className="btn btn-primary btn-wide" style={{ minHeight: 58, marginBottom: 16 }} onClick={() => { setScanning(true); setTimeout(() => { setChecked(checked + 1); setScanning(false); setToast('김하늘 님 체크인이 완료됐어요'); }, 900); }} data-testid="button-scan-qr"><QrCode size={20}/>{scanning ? 'QR 코드를 확인하는 중…' : 'QR 체크인 스캔'}</button><div className="section-head"><h2>특전 배부 현황</h2><button onClick={() => setToast('특전 재고 화면으로 이동해요')} data-testid="button-open-inventory">관리하기</button></div><div className="card card-pad"><div className="inventory-row"><div className="item-icon"><Gift size={17}/></div><div className="row-main"><strong>로토카드 세트 A</strong><span>배부 완료 · 전체 300개</span></div><b className="row-value">188</b></div><div className="progress"><i style={{ width: '63%' }}/></div><div className="inventory-row"><div className="item-icon" style={{ background: '#fff4d8', color: '#a5762b' }}><Package size={17}/></div><div className="row-main"><strong>아크릴 키링</strong><span>배부 대기 · 전체 100개</span></div><b className="row-value" style={{ color: '#b7833b' }}>48</b></div></div><div className="section-head"><h2>최근 체크인 <span className="pill pill-pink">3</span></h2></div><div className="card card-pad">{['김하늘 · 현장 예약', '박지수 · 13:00 회차', '최유진 · 사전 예약'].map((x, i) => <div className="inventory-row" key={x}><div className="avatar">{x[0]}</div><div className="row-main"><strong>{x}</strong><span>{i + 1}분 전 · 특전 수령 완료</span></div><span className="pill pill-green">완료</span></div>)}</div>{toast && <Toast message={toast} onDone={() => setToast('')}/>}</Shell>;
}

function Benefits() {
  const [near, setNear] = usePersist('fes-near-stock', true);
  const [tab, setTab] = useState('전체');
  const [toast, setToast] = useState('');
  const items = [{ name: '로토카드 세트 A', detail: '배부 완료 188 · 남은 수량 112', qty: '312/500', percent: 63, type: '증정' }, { name: '아크릴 키링', detail: '재고 부족 알림 · 남은 수량 48', qty: '48/100', percent: 48, type: '유료' }, { name: '슬로건 스트랩', detail: '준비 중 · 입고 예정 3/13', qty: '0/80', percent: 0, type: '증정' }];
  return <Shell><Header title="특전 재고" action={<button className="btn btn-ghost" onClick={() => setToast('재고가 최신 상태예요')} data-testid="button-refresh-inventory">새로고침</button>}/><div className="card card-pad" style={{ marginBottom: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><div><div className="eyebrow">전체 준비율</div><strong style={{ font: '800 28px var(--font-display)' }}>61%</strong></div><div style={{ textAlign: 'right' }}><span className="eyebrow">총 준비 수량</span><strong style={{ display: 'block', font: '800 14px var(--font-display)', marginTop: 6 }}>1,150개</strong></div></div><div className="progress"><i style={{ width: '61%' }}/></div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'hsl(var(--muted-foreground))', marginTop: 8 }}><span>배부 완료 449</span><span>품목 3개</span></div></div><div className="tab-row">{['전체', '증정', '유료'].map(x => <button className={`tab ${tab === x ? 'active' : ''}`} key={x} onClick={() => setTab(x)} data-testid={`button-benefit-tab-${x}`}>{x}</button>)}</div><div className="card card-pad" style={{ marginTop: 12 }}>{items.filter(x => tab === '전체' || x.type === tab).filter(x => near || x.percent > 20).map((x, i) => <div className="inventory-row" key={x.name}><div className="item-icon">{i === 1 ? <Package size={17}/> : <Gift size={17}/>}</div><div className="row-main"><strong>{x.name} <span className={`pill ${x.percent < 50 ? 'pill-amber' : 'pill-green'}`} style={{ display: 'inline-block', marginLeft: 4 }}>{x.type}</span></strong><span>{x.detail}</span><div className="progress" style={{ marginTop: 9 }}><i style={{ width: `${x.percent}%` }}/></div></div><b className="row-value">{x.qty}</b></div>)}{items.filter(x => tab === '전체' || x.type === tab).length === 0 && <div style={{ textAlign: 'center', padding: 25, color: 'hsl(var(--muted-foreground))', fontSize: 12 }}>표시할 특전이 없어요.</div>}</div><div className="toggle-row card card-pad" style={{ marginTop: 12 }}><div className="toggle-copy"><strong>재고 부족 품목 보기</strong><span>남은 수량 20% 이하 알림</span></div><Toggle on={near} onClick={() => setNear(!near)}/></div>{toast && <Toast message={toast} onDone={() => setToast('')}/>}</Shell>;
}

function Notice() {
  const [tab, setTab] = useState('공지');
  const [notices, setNotices] = usePersist('fes-notices', [{ title: '새 공지 작성', body: '지훈 생일카페를 찾아주셔서 감사합니다.', date: '3/15 09:00' }, { title: '특전 재고 안내', body: '키링은 1인 1개 수령 가능합니다.', date: '3/14 18:20' }]);
  const [compose, setCompose] = useState(false);
  const [draft, setDraft] = useState({ title: '', body: '' });
  const [toast, setToast] = useState('');
  return <Shell><Header title="공지 · 문의" back action={<button className="icon-btn" onClick={() => setToast('알림을 확인했어요')} data-testid="button-notice-alert"><Megaphone size={17}/></button>}/><div className="tab-row" style={{ marginBottom: 12 }}><button className={`tab ${tab === '공지' ? 'active' : ''}`} onClick={() => setTab('공지')} data-testid="button-notices-tab">공지 <span className="pill pill-pink">2</span></button><button className={`tab ${tab === '문의' ? 'active' : ''}`} onClick={() => setTab('문의')} data-testid="button-questions-tab">문의 <span className="pill pill-pink">4</span></button></div>{tab === '공지' ? <><button className="notice-compose" onClick={() => setCompose(true)} data-testid="button-compose-notice"><div className="avatar"><Plus size={16}/></div><div><strong>새 공지 작성</strong><span style={{ display: 'block', fontSize: 11, marginTop: 3 }}>참여자에게 소식을 알려주세요</span></div></button><div className="section-head"><h2>발행된 공지</h2><span className="eyebrow">최신순</span></div><div className="card card-pad">{notices.map((n, i) => <div className="notice-row" key={`${n.title}-${i}`}><div className="item-icon"><Megaphone size={16}/></div><div className="row-main"><strong>{n.title}</strong><span>{n.body}</span><small style={{ color: 'hsl(var(--muted-foreground))', fontSize: 10, display: 'block', marginTop: 6 }}>{n.date}</small></div><ChevronRight size={15} color="hsl(var(--muted-foreground))"/></div>)}</div></> : <div className="card card-pad">{['특전 수령 방법 궁금해요', '13:00 예약 변경 가능할까요?', '현장에서도 신청할 수 있나요?', '주차 공간이 있나요?'].map((q, i) => <div className="question-row" key={q}><div className="avatar" style={{ background: i === 0 ? '#eee8ff' : undefined }}>Q</div><div className="row-main"><strong>{q}</strong><span>김하늘 · {i + 1}시간 전</span></div><span className={`pill ${i < 2 ? 'pill-green' : 'pill-amber'}`}>{i < 2 ? '답변 완료' : '답변 대기'}</span></div>)}</div>}{compose && <div style={{ position: 'fixed', inset: 0, background: '#2c202a44', zIndex: 30, display: 'grid', placeItems: 'end center' }}><div className="card form-card" style={{ width: 'min(100%,680px)', borderRadius: '24px 24px 0 0' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}><h2 style={{ margin: 0, font: '800 18px var(--font-display)' }}>새 공지 작성</h2><button className="icon-btn" onClick={() => setCompose(false)} data-testid="button-close-compose"><X size={17}/></button></div><div className="field"><label>제목</label><input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="공지 제목을 입력해 주세요" data-testid="input-notice-title"/></div><div className="field"><label>내용</label><textarea value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} placeholder="참여자에게 전할 내용을 입력해 주세요" data-testid="input-notice-body"/></div><button className="btn btn-primary btn-wide" onClick={() => { if (!draft.title) return; setNotices([{ ...draft, date: '방금 전' }, ...notices]); setDraft({ title: '', body: '' }); setCompose(false); setToast('공지를 발행했어요'); }} data-testid="button-publish-notice">공지 발행하기</button></div></div>}{toast && <Toast message={toast} onDone={() => setToast('')}/>}</Shell>;
}

function Settlement() {
  const [toast, setToast] = useState('');
  const transactions = [['정산 잔액 · 현금 결제', '+25,000', '오늘 14:20'], ['아크릴 키링 제작비', '-820,000', '3/13 16:10'], ['입금자 미확인', '+18,000', '3/13 10:05'], ['장소 대관료 선금', '-1,200,000', '3/10 12:00']];
  return <Shell><Header title="정산 · 환불" action={<button className="icon-btn" onClick={() => setToast('정산 내역을 다운로드했어요')} data-testid="button-download-settlement"><Download size={17}/></button>}/><div className="tab-row" style={{ marginBottom: 14 }}><button className="tab active">입금액</button><button className="tab">환불 요청 <span className="pill pill-pink">2</span></button></div><section className="balance"><small>현재 정산 가능 금액</small><strong>1,730,000<small style={{ fontSize: 13, opacity: .8, marginLeft: 4 }}>원</small></strong><div className="balance-grid"><div><span>총 수입</span><b className="income">+3,840,000원</b></div><div><span>총 지출</span><b>-2,110,000원</b></div></div></section><div className="card" style={{ padding: '6px 18px' }}><div className="section-head" style={{ marginTop: 10 }}><h2>최근 거래</h2><button onClick={() => setToast('전체 내역을 불러왔어요')} data-testid="button-all-transactions">전체 내역</button></div>{transactions.map(([name, amount, date], i) => <div className="transaction-row" key={name}><div className="item-icon" style={{ background: i % 2 ? '#f1e9ff' : '#e9f4ed', color: i % 2 ? '#8067af' : '#468160' }}>{i % 2 ? <Package size={16}/> : <WalletCards size={16}/>}</div><div className="row-main"><strong>{name}</strong><span>{date}</span></div><b className="row-value" style={{ color: amount.startsWith('+') ? '#468160' : 'hsl(var(--foreground))' }}>{amount}원</b></div>)}</div><button className="btn btn-primary btn-wide" style={{ marginTop: 14 }} onClick={() => setToast('정산 신청서를 준비했어요')} data-testid="button-request-settlement">정산 신청하기</button>{toast && <Toast message={toast} onDone={() => setToast('')}/>}</Shell>;
}

function NotFound() { return <Shell><Header title="페이지를 찾을 수 없어요" back/><div className="card card-pad" style={{ textAlign: 'center', marginTop: 50 }}><CircleHelp size={40} color="hsl(var(--primary))" style={{ margin: '0 auto 12px' }}/><p style={{ color: 'hsl(var(--muted-foreground))', fontSize: 13 }}>요청하신 페이지가 존재하지 않습니다.</p><Link href="/" className="btn btn-primary" data-testid="link-back-home">홈으로 돌아가기</Link></div></Shell>; }

function Router() {
  return <Switch><Route path="/" component={Home}/><Route path="/home" component={Home}/><Route path="/create" component={Create}/><Route path="/event" component={EventDetail}/><Route path="/check-in" component={CheckIn}/><Route path="/benefits" component={Benefits}/><Route path="/notice" component={Notice}/><Route path="/settlement" component={Settlement}/><Route component={NotFound}/></Switch>;
}

export default function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><ErrorBoundary resetKey={location.pathname}><Router/></ErrorBoundary><Toaster/></TooltipProvider></QueryClientProvider>;
}