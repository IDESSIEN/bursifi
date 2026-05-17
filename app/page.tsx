// Bursifi v1.0 - Production build
"use client";
"use client";
import { useState, useEffect, useRef } from "react";
import { bridgeSchoolFees, CHAIN_IDS } from '@/lib/bridge';
import { useConnectorClient, useAccount, useConnect, useDisconnect } from 'wagmi';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Outfit',sans-serif;background:#060710;color:#F5F2FF;min-height:100vh;overflow-x:hidden}
  ::selection{background:rgba(255,209,102,0.35);color:#F5F2FF}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#1E2140;border-radius:2px}
  .orb{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:orbFloat 12s ease-in-out infinite}
  .orb-1{width:600px;height:600px;top:-200px;left:-120px;background:radial-gradient(circle,rgba(255,209,102,0.14) 0%,transparent 70%);animation-delay:0s}
  .orb-2{width:500px;height:500px;bottom:-120px;right:-100px;background:radial-gradient(circle,rgba(0,255,178,0.12) 0%,transparent 70%);animation-delay:-6s}
  .orb-3{width:350px;height:350px;top:45%;left:55%;background:radial-gradient(circle,rgba(130,100,255,0.1) 0%,transparent 70%);animation-delay:-3s}
  @keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.95)}}
  .glass-card{background:linear-gradient(145deg,#161928 0%,#111320 100%);border:1px solid rgba(255,255,255,0.09);border-radius:20px;position:relative;overflow:hidden;transition:border-color 0.3s,box-shadow 0.3s}
  .glass-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.04) 0%,transparent 55%);pointer-events:none;border-radius:inherit}
  .glass-card:hover{border-color:rgba(255,209,102,0.2);box-shadow:0 0 60px rgba(255,209,102,0.07),0 20px 40px rgba(0,0,0,0.4)}
  .btn-arc{background:linear-gradient(135deg,#00FFB2 0%,#00CC8E 100%);color:#060710;border:none;padding:15px 28px;border-radius:12px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;cursor:pointer;width:100%;letter-spacing:0.02em;position:relative;overflow:hidden;transition:all 0.3s;box-shadow:0 0 35px rgba(0,255,178,0.35),0 4px 20px rgba(0,255,178,0.2)}
  .btn-arc::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 60%);opacity:0;transition:opacity 0.3s}
  .btn-arc:hover::before{opacity:1}
  .btn-arc:hover{transform:translateY(-2px);box-shadow:0 0 50px rgba(0,255,178,0.5),0 8px 30px rgba(0,255,178,0.3)}
  .btn-arc:disabled{opacity:0.3;cursor:not-allowed;transform:none;box-shadow:none}
  .btn-ghost{background:transparent;color:#6B70A0;border:1px solid rgba(255,255,255,0.09);padding:13px 22px;border-radius:12px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s}
  .btn-ghost:hover{border-color:rgba(255,255,255,0.18);color:#F5F2FF;background:rgba(255,255,255,0.05)}
  .btn-gold{background:transparent;color:#FFD166;border:1px solid rgba(255,209,102,0.35);padding:8px 16px;border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s}
  .btn-gold:hover{background:rgba(255,209,102,0.12);border-color:#FFD166;box-shadow:0 0 20px rgba(255,209,102,0.15)}
  .dark-input{width:100%;padding:14px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:12px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:400;color:#F5F2FF;outline:none;transition:all 0.2s}
  .dark-input::placeholder{color:#6B70A0}
  .dark-input:focus{border-color:rgba(255,209,102,0.5);background:rgba(255,209,102,0.05);box-shadow:0 0 0 3px rgba(255,209,102,0.1)}
  .nav-tab{padding:9px 20px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;border:none;background:transparent;color:#6B70A0;font-family:'Outfit',sans-serif;transition:all 0.2s;letter-spacing:0.01em}
  .nav-tab:hover{color:#F5F2FF}
  .nav-tab.active{background:rgba(255,255,255,0.07);color:#F5F2FF;border:1px solid rgba(255,255,255,0.12);box-shadow:inset 0 1px 0 rgba(255,255,255,0.08)}
  .step-pill{display:flex;align-items:center;gap:8px;padding:7px 16px;border-radius:100px;font-size:13px;font-weight:600;border:1px solid transparent;transition:all 0.3s;white-space:nowrap}
  .step-pill.done{background:rgba(0,255,178,0.12);border-color:rgba(0,255,178,0.35);color:#00FFB2;box-shadow:0 0 16px rgba(0,255,178,0.15)}
  .step-pill.active{background:rgba(255,209,102,0.14);border-color:rgba(255,209,102,0.45);color:#FFD166;box-shadow:0 0 16px rgba(255,209,102,0.15)}
  .step-pill.pending{background:transparent;border-color:rgba(255,255,255,0.08);color:#6B70A0}
  .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase}
  .badge-confirmed{background:rgba(0,255,178,0.12);color:#00FFB2;border:1px solid rgba(0,255,178,0.3)}
  .badge-pending{background:rgba(255,181,71,0.12);color:#FFB547;border:1px solid rgba(255,181,71,0.3)}
  .badge-scheduled{background:rgba(160,130,255,0.12);color:#B09FFF;border:1px solid rgba(160,130,255,0.3)}
  .fade-up{animation:fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes glowPulse{0%,100%{opacity:1;box-shadow:0 0 6px rgba(0,255,178,0.6)}50%{opacity:0.7;box-shadow:0 0 18px rgba(0,255,178,1)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .spinner{width:18px;height:18px;border:2px solid rgba(6,7,16,0.4);border-top-color:#060710;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block}
  .chain-btn{padding:12px 14px;border:1px solid rgba(255,255,255,0.09);border-radius:12px;cursor:pointer;display:flex;align-items:center;gap:10px;background:transparent;transition:all 0.2s;font-family:'Outfit',sans-serif;width:100%}
  .chain-btn:hover{border-color:rgba(255,255,255,0.16);background:rgba(255,255,255,0.04)}
  .chain-btn.selected{border-color:rgba(255,209,102,0.5);background:rgba(255,209,102,0.09);box-shadow:0 0 24px rgba(255,209,102,0.12),inset 0 1px 0 rgba(255,209,102,0.1)}
  .stat-number{font-family:'Bebas Neue',sans-serif;font-size:44px;line-height:1;letter-spacing:0.02em}
  .data-table{width:100%;border-collapse:collapse;font-size:13px}
  .data-table th{padding:12px 16px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6B70A0;border-bottom:1px solid rgba(255,255,255,0.07)}
  .data-table td{padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:middle}
  .data-table tr:hover td{background:rgba(255,255,255,0.025)}
  .data-table tr:last-child td{border-bottom:none}
  .live-dot{width:7px;height:7px;border-radius:50%;background:#00FFB2;display:inline-block;animation:glowPulse 2s infinite;box-shadow:0 0 8px rgba(0,255,178,0.8)}
  .mono{font-family:'JetBrains Mono',monospace;font-size:11px;color:#6B70A0;letter-spacing:-0.02em}
  .field-label{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6B70A0;margin-bottom:8px;display:block}
`;

interface School {
  id: string;
  name: string;
  country: string;
  flag: string;
  city: string;
  wallet: string;
  fees: string;
}

interface Payment {
  id: string;
  school: string;
  student: string;
  amount: number;
  semester: string;
  status: string;
  chain: string;
  date: string;
  txHash: string;
}

const SCHOOLS: School[] = [
  {id:"ULAG",name:"University of Lagos",country:"Nigeria",flag:"🇳🇬",city:"Lagos",wallet:"0x5e6f...7g8h",fees:"$850–$1,200/yr"},
  {id:"UI",name:"University of Ibadan",country:"Nigeria",flag:"🇳🇬",city:"Ibadan",wallet:"0xa1b2...c3d4",fees:"$700–$1,000/yr"},
  {id:"ABU",name:"Ahmadu Bello University",country:"Nigeria",flag:"🇳🇬",city:"Zaria",wallet:"0xe5f6...g7h8",fees:"$600–$900/yr"},
  {id:"OAU",name:"Obafemi Awolowo University",country:"Nigeria",flag:"🇳🇬",city:"Ile-Ife",wallet:"0xi9j0...k1l2",fees:"$650–$950/yr"},
  {id:"UON",name:"University of Nairobi",country:"Kenya",flag:"🇰🇪",city:"Nairobi",wallet:"0x1a2b...3c4d",fees:"$1,200–$2,000/yr"},
  {id:"KENYATTA",name:"Kenyatta University",country:"Kenya",flag:"🇰🇪",city:"Nairobi",wallet:"0xq7r8...s9t0",fees:"$1,000–$1,800/yr"},
  {id:"STRATHMORE",name:"Strathmore University",country:"Kenya",flag:"🇰🇪",city:"Nairobi",wallet:"0xu1v2...w3x4",fees:"$2,500–$4,000/yr"},
  {id:"UCT",name:"University of Cape Town",country:"South Africa",flag:"🇿🇦",city:"Cape Town",wallet:"0x9i0j...1k2l",fees:"$3,000–$6,000/yr"},
  {id:"WITS",name:"University of the Witwatersrand",country:"South Africa",flag:"🇿🇦",city:"Johannesburg",wallet:"0xg3h4...i5j6",fees:"$2,800–$5,500/yr"},
  {id:"UG",name:"University of Ghana",country:"Ghana",flag:"🇬🇭",city:"Accra",wallet:"0xw9x0...y1z2",fees:"$800–$1,500/yr"},
  {id:"KNUST",name:"Kwame Nkrumah Univ. of Science & Tech",country:"Ghana",flag:"🇬🇭",city:"Kumasi",wallet:"0xa3b4...c5d6",fees:"$700–$1,200/yr"},
  {id:"ASHESI",name:"Ashesi University",country:"Ghana",flag:"🇬🇭",city:"Berekuso",wallet:"0xi1j2...k3l4",fees:"$4,500–$7,000/yr"},
  {id:"AAU",name:"Addis Ababa University",country:"Ethiopia",flag:"🇪🇹",city:"Addis Ababa",wallet:"0xm5n6...o7p8",fees:"$400–$800/yr"},
  {id:"MAKERERE",name:"Makerere University",country:"Uganda",flag:"🇺🇬",city:"Kampala",wallet:"0x3m4n...5o6p",fees:"$600–$1,200/yr"},
  {id:"UDSM",name:"University of Dar es Salaam",country:"Tanzania",flag:"🇹🇿",city:"Dar es Salaam",wallet:"0xy7z8...a9b0",fees:"$500–$1,000/yr"},
  {id:"UR",name:"University of Rwanda",country:"Rwanda",flag:"🇷🇼",city:"Kigali",wallet:"0xg5h6...i7j8",fees:"$700–$1,400/yr"},
  {id:"ALU",name:"African Leadership University",country:"Rwanda",flag:"🇷🇼",city:"Kigali",wallet:"0xk9l0...m1n2",fees:"$5,000–$9,000/yr"},
  {id:"UCAD",name:"Cheikh Anta Diop University",country:"Senegal",flag:"🇸🇳",city:"Dakar",wallet:"0xo3p4...q5r6",fees:"$300–$600/yr"},
  {id:"CAIRO",name:"Cairo University",country:"Egypt",flag:"🇪🇬",city:"Cairo",wallet:"0xi3j4...k5l6",fees:"$600–$1,500/yr"},
  {id:"UM5",name:"Mohammed V University",country:"Morocco",flag:"🇲🇦",city:"Rabat",wallet:"0xa5b6...c7d8",fees:"$500–$1,200/yr"},
];

const CHAINS=[
  {id:"ethereum",name:"Ethereum",icon:"⟠"},
  {id:"base",name:"Base",icon:"🔵"},
  { id:"monad",    name:"Monad", icon:"🟣" },
  {id:"solana",name:"Solana",icon:"◎"},
  {id:"arc",name:"Arc",icon:"⬡"},
];

const SEMESTERS=["Semester 1 — Jan 2025","Semester 2 — Jun 2025","Full Year 2025"];

const INITIAL_PAYMENTS: Payment[]=[
  {id:"0xabc1",school:"University of Nairobi",student:"Amara Osei",amount:1200,semester:"Semester 1 — Jan 2025",status:"confirmed",chain:"Base → Arc",date:"Mar 12, 2025",txHash:"0xabc1...def2"},
  {id:"0xabc2",school:"University of Lagos",student:"Chidi Nwosu",amount:850,semester:"Full Year 2025",status:"pending",chain:"Ethereum → Arc",date:"Apr 1, 2025",txHash:"0xghi3...jkl4"},
  {id:"0xabc3",school:"Makerere University",student:"Fatuma Aidah",amount:600,semester:"Semester 2 — Jun 2025",status:"scheduled",chain:"Solana → Arc",date:"Jun 1, 2025",txHash:"—"},
];

function StepBar({step}: {step: number}){
  const steps=["University","Details","Bridge","Done"];
  return(
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:28}}>
      {steps.map((label,i)=>(
        <div key={label} style={{display:"flex",alignItems:"center",flex:i<steps.length-1?1:"none"}}>
          <div className={`step-pill ${i<step?"done":i===step?"active":"pending"}`}>
            <span style={{fontSize:11,lineHeight:1}}>{i<step?"✓":i+1}</span>
            <span>{label}</span>
          </div>
          {i<steps.length-1&&<div style={{flex:1,height:1,background:i<step?"rgba(0,229,160,0.25)":"rgba(255,255,255,0.06)",margin:"0 4px",minWidth:8}}/>}
        </div>
      ))}
    </div>
  );
}

function SendView({onPaymentAdded, address, connectorClient}: {onPaymentAdded: (p: Payment) => void, address: string | undefined, connectorClient: unknown}){
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({school:"",student:"",semester:"",amount:"",fromChain:"base",note:""});
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const [txHash,setTxHash]=useState("");
  const [search,setSearch]=useState("");
  const [open,setOpen]=useState(false);
  const dropRef=useRef<HTMLDivElement>(null);
  const school=SCHOOLS.find(s=>s.id===form.school);

  const filtered=SCHOOLS.filter(s=>
    s.name.toLowerCase().includes(search.toLowerCase())||
    s.country.toLowerCase().includes(search.toLowerCase())||
    s.city.toLowerCase().includes(search.toLowerCase())
  );
  const grouped=filtered.reduce((acc: Record<string,School[]>,s)=>{if(!acc[s.country])acc[s.country]=[];acc[s.country].push(s);return acc},{} as Record<string,School[]>);

  useEffect(()=>{
    const h=(e: MouseEvent)=>{if(dropRef.current&&!dropRef.current.contains(e.target as Node))setOpen(false)};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  const handleSend = async () => {
    if (!address) { alert('Please connect your wallet first!'); return; }
    setLoading(true);
    try {
      const provider = (connectorClient as {transport?: {value?: {provider?: unknown}}})?.transport?.value?.provider
        ?? (window as Window & {ethereum?: unknown}).ethereum;
      if (!provider) throw new Error('No wallet provider found');
      const result = await bridgeSchoolFees({
        fromChainId: CHAIN_IDS[form.fromChain],
        amount: form.amount,
        schoolWallet: school!.wallet,
        studentName: form.student,
        semester: form.semester,
        provider,
      });
      onPaymentAdded({
        id: result.txHash,
        school: school!.name,
        student: form.student,
        amount: Number(form.amount),
        semester: form.semester,
        status: 'confirmed',
        chain: `${form.fromChain} -> Arc`,
        date: new Date().toLocaleDateString(),
        txHash: result.txHash,
      });
      setTxHash(result.txHash);
      setDone(true);
      setStep(3);
    } catch (err: unknown) {
      alert('Transaction failed: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if(done) return(
    <div className="fade-up" style={{textAlign:"center",padding:"12px 0 4px"}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(0,229,160,0.1)",border:"1px solid rgba(0,229,160,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28}}>✓</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:"0.04em",color:"#00E5A0",marginBottom:6}}>PAYMENT CONFIRMED</div>
      <div style={{color:"#5A5E6B",fontSize:14,marginBottom:28}}>USDC bridged &amp; locked in escrow for {school?.name}</div>
      <div style={{background:"rgba(0,229,160,0.04)",border:"1px solid rgba(0,229,160,0.15)",borderRadius:14,padding:"20px 24px",marginBottom:24,textAlign:"left"}}>
        {[["Amount",`${form.amount} USDC`],["Recipient",school?.name],["Student",form.student],["Semester",form.semester],["Bridge",`${CHAINS.find(c=>c.id===form.fromChain)?.name} → Arc`],["Tx Hash",txHash]].map(([k,v])=>(
          <div key={k as string} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:14}}>
            <span style={{color:"#5A5E6B"}}>{k}</span>
            <span style={{fontWeight:600,color:"#F0EDE8",fontFamily:k==="Tx Hash"?"'JetBrains Mono',monospace":"inherit",fontSize:k==="Tx Hash"?11:14}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10}}>
        <button className="btn-ghost" style={{flex:1}} onClick={()=>{setDone(false);setStep(0);setForm({school:"",student:"",semester:"",amount:"",fromChain:"base",note:""})}}>New Payment</button>
        <button className="btn-arc" style={{flex:1}} onClick={()=>window.open(`https://testnet.arcscan.app/tx/${txHash}`,'_blank')}>View on ArcScan ↗</button>
      </div>
    </div>
  );

  return(
    <div>
      <StepBar step={step}/>
      {step===0&&(
        <div className="fade-up" ref={dropRef}>
          <label className="field-label">Select University</label>
          <div style={{position:"relative",marginBottom:12}}>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#6B70A0",fontSize:16,pointerEvents:"none"}}>🔍</span>
            <input className="dark-input" placeholder="Search by name, city, or country…" value={search} onChange={e=>{setSearch(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)} style={{paddingLeft:42}}/>
            {search&&(<span onClick={()=>{setSearch("");setOpen(false);}} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"#6B70A0",fontSize:18}}>×</span>)}
          </div>
          {school&&!open&&(
            <div className="fade-up" style={{marginBottom:12,padding:"14px 16px",background:"rgba(200,169,110,0.05)",border:"1px solid rgba(200,169,110,0.3)",borderRadius:12,display:"flex",gap:14,alignItems:"flex-start"}}>
              <span style={{fontSize:28}}>{school.flag}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:"#F0EDE8",fontSize:15}}>{school.name}</div>
                <div style={{display:"flex",gap:16,marginTop:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,color:"#6B70A0"}}>📍 {school.city}, {school.country}</span>
                  <span style={{fontSize:13,color:"#C8A96E",fontWeight:600}}>{school.fees}</span>
                </div>
                <div style={{marginTop:4,fontSize:11,color:"#6B70A0",fontFamily:"'JetBrains Mono',monospace"}}>{school.wallet}</div>
              </div>
              <button onClick={()=>{setForm(f=>({...f,school:""}));setSearch("");}} style={{background:"none",border:"none",color:"#6B70A0",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
            </div>
          )}
          {open&&(
            <div style={{background:"#15182A",border:"1px solid rgba(255,255,255,0.14)",borderRadius:16,overflow:"hidden",boxShadow:"0 24px 70px rgba(0,0,0,0.7)",marginBottom:12,maxHeight:360,overflowY:"auto"}}>
              <div style={{padding:"8px 16px",background:"rgba(0,0,0,0.3)",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:"#6B70A0",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>{filtered.length} of {SCHOOLS.length} universities</span>
                <span onClick={()=>setOpen(false)} style={{cursor:"pointer",color:"#6B70A0",fontSize:18,lineHeight:1}}>×</span>
              </div>
              {Object.keys(grouped).length===0
                ?<div style={{padding:32,textAlign:"center",color:"#6B70A0",fontSize:14}}>No universities found for &ldquo;{search}&rdquo;</div>
                :Object.entries(grouped).map(([country,schools])=>(
                  <div key={country}>
                    <div style={{padding:"10px 16px 6px",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#6B70A0",background:"rgba(0,0,0,0.35)",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:16}}>{schools[0].flag}</span>
                      <span>{country}</span>
                      <span style={{marginLeft:"auto",fontWeight:400,fontSize:10,color:"#4A4E6B"}}>{schools.length} {schools.length===1?"university":"universities"}</span>
                    </div>
                    {schools.map(s=>(
                      <div key={s.id} onClick={()=>{setForm(f=>({...f,school:s.id}));setOpen(false);setSearch("");}}
                        style={{padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"background 0.15s",background:form.school===s.id?"rgba(200,169,110,0.12)":"transparent",borderLeft:`3px solid ${form.school===s.id?"#C8A96E":"transparent"}`,borderBottom:"1px solid rgba(255,255,255,0.04)"}}
                        onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background="rgba(255,255,255,0.05)"}
                        onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=form.school===s.id?"rgba(200,169,110,0.12)":"transparent"}
                      >
                        <span style={{fontSize:22,flexShrink:0}}>{s.flag}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:14,color:"#F0EDE8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</div>
                          <div style={{fontSize:12,color:"#6B70A0",marginTop:2}}>{s.city} · {s.fees}</div>
                        </div>
                        {form.school===s.id&&<span style={{color:"#C8A96E",fontSize:16,flexShrink:0}}>✓</span>}
                      </div>
                    ))}
                  </div>
                ))
              }
            </div>
          )}
          <div style={{marginTop:8}}>
            <button className="btn-arc" disabled={!form.school} onClick={()=>setStep(1)}>Continue →</button>
          </div>
        </div>
      )}
      {step===1&&(
        <div className="fade-up">
          <div style={{display:"grid",gap:16,marginBottom:20}}>
            {([{key:"student",label:"Student Full Name",placeholder:"e.g. Amara Osei"},{key:"note",label:"Optional Note",placeholder:"e.g. From Dad, London"}] as {key: keyof typeof form, label: string, placeholder: string}[]).map(({key,label,placeholder})=>(
              <div key={key}><label className="field-label">{label}</label><input className="dark-input" placeholder={placeholder} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/></div>
            ))}
            <div><label className="field-label">Semester / Term</label>
              <select className="dark-input" value={form.semester} onChange={e=>setForm(f=>({...f,semester:e.target.value}))} style={{appearance:"none",cursor:"pointer"}}>
                <option value="">Select semester…</option>{SEMESTERS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="field-label">Amount (USDC)</label>
              <div style={{position:"relative"}}>
                <input className="dark-input" placeholder="0.00" type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} style={{paddingRight:72}}/>
                <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontWeight:700,color:"#00E5A0",fontSize:13,fontFamily:"'JetBrains Mono',monospace"}}>USDC</span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn-ghost" onClick={()=>setStep(0)}>← Back</button>
            <button className="btn-arc" disabled={!form.student||!form.semester||!form.amount} onClick={()=>setStep(2)}>Continue →</button>
          </div>
        </div>
      )}
      {step===2&&(
        <div className="fade-up">
          <label className="field-label" style={{marginBottom:12}}>Source Chain</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
            {CHAINS.map(c=>(
              <button key={c.id} className={`chain-btn ${form.fromChain===c.id?"selected":""}`} onClick={()=>setForm(f=>({...f,fromChain:c.id}))}>
                <span style={{fontSize:18}}>{c.icon}</span>
                <span style={{fontWeight:600,fontSize:14,color:"#F0EDE8"}}>{c.name}</span>
                {form.fromChain===c.id&&<span style={{marginLeft:"auto",color:"#C8A96E",fontSize:12}}>✓</span>}
              </button>
            ))}
          </div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,overflow:"hidden",marginBottom:16}}>
            <div style={{padding:"10px 16px",background:"rgba(200,169,110,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}><span style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#C8A96E"}}>Transaction Summary</span></div>
            {([["To",school?.name],["Student",form.student],["Semester",form.semester],["Amount",`${form.amount} USDC`],["Bridge",`${CHAINS.find(c=>c.id===form.fromChain)?.name} → Arc`],["Protocol","Circle CCTP"],["Finality","< 1 second"],["Gas Fee","~0.01 USDC"]] as [string,string|undefined][]).map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.03)",fontSize:13}}>
                <span style={{color:"#5A5E6B"}}>{k}</span><span style={{fontWeight:600,color:"#F0EDE8"}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{padding:"11px 14px",background:"rgba(0,229,160,0.04)",border:"1px solid rgba(0,229,160,0.12)",borderRadius:10,marginBottom:20,fontSize:13,color:"#00E5A0"}}>
            🔒 Funds locked in <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,background:"rgba(0,229,160,0.1)",padding:"1px 6px",borderRadius:4}}>BursifiEscrow</code> on Arc until semester release date.
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn-ghost" onClick={()=>setStep(1)}>← Back</button>
            <button className="btn-arc" onClick={handleSend} disabled={loading}>
              {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}><span className="spinner"/> Bridging via Arc CCTP…</span>:"Send Fees via Arc →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardView({payments}: {payments: Payment[]}){
  const total=payments.reduce((a,p)=>a+p.amount,0);
  const confirmed=payments.filter(p=>p.status==="confirmed").reduce((a,p)=>a+p.amount,0);
  const students=new Set(payments.map(p=>p.student)).size;
  const schools=new Set(payments.map(p=>p.school)).size;
  return(
    <div className="fade-up">
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        {[{label:"Total Sent",value:`$${total.toLocaleString()}`,sub:"USDC lifetime",accent:"#C8A96E"},{label:"Confirmed",value:`$${confirmed.toLocaleString()}`,sub:"On-chain settled",accent:"#00E5A0"},{label:"Students",value:String(students),sub:`Across ${schools} schools`,accent:"#8B8FFF"}].map(stat=>(
          <div key={stat.label} className="glass-card" style={{padding:"22px 20px"}}>
            <div className="stat-number" style={{color:stat.accent}}>{stat.value}</div>
            <div style={{fontWeight:700,fontSize:13,color:"#F0EDE8",marginTop:6}}>{stat.label}</div>
            <div style={{fontSize:12,color:"#5A5E6B",marginTop:2}}>{stat.sub}</div>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:700,fontSize:15}}>Active Payments</span>
          <span style={{fontSize:12,color:"#5A5E6B"}}>{payments.length} total</span>
        </div>
        {[...payments].reverse().map(p=>(
          <div key={p.id} style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.03)",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:40,height:40,borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🎓</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:14,color:"#F0EDE8"}}>{p.student}</div>
              <div style={{fontSize:12,color:"#5A5E6B",marginTop:2}}>{p.school} · {p.semester}</div>
              <span className="mono" style={{marginTop:3,display:"block"}}>via {p.chain}</span>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#F0EDE8",letterSpacing:"0.04em"}}>${p.amount}</div>
              <div style={{marginTop:4}}>
                <span className={`badge ${p.status==="confirmed"?"badge-confirmed":p.status==="pending"?"badge-pending":"badge-scheduled"}`}>
                  {p.status==="confirmed"?"✓ Confirmed":p.status==="pending"?"Pending":"Scheduled"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-card">
        <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}><span style={{fontWeight:700,fontSize:14}}>Arc Network Status</span></div>
        <div style={{padding:"16px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{label:"Finality",value:"< 1s"},{label:"Gas Token",value:"USDC"},{label:"CCTP Bridge",value:"Active"},{label:"Escrow Contract",value:"Deployed"}].map(item=>(
            <div key={item.label} style={{padding:"12px 14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:11,color:"#5A5E6B",fontWeight:500}}>{item.label}</div><div style={{fontWeight:700,color:"#F0EDE8",marginTop:2,fontSize:14}}>{item.value}</div></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span className="live-dot"/><span style={{fontSize:10,color:"#00E5A0",fontWeight:700,letterSpacing:"0.08em"}}>LIVE</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HistoryView({payments}: {payments: Payment[]}){
  const shortHash=(hash: string)=>{
    if(!hash||hash==="—")return "—";
    if(hash.length<=12)return hash;
    return `${hash.slice(0,6)}...${hash.slice(-4)}`;
  };
  const handleExportCsv=()=>{
    const headers=["Date","Student","School","Amount","Route","Tx Hash","Status"];
    const rows=[...payments].reverse().map(p=>[p.date,p.student,p.school,p.amount,p.chain,p.txHash,p.status]);
    const escapeCsv=(value: string|number)=>{
      const s=String(value??"");
      if(s.includes('"')||s.includes(",")||s.includes("\n"))return `"${s.replace(/"/g,'""')}"`;
      return s;
    };
    const csv=[headers.map(escapeCsv).join(","),...rows.map(r=>r.map(escapeCsv).join(","))].join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;
    link.download=`Bursifi-history-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return(
    <div className="fade-up">
      <div className="glass-card">
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:700,fontSize:15}}>Transaction History</span>
          <button className="btn-gold" onClick={handleExportCsv}>Export CSV</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="data-table">
            <thead><tr>{["Date","Student","School","Amount","Route","Tx Hash","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {[...payments].reverse().map(p=>(
                <tr key={p.id}>
                  <td style={{color:"#5A5E6B",whiteSpace:"nowrap"}}>{p.date}</td>
                  <td style={{fontWeight:600,color:"#F0EDE8"}}>{p.student}</td>
                  <td style={{color:"#5A5E6B",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.school}</td>
                  <td style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:"#C8A96E",letterSpacing:"0.04em",whiteSpace:"nowrap"}}>${p.amount}</td>
                  <td><span className="mono">{p.chain}</span></td>
                  <td>{p.txHash&&p.txHash!=="—"?(<a href={`https://testnet.arcscan.app/tx/${p.txHash}`} target="_blank" rel="noopener noreferrer" className="mono" style={{color:"#00E5A0",textDecoration:"none"}}>{shortHash(p.txHash)}</a>):(<span className="mono">—</span>)}</td>
                  <td><span className={`badge ${p.status==="confirmed"?"badge-confirmed":p.status==="pending"?"badge-pending":"badge-scheduled"}`}>{p.status==="confirmed"?"✓ Confirmed":p.status==="pending"?"Pending":"Scheduled"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{marginTop:16,padding:"16px 20px",background:"rgba(0,229,160,0.04)",border:"1px solid rgba(0,229,160,0.12)",borderRadius:14}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
          <span style={{fontSize:20,flexShrink:0}}>⚙️</span>
          <div>
            <div style={{fontWeight:700,marginBottom:4,color:"#F0EDE8"}}>Arc SDK Integration</div>
            <div style={{fontSize:13,color:"#5A5E6B",lineHeight:1.7}}>Each payment calls <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,background:"rgba(0,229,160,0.1)",color:"#00E5A0",padding:"1px 6px",borderRadius:4}}>appKit.bridge()</code> to move USDC cross-chain, then invokes <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,background:"rgba(0,229,160,0.1)",color:"#00E5A0",padding:"1px 6px",borderRadius:4}}>BursifiEscrow.deposit()</code> on Arc.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Bursifi(){
  const [view,setView]=useState(0);
  const {data:connectorClient}=useConnectorClient();
  const {address}=useAccount();
  const {connect,connectors}=useConnect();
  const {disconnect}=useDisconnect();
  const [mounted,setMounted]=useState(false);
  const [payments,setPayments]=useState<Payment[]>(INITIAL_PAYMENTS);
  const handlePaymentAdded=(p: Payment)=>setPayments(prev=>[...prev,p]);
  const NAV=["Send Fees","Dashboard","History"];
  const NAV_EXTERNAL=[{label:"For Universities",href:"/university"}];
  useEffect(()=>{setMounted(true);},[]);
  return(
    <>
      <style>{CSS}</style>
      <div className="orb orb-1"/><div className="orb orb-2"/><div className="orb orb-3"/>
      <div style={{minHeight:"100vh",position:"relative",zIndex:1}}>
        <header style={{borderBottom:"1px solid rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",background:"rgba(7,8,10,0.85)",position:"sticky",top:0,zIndex:50}}>
          <div style={{maxWidth:1080,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",height:64}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginRight:40}}>
              <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#C8A96E 0%,#8A6F3E 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🎓</div>
              <div>
                <div style={{fontWeight:800,fontSize:17,letterSpacing:"-0.02em",color:"#F0EDE8"}}>Bursifi</div>
                <div style={{fontSize:10,color:"#00996A",fontWeight:600,letterSpacing:"0.1em"}}>ON ARC NETWORK</div>
              </div>
            </div>
            <nav style={{display:"flex",gap:4,flex:1,alignItems:"center"}}>
  {NAV.map((label,i)=>(
    <button key={label} className={`nav-tab ${view===i?"active":""}`} onClick={()=>setView(i)}>{label}</button>
  ))}
  <div style={{width:1,height:18,background:"rgba(255,255,255,0.1)",margin:"0 6px"}}/>
  <a href="/university" style={{padding:"9px 18px",borderRadius:10,fontSize:13,fontWeight:600,color:"#C8A96E",textDecoration:"none",border:"1px solid rgba(200,169,110,0.25)",transition:"all 0.2s",display:"inline-flex",alignItems:"center",gap:6}}
    onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,169,110,0.08)";e.currentTarget.style.borderColor="rgba(200,169,110,0.5)"}}
    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="rgba(200,169,110,0.25)"}}>
    🏛️ For Universities
  </a>
</nav>
            <div style={{display:"flex",alignItems:"center",gap:20}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}><span className="live-dot"/><span style={{fontSize:12,color:"#5A5E6B",fontWeight:500}}>Arc Testnet</span></div>
              {!mounted?(<button className="btn-gold" style={{padding:"7px 16px"}}>Connect Wallet</button>):address?(
                <button className="btn-gold" style={{padding:"7px 16px"}} onClick={()=>disconnect()}>{address.slice(0,6)}...{address.slice(-4)} ✓</button>
              ):(
                <button className="btn-gold" style={{padding:"7px 16px"}} onClick={()=>connect({connector:connectors[0]})}>Connect Wallet</button>
              )}
            </div>
          </div>
        </header>
        {view===0&&(
          <div style={{borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"48px 24px 40px",background:"linear-gradient(180deg,rgba(200,169,110,0.03) 0%,transparent 100%)"}}>
            <div style={{maxWidth:1080,margin:"0 auto"}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 12px",background:"rgba(0,229,160,0.08)",border:"1px solid rgba(0,229,160,0.2)",borderRadius:100,marginBottom:20}}>
                <span className="live-dot"/><span style={{fontSize:12,color:"#00E5A0",fontWeight:600,letterSpacing:"0.06em"}}>LIVE ON ARC TESTNET</span>
              </div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(36px,5vw,58px)",lineHeight:1.05,letterSpacing:"0.02em",color:"#F0EDE8",maxWidth:640,marginBottom:14}}>
                PAY SCHOOL FEES ACROSS AFRICA.<br/><span style={{color:"#C8A96E"}}>INSTANTLY. ON-CHAIN.</span>
              </div>
              <div style={{fontSize:16,color:"#5A5E6B",maxWidth:480,lineHeight:1.7}}>Send USDC from any blockchain to African universities. Sub-second Arc finality. No banks. No FX losses. Smart escrow.</div>
            </div>
          </div>
        )}
        <main style={{maxWidth:1080,margin:"0 auto",padding:"32px 24px"}}>
          {view===0&&(
            <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:20,alignItems:"start"}}>
              <div className="glass-card">
                <div style={{padding:"18px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontWeight:700,fontSize:15,color:"#F0EDE8"}}>Send School Fees</span>
                  <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(200,169,110,0.4),transparent)"}}/>
                  <span style={{fontSize:12,color:"#C8A96E",fontWeight:600,letterSpacing:"0.06em"}}>ARC NETWORK</span>
                </div>
                <div style={{padding:"28px 24px"}}><SendView onPaymentAdded={handlePaymentAdded} address={address} connectorClient={connectorClient}/></div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[{icon:"⚡",title:"Sub-second Finality",body:"USDC lands in the school's escrow instantly. Not in 3 business days.",col:"rgba(0,229,160,0.1)"},{icon:"🔒",title:"Smart Escrow",body:"Funds locked in an audited Arc contract, released only on semester schedule.",col:"rgba(200,169,110,0.1)"},{icon:"🌉",title:"Any Chain",body:"Send from Ethereum, Base, or Solana. Arc CCTP bridges automatically.",col:"rgba(139,143,255,0.1)"},{icon:"💸",title:"USDC as Gas",body:"No ETH needed. Fees paid in USDC — predictable, stable, simple.",col:"rgba(255,181,71,0.1)"}].map(f=>(
                  <div key={f.title} className="glass-card" style={{padding:"18px 20px"}}>
                    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <div style={{width:36,height:36,borderRadius:8,background:f.col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{f.icon}</div>
                      <div><div style={{fontWeight:700,fontSize:13,color:"#F0EDE8",marginBottom:4}}>{f.title}</div><div style={{fontSize:12,color:"#5A5E6B",lineHeight:1.6}}>{f.body}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {view===1&&(<div><div style={{marginBottom:24}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:"0.04em",color:"#F0EDE8"}}>PAYMENT DASHBOARD</div><div style={{color:"#5A5E6B",fontSize:14,marginTop:4}}>Track all your school fee payments across Africa</div></div><DashboardView payments={payments}/></div>)}
          {view===2&&(<div><div style={{marginBottom:24}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:"0.04em",color:"#F0EDE8"}}>TRANSACTION HISTORY</div><div style={{color:"#5A5E6B",fontSize:14,marginTop:4}}>Full on-chain record of all fee payments</div></div><HistoryView payments={payments}/></div>)}
        </main>
        <footer style={{borderTop:"1px solid rgba(255,255,255,0.06)",marginTop:48}}>
          <div style={{maxWidth:1080,margin:"0 auto",padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:12,color:"#5A5E6B"}}>© 2025 Bursifi · Built on Arc Network</div>
            <div style={{display:"flex",gap:20,alignItems:"center"}}>
              {["Circle CCTP","App Kit","Arc Testnet"].map((t,i)=>[
                <span key={t} style={{fontSize:12,color:"#5A5E6B"}}>{t}</span>,
                i<2&&<span key={i+"d"} style={{width:3,height:3,borderRadius:"50%",background:"#2A2D38",display:"inline-block"}}/>
              ])}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
