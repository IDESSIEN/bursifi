"use client";
import { useState, useRef, useEffect } from "react";

// ── Design tokens (matches main EduCredit app) ────────────────────────────────
const T = {
  bg:      "#060710",
  surface: "#0D0F1A",
  card:    "#111320",
  border:  "rgba(255,255,255,0.09)",
  borderHi:"rgba(255,255,255,0.18)",
  gold:    "#FFD166",
  goldDim: "#C49A3C",
  arc:     "#00FFB2",
  arcDim:  "#00CC8E",
  text:    "#F5F2FF",
  muted:   "#6B70A0",
  subtle:  "#1E2140",
  warn:    "#FFB547",
  error:   "#FF5757",
  purple:  "#B09FFF",
};

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
  .orb-1{width:600px;height:600px;top:-200px;left:-120px;background:radial-gradient(circle,rgba(255,209,102,0.1) 0%,transparent 70%);animation-delay:0s}
  .orb-2{width:500px;height:500px;bottom:-120px;right:-100px;background:radial-gradient(circle,rgba(0,255,178,0.09) 0%,transparent 70%);animation-delay:-6s}
  @keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.95)}}

  .glass-card{background:linear-gradient(145deg,#161928 0%,#111320 100%);border:1px solid rgba(255,255,255,0.09);border-radius:20px;position:relative;overflow:hidden;transition:border-color 0.3s,box-shadow 0.3s}
  .glass-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.04) 0%,transparent 55%);pointer-events:none;border-radius:inherit}

  .dark-input{width:100%;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:12px;font-family:'Outfit',sans-serif;font-size:14px;color:#F5F2FF;outline:none;transition:all 0.2s}
  .dark-input::placeholder{color:#6B70A0}
  .dark-input:focus{border-color:rgba(255,209,102,0.5);background:rgba(255,209,102,0.04);box-shadow:0 0 0 3px rgba(255,209,102,0.08)}
  .dark-input.error{border-color:rgba(255,87,87,0.5);background:rgba(255,87,87,0.04)}
  .dark-input:disabled{opacity:0.45;cursor:not-allowed}

  .dark-select{width:100%;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:12px;font-family:'Outfit',sans-serif;font-size:14px;color:#F5F2FF;outline:none;transition:all 0.2s;appearance:none;cursor:pointer}
  .dark-select:focus{border-color:rgba(255,209,102,0.5);box-shadow:0 0 0 3px rgba(255,209,102,0.08)}

  .btn-primary{background:linear-gradient(135deg,#00FFB2 0%,#00CC8E 100%);color:#060710;border:none;padding:14px 28px;border-radius:12px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:0.02em;position:relative;overflow:hidden;transition:all 0.3s;box-shadow:0 0 30px rgba(0,255,178,0.3)}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 45px rgba(0,255,178,0.45)}
  .btn-primary:disabled{opacity:0.3;cursor:not-allowed;transform:none;box-shadow:none}

  .btn-ghost{background:transparent;color:#6B70A0;border:1px solid rgba(255,255,255,0.09);padding:13px 22px;border-radius:12px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s}
  .btn-ghost:hover{border-color:rgba(255,255,255,0.18);color:#F5F2FF;background:rgba(255,255,255,0.05)}

  .btn-gold{background:transparent;color:#FFD166;border:1px solid rgba(255,209,102,0.35);padding:9px 18px;border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s}
  .btn-gold:hover{background:rgba(255,209,102,0.1);border-color:#FFD166}

  .btn-danger{background:transparent;color:#FF5757;border:1px solid rgba(255,87,87,0.3);padding:8px 16px;border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s}
  .btn-danger:hover{background:rgba(255,87,87,0.1);border-color:#FF5757}

  .tab-pill{padding:9px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;border:none;background:transparent;color:#6B70A0;font-family:'Outfit',sans-serif;transition:all 0.2s;letter-spacing:0.01em;white-space:nowrap}
  .tab-pill:hover{color:#F5F2FF}
  .tab-pill.active{background:rgba(255,255,255,0.07);color:#F5F2FF;border:1px solid rgba(255,255,255,0.12)}

  .sidebar-item{padding:11px 16px;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500;color:#6B70A0;transition:all 0.2s;border:1px solid transparent}
  .sidebar-item:hover{background:rgba(255,255,255,0.04);color:#F5F2FF}
  .sidebar-item.active{background:rgba(255,209,102,0.09);color:#FFD166;border-color:rgba(255,209,102,0.2)}

  .step-node{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;transition:all 0.3s}
  .step-node.done{background:rgba(0,255,178,0.15);border:1px solid rgba(0,255,178,0.4);color:#00FFB2}
  .step-node.active{background:rgba(255,209,102,0.15);border:1px solid rgba(255,209,102,0.5);color:#FFD166;box-shadow:0 0 16px rgba(255,209,102,0.2)}
  .step-node.pending{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#6B70A0}

  .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase}
  .badge-verified{background:rgba(0,255,178,0.12);color:#00FFB2;border:1px solid rgba(0,255,178,0.3)}
  .badge-pending{background:rgba(255,181,71,0.12);color:#FFB547;border:1px solid rgba(255,181,71,0.3)}
  .badge-review{background:rgba(176,159,255,0.12);color:#B09FFF;border:1px solid rgba(176,159,255,0.3)}
  .badge-rejected{background:rgba(255,87,87,0.12);color:#FF5757;border:1px solid rgba(255,87,87,0.3)}

  .warning-box{background:rgba(255,181,71,0.07);border:1px solid rgba(255,181,71,0.25);border-radius:12px;padding:14px 16px}
  .info-box{background:rgba(0,255,178,0.05);border:1px solid rgba(0,255,178,0.18);border-radius:12px;padding:14px 16px}
  .error-box{background:rgba(255,87,87,0.07);border:1px solid rgba(255,87,87,0.25);border-radius:12px;padding:14px 16px}

  .field-label{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6B70A0;margin-bottom:8px;display:block}
  .field-error{font-size:12px;color:#FF5757;margin-top:5px;display:block}
  .field-hint{font-size:12px;color:#6B70A0;margin-top:5px;display:block}

  .mono{font-family:'JetBrains Mono',monospace;font-size:11px;color:#6B70A0;letter-spacing:-0.02em}
  .live-dot{width:7px;height:7px;border-radius:50%;background:#00FFB2;display:inline-block;animation:glowPulse 2s infinite;box-shadow:0 0 8px rgba(0,255,178,0.8)}
  @keyframes glowPulse{0%,100%{opacity:1;box-shadow:0 0 6px rgba(0,255,178,0.6)}50%{opacity:0.7;box-shadow:0 0 18px rgba(0,255,178,1)}}

  .fade-up{animation:fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

  .wallet-confirm-overlay{position:fixed;inset:0;background:rgba(6,7,16,0.85);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeUp 0.2s ease}

  .progress-track{height:4px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden}
  .progress-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#00FFB2,#FFD166);transition:width 0.6s ease}

  .upload-zone{border:2px dashed rgba(255,255,255,0.12);border-radius:14px;padding:32px;text-align:center;cursor:pointer;transition:all 0.2s}
  .upload-zone:hover{border-color:rgba(255,209,102,0.35);background:rgba(255,209,102,0.03)}
  .upload-zone.active{border-color:#00FFB2;background:rgba(0,255,178,0.05)}

  .data-table{width:100%;border-collapse:collapse;font-size:13px}
  .data-table th{padding:11px 16px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6B70A0;border-bottom:1px solid rgba(255,255,255,0.07)}
  .data-table td{padding:13px 16px;border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:middle}
  .data-table tr:hover td{background:rgba(255,255,255,0.02)}
  .data-table tr:last-child td{border-bottom:none}

  @keyframes spin{to{transform:rotate(360deg)}}
  .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.1);border-top-color:#00FFB2;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block}
`;

// ── Static data ───────────────────────────────────────────────────────────────

const COUNTRIES = ["Nigeria","Kenya","South Africa","Ghana","Ethiopia","Uganda","Tanzania","Rwanda","Senegal","Egypt","Morocco","Cameroon","Zimbabwe","Zambia"];

const FACULTIES = ["Arts & Humanities","Business & Management","Education","Engineering & Technology","Law","Medicine & Health Sciences","Natural Sciences","Social Sciences","Agriculture","Architecture","Mass Communication","Pharmacy","Veterinary Medicine"];

const WALLET_APPROVAL_STEPS = [
  { id:"submit", label:"Wallet submitted", desc:"Treasury wallet address entered by admin" },
  { id:"verify", label:"Signature verification", desc:"Admin signs a test message to prove ownership" },
  { id:"review", label:"Manual review", desc:"EduCredit ops team verifies the wallet onchain" },
  { id:"confirm", label:"Dual confirmation", desc:"Second admin confirms the address matches bank records" },
  { id:"live",   label:"Wallet activated", desc:"Wallet is live and accepting escrow releases" },
];

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_UNIS = [
  {
    id:"UNIUYO", name:"University of Uyo", country:"Nigeria", flag:"🇳🇬", city:"Uyo",
    status:"verified", adminName:"Dr. Emem Bassey", adminEmail:"bursary@uniuyo.edu.ng",
    walletStatus:"live", wallet:"0x9690...f33e",
    programs:["Arts & Humanities","Business & Management","Engineering & Technology","Law","Medicine & Health Sciences","Natural Sciences","Education"],
    terms:[
      {label:"1st Semester 2025/2026",start:"2025-10-13",end:"2026-02-28",releaseDate:"2025-10-13"},
      {label:"2nd Semester 2025/2026",start:"2026-03-10",end:"2026-07-31",releaseDate:"2026-03-10"},
    ],
    fees:[
      {faculty:"Arts & Humanities",level:"100 Level",amount:111600,currency:"NGN"},
      {faculty:"Medicine & Health Sciences",level:"All Levels",amount:173000,currency:"NGN"},
      {faculty:"Engineering & Technology",level:"All Levels",amount:145000,currency:"NGN"},
      {faculty:"Business & Management",level:"All Levels",amount:125000,currency:"NGN"},
    ],
    enrollmentCount:312,
    joinedDate:"Jan 14, 2025",
  },
];

// ── Wallet Approval Modal ─────────────────────────────────────────────────────

function WalletApprovalModal({ onClose, onApprove }: { onClose: () => void, onApprove: (wallet: string) => void }) {
  const [walletAddr, setWalletAddr] = useState("");
  const [confirmAddr, setConfirmAddr] = useState("");
  const [step, setStep] = useState(0); // 0=entry, 1=sign, 2=review, 3=confirm, 4=live
  const [signing, setSigning] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [mismatch, setMismatch] = useState(false);

  const isValidAddr = /^0x[0-9a-fA-F]{40}$/.test(walletAddr);
  const addressesMatch = walletAddr && confirmAddr && walletAddr.toLowerCase() === confirmAddr.toLowerCase();

  const simulateSign = () => {
    setSigning(true);
    setTimeout(() => { setSigning(false); setStep(2); }, 2000);
  };

  return (
    <div className="wallet-confirm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass-card fade-up" style={{ width: "100%", maxWidth: 560, margin: 24 }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: T.text }}>Treasury Wallet Setup</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>5-step approval flow. A wrong wallet means funds cannot be recovered.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        {/* Progress */}
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {WALLET_APPROVAL_STEPS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < 4 ? 1 : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className={`step-node ${i < step ? "done" : i === step ? "active" : "pending"}`} style={{ width: 24, height: 24, fontSize: 11 }}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 9, color: i === step ? T.gold : T.muted, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{s.label.split(" ")[0]}</span>
                </div>
                {i < 4 && <div style={{ flex: 1, height: 1, background: i < step ? "rgba(0,255,178,0.3)" : T.border, margin: "0 4px", marginBottom: 16 }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px" }}>

          {/* Step 0: Enter wallet */}
          {step === 0 && (
            <div className="fade-up">
              <div className="warning-box" style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: T.warn, fontWeight: 600, marginBottom: 4 }}>⚠️ Critical: Read before proceeding</div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>
                  This wallet address is where all semester fee escrow releases will be sent. If this address is wrong, funds sent to students' escrows cannot be redirected. Triple-check this is the correct university treasury wallet before continuing.
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="field-label">Treasury Wallet Address</label>
                <input className={`dark-input ${walletAddr && !isValidAddr ? "error" : ""}`}
                  placeholder="0x..." value={walletAddr} onChange={e => setWalletAddr(e.target.value)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }} />
                {walletAddr && !isValidAddr && <span className="field-error">Must be a valid 42-character Ethereum address starting with 0x</span>}
                <span className="field-hint">Paste the exact address from your institution's treasury or bursary department. Arc Network only.</span>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="field-label">Confirm Wallet Address</label>
                <input className={`dark-input ${confirmAddr && !addressesMatch ? "error" : ""}`}
                  placeholder="Re-enter 0x..." value={confirmAddr} onChange={e => setConfirmAddr(e.target.value)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }} />
                {confirmAddr && !addressesMatch && <span className="field-error">Addresses do not match</span>}
                {addressesMatch && <span style={{ fontSize: 12, color: T.arc, marginTop: 5, display: "block" }}>✓ Addresses match</span>}
              </div>
              <button className="btn-primary" style={{ width: "100%" }} disabled={!isValidAddr || !addressesMatch} onClick={() => setStep(1)}>
                Continue to Signature Verification →
              </button>
            </div>
          )}

          {/* Step 1: Sign to prove ownership */}
          {step === 1 && (
            <div className="fade-up">
              <div className="info-box" style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: T.arc, fontWeight: 600, marginBottom: 4 }}>Wallet ownership verification</div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>
                  To confirm you control this wallet, we'll ask you to sign a short message. This is a gasless action, it costs nothing and does not send any funds.
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Message to sign</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: T.arc, lineHeight: 1.7 }}>
                  "I confirm that {walletAddr.slice(0, 10)}...{walletAddr.slice(-6)} is the official treasury wallet of my institution and authorise its use on EduCredit. Timestamp: {new Date().toISOString()}"
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={simulateSign} disabled={signing}>
                  {signing ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span className="spinner" /> Waiting for signature…</span> : "Sign with Wallet →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Manual review */}
          {step === 2 && (
            <div className="fade-up" style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(176,159,255,0.12)", border: "1px solid rgba(176,159,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>🔍</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: T.text, marginBottom: 8 }}>Signature verified</div>
              <div style={{ fontSize: 14, color: T.muted, marginBottom: 24, lineHeight: 1.7 }}>
                The EduCredit operations team will now verify this wallet address matches your institution's on-chain and banking records. This typically takes 1 to 2 business days.
              </div>
              <div className="warning-box" style={{ textAlign: "left", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: T.warn, lineHeight: 1.7 }}>
                  Do not change or resubmit the wallet address while review is in progress. If there's an error, contact support@educredit.app immediately.
                </div>
              </div>
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => setStep(3)}>
                Simulate: Review Complete →
              </button>
            </div>
          )}

          {/* Step 3: Dual confirmation */}
          {step === 3 && (
            <div className="fade-up">
              <div className="info-box" style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: T.arc, fontWeight: 600, marginBottom: 4 }}>Final confirmation required</div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>
                  A second authorised administrator must confirm this wallet address. This prevents a single compromised account from changing fund destinations.
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="field-label">Second admin name</label>
                <input className="dark-input" placeholder="Full name of second authorising officer" value={confirmName} onChange={e => setConfirmName(e.target.value)} />
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Wallet to be activated</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: T.arc }}>{walletAddr}</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-primary" style={{ flex: 1 }} disabled={!confirmName} onClick={() => { setStep(4); setTimeout(() => { onApprove(walletAddr); onClose(); }, 1500); }}>
                  Confirm & Activate Wallet →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Fee Schedule Editor ───────────────────────────────────────────────────────

interface FeeRow { faculty: string; level: string; amount: string; currency: string; }
function FeeScheduleEditor({ fees, setFees }: { fees: FeeRow[], setFees: (f: FeeRow[] | ((prev: FeeRow[]) => FeeRow[])) => void }) {
  const addRow = () => setFees(f => [...f, { faculty: "", level: "All Levels", amount: "", currency: "USD" }]);
  const updateRow = (i: number, key: string, val: string) => setFees(f => f.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
const removeRow = (i: number) => setFees(f => f.filter((_, idx) => idx !== i));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <label className="field-label" style={{ marginBottom: 2 }}>Fee Schedule</label>
          <span className="field-hint" style={{ marginTop: 0 }}>Use official bursar fee schedule. These amounts are shown to payers.</span>
        </div>
        <button className="btn-gold" onClick={addRow}>+ Add Row</button>
      </div>

      {fees.length === 0 ? (
        <div style={{ textAlign: "center", padding: "28px", background: "rgba(255,255,255,0.02)", border: `1px dashed ${T.border}`, borderRadius: 12, color: T.muted, fontSize: 14 }}>
          No fee rows yet. Click "+ Add Row" to begin.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 80px 36px", gap: 8 }}>
            {["Faculty / Program", "Student Level", "Amount", "Currency", ""].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>{h}</div>
            ))}
          </div>
          {fees.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 80px 36px", gap: 8, alignItems: "center" }}>
              <select className="dark-select" value={row.faculty} onChange={e => updateRow(i, "faculty", e.target.value)}>
                <option value="">Select…</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <select className="dark-select" value={row.level} onChange={e => updateRow(i, "level", e.target.value)}>
                {["100 Level", "200 Level", "300 Level", "400 Level", "500 Level", "Postgraduate", "All Levels"].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <input className="dark-input" type="number" placeholder="0.00" value={row.amount} onChange={e => updateRow(i, "amount", e.target.value)} />
              <select className="dark-select" value={row.currency} onChange={e => updateRow(i, "currency", e.target.value)}>
                {["USD", "NGN", "KES", "GHS", "ZAR", "ETB", "UGX"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className="btn-danger" style={{ padding: "8px", width: 36, height: 44 }} onClick={() => removeRow(i)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Academic Calendar Editor ──────────────────────────────────────────────────

interface Term { label: string; start: string; end: string; releaseDate: string; }
function TermEditor({ terms, setTerms }: { terms: Term[], setTerms: (t: Term[] | ((prev: Term[]) => Term[])) => void }) {
  const addTerm = () => setTerms(t => [...t, { label: "", start: "", end: "", releaseDate: "" }]);
  const updateTerm = (i: number, key: string, val: string) => setTerms(t => t.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const removeTerm = (i: number) => setTerms(t => t.filter((_, idx) => idx !== i));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <label className="field-label" style={{ marginBottom: 2 }}>Academic Terms</label>
          <span className="field-hint" style={{ marginTop: 0 }}>Release date is when escrow unlocks. Set it to the first day of each semester.</span>
        </div>
        <button className="btn-gold" onClick={addTerm}>+ Add Term</button>
      </div>

      {terms.length === 0 ? (
        <div style={{ textAlign: "center", padding: 28, background: "rgba(255,255,255,0.02)", border: `1px dashed ${T.border}`, borderRadius: 12, color: T.muted, fontSize: 14 }}>
          No terms yet. Click "+ Add Term" to begin.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {terms.map((term, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <input className="dark-input" placeholder="e.g. 1st Semester 2025/2026" value={term.label} onChange={e => updateTerm(i, "label", e.target.value)} style={{ flex: 1, marginRight: 10 }} />
                <button className="btn-danger" style={{ padding: "8px 12px", flexShrink: 0 }} onClick={() => removeTerm(i)}>Remove</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[["start", "Semester Start"], ["end", "Semester End"], ["releaseDate", "Escrow Release Date"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="field-label">{label}</label>
                    <input className="dark-input" type="date" value={term[key]} onChange={e => updateTerm(i, key, e.target.value)} style={{ colorScheme: "dark" }} />
                    {key === "releaseDate" && <span className="field-hint">Funds release automatically on this date</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Enrollment Uploader ───────────────────────────────────────────────────────

function EnrollmentUploader() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(null);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const rows = e.target.result.split("\n").filter(Boolean).slice(1);
      setUploaded({ name: file.name, count: rows.length, rows: rows.slice(0, 5) });
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <label className="field-label">Enrollment Data Import</label>
      <div className="field-hint" style={{ marginBottom: 12 }}>
        Upload a CSV with columns: matric_number, full_name, faculty, program, level, semester, email. This is used to verify student identities when they claim escrow payments.
      </div>

      {!uploaded ? (
        <div className={`upload-zone ${dragging ? "active" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
          <div style={{ fontSize: 28, marginBottom: 10 }}>📋</div>
          <div style={{ fontWeight: 600, fontSize: 14, color: T.text, marginBottom: 4 }}>Drop your enrollment CSV here</div>
          <div style={{ fontSize: 13, color: T.muted }}>Or click to browse. Max 10MB. CSV format only.</div>
        </div>
      ) : (
        <div className="fade-up">
          <div className="info-box" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, color: T.arc, fontSize: 14 }}>{uploaded.name}</div>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>{uploaded.count} student records detected</div>
              </div>
              <button className="btn-ghost" style={{ padding: "7px 14px", fontSize: 13 }} onClick={() => setUploaded(null)}>Replace</button>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>
              Preview (first 5 rows)
            </div>
            <table className="data-table">
              <thead><tr>{["Matric No.", "Name", "Faculty", "Level", "Semester"].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {uploaded.rows.map((row, i) => {
                  const cols = row.split(",");
                  return (
                    <tr key={i}>
                      <td className="mono">{cols[0] || "—"}</td>
                      <td style={{ fontWeight: 600, color: T.text }}>{cols[1] || "—"}</td>
                      <td style={{ color: T.muted }}>{cols[2] || "—"}</td>
                      <td style={{ color: T.muted }}>{cols[4] || "—"}</td>
                      <td style={{ color: T.muted }}>{cols[5] || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Registration Form (multi-step) ────────────────────────────────────────────

function RegistrationForm({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", country:"", city:"", website:"", accreditationBody:"", adminName:"", adminTitle:"", adminEmail:"", adminPhone:"" });
  const [faculties, setFaculties] = useState([]);
  const [fees, setFees] = useState([]);
  const [terms, setTerms] = useState([]);
  const [showWallet, setShowWallet] = useState(false);
  const [walletApproved, setWalletApproved] = useState(false);
  const [walletAddr, setWalletAddr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const STEPS = [
    { label: "Institution", icon: "🏛️" },
    { label: "Admin", icon: "👤" },
    { label: "Wallet", icon: "🔐" },
    { label: "Fees", icon: "💰" },
    { label: "Calendar", icon: "📅" },
    { label: "Students", icon: "🎓" },
    { label: "Review", icon: "✅" },
  ];

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onComplete({ ...form, fees, terms, walletAddr, faculties, status: "review" });
    }, 2000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "start" }}>

      {showWallet && <WalletApprovalModal onClose={() => setShowWallet(false)} onApprove={(addr) => { setWalletAddr(addr); setWalletApproved(true); setShowWallet(false); }} />}

      {/* Sidebar steps */}
      <div className="glass-card" style={{ padding: "20px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 14, paddingLeft: 6 }}>Setup Steps</div>
        {STEPS.map((s, i) => (
          <div key={s.label} className={`sidebar-item ${step === i ? "active" : ""}`} onClick={() => setStep(i)}>
            <span>{s.icon}</span>
            <span>{s.label}</span>
            {i < step && <span style={{ marginLeft: "auto", color: T.arc, fontSize: 12 }}>✓</span>}
          </div>
        ))}
        <div style={{ margin: "16px 0", height: 1, background: T.border }} />
        <div style={{ paddingLeft: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 10 }}>Progress</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.round((step / (STEPS.length - 1)) * 100)}%` }} />
          </div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>{Math.round((step / (STEPS.length - 1)) * 100)}% complete</div>
        </div>
      </div>

      {/* Form content */}
      <div className="glass-card">
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,209,102,0.1)", border: "1px solid rgba(255,209,102,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            {STEPS[step].icon}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: T.text }}>Step {step + 1}: {STEPS[step].label}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>
              {["Basic institution details","Primary admin & bursary contact","Treasury wallet with 5-step approval","Verified fee schedule by faculty","Academic terms and escrow release dates","Student enrollment data source","Review and submit for verification"][step]}
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 24px" }}>

          {/* Step 0: Institution */}
          {step === 0 && (
            <div className="fade-up">
              <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
                <div>
                  <label className="field-label">Official Institution Name</label>
                  <input className="dark-input" placeholder="e.g. University of Uyo" value={form.name} onChange={e => set("name", e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label className="field-label">Country</label>
                    <select className="dark-select" value={form.country} onChange={e => set("country", e.target.value)}>
                      <option value="">Select country…</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">City</label>
                    <input className="dark-input" placeholder="e.g. Uyo" value={form.city} onChange={e => set("city", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="field-label">Official Website</label>
                  <input className="dark-input" placeholder="https://www.uniuyo.edu.ng" value={form.website} onChange={e => set("website", e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Accreditation Body</label>
                  <input className="dark-input" placeholder="e.g. National Universities Commission (NUC)" value={form.accreditationBody} onChange={e => set("accreditationBody", e.target.value)} />
                  <span className="field-hint">Used to verify institutional legitimacy before activation.</span>
                </div>
                <div>
                  <label className="field-label">Faculties / Programs Offered</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {FACULTIES.map(f => (
                      <button key={f} onClick={() => setFaculties(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}
                        style={{ padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${faculties.includes(f) ? "rgba(0,255,178,0.4)" : T.border}`, background: faculties.includes(f) ? "rgba(0,255,178,0.1)" : "transparent", color: faculties.includes(f) ? T.arc : T.muted, fontFamily: "'Outfit',sans-serif" }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button className="btn-primary" disabled={!form.name || !form.country || !form.city} onClick={() => setStep(1)}>
                Continue →
              </button>
            </div>
          )}

          {/* Step 1: Admin */}
          {step === 1 && (
            <div className="fade-up">
              <div className="info-box" style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: T.arc, fontWeight: 600, marginBottom: 4 }}>Who is this?</div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>
                  This should be the head of bursary or a senior finance officer with authority to manage fee collection and treasury operations. They will be the primary contact for escrow releases and reconciliation.
                </div>
              </div>
              <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
                {[["adminName","Full Name","e.g. Dr. Emem Bassey"],["adminTitle","Job Title","e.g. Bursar / Head of Finance"],["adminEmail","Official Email","e.g. bursary@uniuyo.edu.ng"],["adminPhone","Phone Number","e.g. +234 801 234 5678"]].map(([key, label, ph]) => (
                  <div key={key}>
                    <label className="field-label">{label}</label>
                    <input className="dark-input" placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="btn-primary" style={{ flex: 1 }} disabled={!form.adminName || !form.adminEmail} onClick={() => setStep(2)}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 2: Wallet */}
          {step === 2 && (
            <div className="fade-up">
              <div className="warning-box" style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: T.warn, fontWeight: 600, marginBottom: 6 }}>⚠️ Why wallet setup is a 5-step process</div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8 }}>
                  All semester escrow releases flow to this wallet. If the address is incorrect, funds sent by diaspora families cannot be recovered. EduCredit requires address confirmation, signature verification, manual review by our ops team, and a second admin sign-off before any wallet is activated.
                </div>
              </div>
              {walletApproved ? (
                <div className="info-box" style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 24 }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 700, color: T.arc, fontSize: 14 }}>Treasury wallet approved</div>
                      <div className="mono" style={{ marginTop: 4, color: T.arc }}>{walletAddr}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <button className="btn-primary" style={{ width: "100%", marginBottom: 12 }} onClick={() => setShowWallet(true)}>
                  🔐 Begin 5-Step Wallet Approval →
                </button>
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" style={{ flex: 1 }} disabled={!walletApproved} onClick={() => setStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3: Fees */}
          {step === 3 && (
            <div className="fade-up">
              <div style={{ marginBottom: 24 }}>
                <FeeScheduleEditor fees={fees} setFees={setFees} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-primary" style={{ flex: 1 }} disabled={fees.length === 0} onClick={() => setStep(4)}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 4: Calendar */}
          {step === 4 && (
            <div className="fade-up">
              <div style={{ marginBottom: 24 }}>
                <TermEditor terms={terms} setTerms={setTerms} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setStep(3)}>← Back</button>
                <button className="btn-primary" style={{ flex: 1 }} disabled={terms.length === 0} onClick={() => setStep(5)}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 5: Enrollment */}
          {step === 5 && (
            <div className="fade-up">
              <div style={{ marginBottom: 24 }}>
                <EnrollmentUploader />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setStep(4)}>← Back</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => setStep(6)}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="fade-up">
              <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Institution", items: [["Name", form.name], ["Country", form.country], ["City", form.city], ["Website", form.website || "—"], ["Accreditation", form.accreditationBody || "—"]] },
                  { label: "Primary Admin", items: [["Name", form.adminName], ["Title", form.adminTitle || "—"], ["Email", form.adminEmail], ["Phone", form.adminPhone || "—"]] },
                  { label: "Treasury Wallet", items: [["Address", walletAddr || "—"], ["Status", walletApproved ? "Approved ✓" : "Not set"]] },
                  { label: "Fee Schedule", items: [[`${fees.length} rows configured`, fees.length > 0 ? fees.map(f => f.faculty).join(", ") : "None"]] },
                  { label: "Academic Terms", items: [[`${terms.length} terms configured`, terms.map(t => t.label).join(", ") || "None"]] },
                ].map(section => (
                  <div key={section.label} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ padding: "10px 16px", borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.gold }}>
                      {section.label}
                    </div>
                    {section.items.map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 16px", borderBottom: `1px solid rgba(255,255,255,0.03)`, fontSize: 13 }}>
                        <span style={{ color: T.muted }}>{k}</span>
                        <span style={{ fontWeight: 600, color: T.text, textAlign: "right", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="warning-box" style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: T.warn, lineHeight: 1.7 }}>
                  Submitting this application sends it to the EduCredit ops team for manual verification. Your institution will not be visible to payers until verification is complete, typically 2 to 3 business days.
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setStep(5)}>← Back</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span className="spinner" />Submitting…</span> : "Submit for Verification →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── University Detail Panel ───────────────────────────────────────────────────

function UniDetailPanel({ uni, onBack }) {
  const [activeTab, setActiveTab] = useState(0);
  const TABS = ["Overview", "Fee Schedule", "Academic Terms", "Enrollment", "Escrow Activity"];

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button className="btn-ghost" style={{ padding: "9px 14px" }} onClick={onBack}>← Back</button>
        <div style={{ fontSize: 28 }}>{uni.flag}</div>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: "0.04em", color: T.text }}>{uni.name}</div>
          <div style={{ fontSize: 13, color: T.muted }}>{uni.city}, {uni.country} · Joined {uni.joinedDate}</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span className={`badge ${uni.status === "verified" ? "badge-verified" : "badge-pending"}`}>
            {uni.status === "verified" ? "✓ Verified" : "Under Review"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, background: "rgba(255,255,255,0.03)", padding: 6, borderRadius: 12, width: "fit-content" }}>
        {TABS.map((t, i) => <button key={t} className={`tab-pill ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>{t}</button>)}
      </div>

      {/* Overview */}
      {activeTab === 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {[
            { label: "Enrolled Students", value: uni.enrollmentCount, sub: "Verified records", accent: T.arc },
            { label: "Active Escrows", value: "12", sub: "Across 2 terms", accent: T.gold },
            { label: "Fees Released", value: "$48,200", sub: "This academic year", accent: T.purple },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: "20px" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: s.accent }}>{s.value}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: T.text, marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
          <div className="glass-card" style={{ padding: "20px", gridColumn: "1/-1" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[["Admin Contact", uni.adminEmail], ["Treasury Wallet", uni.wallet], ["Wallet Status", uni.walletStatus]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted, marginBottom: 6 }}>{k}</div>
                  <div style={{ fontSize: 14, color: k === "Treasury Wallet" ? T.arc : T.text, fontFamily: k === "Treasury Wallet" ? "'JetBrains Mono',monospace" : "inherit", fontWeight: 600 }}>
                    {v === "live" ? <span className="badge badge-verified">✓ Live</span> : v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fee Schedule */}
      {activeTab === 1 && (
        <div className="glass-card">
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Fee Schedule</span>
            <button className="btn-gold">Edit Schedule</button>
          </div>
          <table className="data-table">
            <thead><tr>{["Faculty", "Level", "Amount", "Currency", "Last Updated"].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {uni.fees.map((f, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: T.text }}>{f.faculty}</td>
                  <td style={{ color: T.muted }}>{f.level}</td>
                  <td style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: T.gold, letterSpacing: "0.04em" }}>{f.amount.toLocaleString()}</td>
                  <td><span className="badge badge-pending">{f.currency}</span></td>
                  <td style={{ color: T.muted }}>Jan 14, 2025</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Academic Terms */}
      {activeTab === 2 && (
        <div style={{ display: "grid", gap: 14 }}>
          {uni.terms.map((t, i) => (
            <div key={i} className="glass-card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 6 }}>{t.label}</div>
                  <div style={{ display: "flex", gap: 24 }}>
                    {[["Start", t.start], ["End", t.end]].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{k}</div>
                        <div style={{ fontSize: 14, color: T.text, marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Escrow Release</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: T.arc }}>{t.releaseDate}</div>
                  <span className="badge badge-verified" style={{ marginTop: 6 }}>Auto-release configured</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enrollment */}
      {activeTab === 3 && (
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: T.text }}>Enrollment Records</div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>{uni.enrollmentCount} verified students across all faculties</div>
            </div>
            <button className="btn-gold">Re-upload CSV</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {uni.programs.map(p => (
              <div key={p} style={{ padding: "14px", background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 4 }}>{p}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{Math.floor(Math.random() * 60 + 20)} students</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Escrow Activity */}
      {activeTab === 4 && (
        <div className="glass-card">
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Escrow Activity Log</span>
          </div>
          <table className="data-table">
            <thead><tr>{["Date","Student","Matric No.","Amount","Status","Tx Hash"].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                { date:"May 14, 2026", student:"Chukwuemeka Eze", matric:"UY/2022/0034", amount:"$620", status:"confirmed", tx:"0x9690...f33e" },
                { date:"May 13, 2026", student:"Blessing Okon", matric:"UY/2023/0118", amount:"$620", status:"confirmed", tx:"0x8821...a11b" },
                { date:"May 12, 2026", student:"Uduak Etim", matric:"UY/2021/0277", amount:"$800", status:"pending", tx:"0x7712...cc2d" },
                { date:"Jun 1, 2026",  student:"Ima Effiong", matric:"UY/2024/0045", amount:"$620", status:"scheduled", tx:"—" },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ color: T.muted, whiteSpace: "nowrap" }}>{r.date}</td>
                  <td style={{ fontWeight: 600, color: T.text }}>{r.student}</td>
                  <td className="mono">{r.matric}</td>
                  <td style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: T.gold, letterSpacing: "0.04em" }}>{r.amount}</td>
                  <td><span className={`badge ${r.status === "confirmed" ? "badge-verified" : r.status === "pending" ? "badge-pending" : "badge-review"}`}>{r.status}</span></td>
                  <td className="mono">{r.tx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main University Portal ────────────────────────────────────────────────────

export default function UniversityPortal() {
  const [view, setView] = useState("list"); // list | register | detail
  const [unis, setUnis] = useState(SEED_UNIS);
  const [selectedUni, setSelectedUni] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = unis.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegistrationComplete = (data) => {
    const newUni = {
      id: data.name.replace(/\s+/g, "").toUpperCase().slice(0, 8),
      name: data.name, country: data.country, flag: "🏛️", city: data.city,
      status: "review", adminName: data.adminName, adminEmail: data.adminEmail,
      walletStatus: "pending", wallet: data.walletAddr || "Pending approval",
      programs: data.faculties, terms: data.terms, fees: data.fees,
      enrollmentCount: 0, joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setUnis(prev => [...prev, newUni]);
    setView("list");
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="orb orb-1" /><div className="orb orb-2" />

      <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <header style={{ borderBottom: `1px solid ${T.border}`, backdropFilter: "blur(20px)", background: "rgba(6,7,16,0.85)", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 64, gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldDim} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎓</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em", color: T.text }}>EduCredit</div>
                <div style={{ fontSize: 10, color: T.arcDim, fontWeight: 600, letterSpacing: "0.1em" }}>UNIVERSITY PORTAL</div>
              </div>
            </div>
            <div style={{ width: 1, height: 28, background: T.border }} />
            <div style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>Institution Onboarding & Management</div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span className="live-dot" /><span style={{ fontSize: 12, color: T.muted }}>Arc Testnet</span>
              </div>
              {view !== "register" && (
                <button className="btn-primary" style={{ padding: "9px 20px", fontSize: 13, width: "auto" }} onClick={() => setView("register")}>
                  + Register University
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

          {view === "register" && (
            <div>
              <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                <button className="btn-ghost" onClick={() => setView("list")}>← Back to Directory</button>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.04em", color: T.text }}>REGISTER YOUR INSTITUTION</div>
                  <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>Complete all 7 steps to go live on EduCredit</div>
                </div>
              </div>
              <RegistrationForm onComplete={handleRegistrationComplete} />
            </div>
          )}

          {view === "detail" && selectedUni && (
            <UniDetailPanel uni={selectedUni} onBack={() => setView("list")} />
          )}

          {view === "list" && (
            <div>
              {/* Stats strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
                {[
                  { label: "Partner Universities", value: unis.length, accent: T.arc },
                  { label: "Verified", value: unis.filter(u => u.status === "verified").length, accent: T.gold },
                  { label: "Under Review", value: unis.filter(u => u.status === "review").length, accent: T.purple },
                  { label: "Total Students", value: unis.reduce((a, u) => a + u.enrollmentCount, 0).toLocaleString(), accent: T.warn },
                ].map(s => (
                  <div key={s.label} className="glass-card" style={{ padding: "18px 20px" }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: s.accent }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Search + table */}
              <div className="glass-card">
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 12, alignItems: "center" }}>
                  <input className="dark-input" placeholder="Search universities, countries…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, maxWidth: 340 }} />
                  <span style={{ fontSize: 13, color: T.muted }}>{filtered.length} institutions</span>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>{["Institution","Country","Admin Contact","Wallet","Status","Students","Action"].map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u.id} style={{ cursor: "pointer" }} onClick={() => { setSelectedUni(u); setView("detail"); }}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 20 }}>{u.flag}</span>
                            <div>
                              <div style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>{u.name}</div>
                              <div style={{ fontSize: 12, color: T.muted }}>{u.city}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: T.muted }}>{u.country}</td>
                        <td>
                          <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{u.adminName}</div>
                          <div className="mono">{u.adminEmail}</div>
                        </td>
                        <td>
                          <span className={`badge ${u.walletStatus === "live" ? "badge-verified" : u.walletStatus === "review" ? "badge-review" : "badge-pending"}`}>
                            {u.walletStatus === "live" ? "✓ Live" : u.walletStatus === "review" ? "In Review" : "Pending"}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.status === "verified" ? "badge-verified" : u.status === "review" ? "badge-review" : "badge-pending"}`}>
                            {u.status === "verified" ? "✓ Verified" : u.status === "review" ? "Under Review" : "Pending"}
                          </span>
                        </td>
                        <td style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: T.arc, letterSpacing: "0.04em" }}>{u.enrollmentCount}</td>
                        <td onClick={e => e.stopPropagation()}>
                          <button className="btn-gold" onClick={() => { setSelectedUni(u); setView("detail"); }}>View →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
