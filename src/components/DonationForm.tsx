import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { Heart, Gift, Mail, Smile, HelpCircle, AlertCircle, Sparkles, Compass, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DonationFormProps {
  preselectedProjectId?: string;
  onSuccessRedirect?: () => void;
}

const SignatureDivider = () => (
  <div className="flex items-center justify-center space-x-4 py-4">
    <div className="h-[1px] bg-[#C5A059]/30 w-16" />
    <div className="w-2 h-2 rotate-45 bg-[#C5A059] border border-[#1B3022]/40" />
    <div className="h-[1px] bg-[#C5A059]/30 w-16" />
  </div>
);

const QRCodeSimpleVisual = ({ amount }: { amount: number }) => (
  <div className="bg-white p-5 rounded-xl border border-[#C5A059]/40 shadow-sm inline-flex flex-col items-center space-y-3 max-w-[220px] mx-auto text-center">
    <div className="bg-[#007A5A] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-sans">
      Simple • Pago Móvil
    </div>
    {/* Stylized geometric representation of a complex, legal QR node canvas */}
    <div className="p-1 px-2.5 border border-[#007A5A]/35 rounded-[6px]">
      <svg className="w-32 h-32 text-[#1B3022] select-none" viewBox="0 0 100 100" fill="currentColor">
        {/* Outer Top-Left Target */}
        <path d="M5,5 h22 v6 h-16 v16 h-6 z" />
        <rect x="11" y="11" width="10" height="10" />
        <rect x="14" y="14" width="4" height="4" fill="white" />
        
        {/* Outer Top-Right Target */}
        <path d="M73,5 h22 v22 h-6 v-16 h-16 z" />
        <rect x="79" y="11" width="10" height="10" />
        <rect x="82" y="14" width="4" height="4" fill="white" />
        
        {/* Outer Bottom-Left Target */}
        <path d="M5,73 h6 v16 h16 v6 h-22 z" />
        <rect x="11" y="79" width="10" height="10" />
        <rect x="14" y="82" width="4" height="4" fill="white" />

        {/* Dynamic decorative QR pixels and grids representing safe payment tokens */}
        <rect x="35" y="10" width="6" height="6" />
        <rect x="45" y="14" width="8" height="4" />
        <rect x="58" y="8" width="4" height="10" />
        <rect x="38" y="22" width="12" height="4" />
        <rect x="52" y="20" width="6" height="8" />
        
        <rect x="8" y="38" width="6" height="12" />
        <rect x="20" y="44" width="14" height="4" />
        <rect x="80" y="38" width="12" height="6" />
        <rect x="84" y="48" width="6" height="14" />
        
        <rect x="38" y="78" width="14" height="6" />
        <rect x="56" y="84" width="10" height="4" />
        <rect x="80" y="80" width="12" height="12" />
        <rect x="83" y="83" width="6" height="6" fill="white" />
        <rect x="85" y="85" width="2" height="2" />

        <rect x="38" y="38" width="24" height="24" fill="#007A5A" rx="4" />
        <rect x="41" y="41" width="18" height="18" fill="white" rx="2" />
        <text x="46" y="55" fontSize="14" fontWeight="900" fill="#007A5A" fontFamily="sans-serif">QS</text>
      </svg>
    </div>
    <div className="space-y-1">
      <div className="text-[10px] font-black text-[#1B3022] uppercase tracking-wider">
        VOSERDEM BOLIVIA
      </div>
      <div className="text-[9px] bg-[#C5A059]/20 text-[#1B3022] font-black px-2 py-0.5 rounded uppercase tracking-wider inline-block">
        Monto: Bs. {amount.toLocaleString()} BOB
      </div>
    </div>
  </div>
);

const BancoBisaCard = ({ amount }: { amount: number }) => (
  <div className="bg-[#FCF9F8] p-5 rounded-xl border border-[#C5A059]/40 shadow-sm text-left text-[#1B3022] space-y-4 max-w-sm sm:max-w-md mx-auto">
    <div className="flex justify-between items-center border-b border-[#C5A059]/20 pb-2.5">
      <span className="text-[9px] uppercase font-black text-[#C5A059] tracking-widest">Coordenadas de Transferencia USD</span>
      <span className="bg-[#1B3022] text-[#F5F2ED] text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-[2px] border border-[#C5A059]/20">
        BANCO BISA
      </span>
    </div>
    <div className="space-y-2.5 text-xs font-sans text-[#2C2C2C]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <span className="text-[8.5px] uppercase font-bold tracking-wider text-[#C5A059] block">Entidad Recutora</span>
          <span className="font-bold text-[#1B3022] text-xs">Banco BISA S.A.</span>
        </div>
        <div>
          <span className="text-[8.5px] uppercase font-bold tracking-wider text-[#C5A059] block">Tipo de Cuenta</span>
          <span className="font-semibold text-[#1B3022] text-[11px]">Cuenta Corriente ($)</span>
        </div>
      </div>
      <div>
        <span className="text-[8.5px] uppercase font-bold tracking-wider text-[#C5A059] block">Número de Cuenta Corriente</span>
        <span className="font-mono font-black text-sm sm:text-base text-[#1B3022] block bg-[#1B3022]/5 p-1.5 rounded select-all border border-[#C5A059]/10">
          104523-402-3
        </span>
      </div>
      <div>
        <span className="text-[8.5px] uppercase font-bold tracking-wider text-[#C5A059] block">Nombre del Titular</span>
        <span className="font-semibold text-[#1B3022] text-xs">Voluntarios al Servicio de los Demás (VOSERDEM)</span>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C5A059]/15 mt-1">
        <div>
          <span className="text-[8px] uppercase font-bold text-[#2C2C2C]/75 block">NIT del Titular</span>
          <span className="font-mono text-xs font-bold text-[#1B3022]">1028374029</span>
        </div>
        <div>
          <span className="text-[8px] uppercase font-bold text-[#2C2C2C]/75 block">Swift internacional</span>
          <span className="font-mono text-xs font-bold text-[#1B3022]">BISABO2B</span>
        </div>
      </div>
    </div>
    <div className="bg-[#1B3022]/5 p-2 px-3 rounded border border-[#C5A059]/20 text-[9px] text-center italic text-[#1B3022] font-semibold">
      Transferencia certificada de $ {amount.toLocaleString()} USD
    </div>
  </div>
);

export default function DonationForm({ preselectedProjectId, onSuccessRedirect }: DonationFormProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  const [currency, setCurrency] = useState<'USD' | 'BOB'>('USD');
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  const [registeredAmount, setRegisteredAmount] = useState<number>(25);
  const [registeredCurrency, setRegisteredCurrency] = useState<'USD' | 'BOB'>('USD');
  
  const [comment, setComment] = useState<string>('');
  
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submited, setSubmited] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presetAmounts = currency === 'USD' ? [10, 25, 50, 100, 250] : [50, 100, 250, 500, 1000];

  useEffect(() => {
    // Fetch projects for the dropdown select list
    const fetchProj = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
          
          // Determine starting selection
          if (preselectedProjectId) {
            setProjectId(preselectedProjectId);
          } else if (data.length > 0) {
            setProjectId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching project options:', err);
      }
    };
    fetchProj();
  }, [preselectedProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const finalAmountRaw = customAmount ? parseFloat(customAmount) : amount;
    
    // Convert to equivalent USD amount if campaign was committed in Bolivianos
    const finalAmountUSD = currency === 'BOB'
      ? Math.round((finalAmountRaw / 6.96) * 100) / 100
      : finalAmountRaw;

    if (!donorName.trim() || !email.trim()) {
      setErrorMsg('Por favor introduce tu nombre y correo electrónico.');
      setSubmitting(false);
      return;
    }

    if (!projectId) {
      setErrorMsg('Por favor selecciona un proyecto de destino.');
      setSubmitting(false);
      return;
    }

    if (isNaN(finalAmountRaw) || finalAmountRaw <= 0) {
      setErrorMsg('Por favor introduce un monto de donación válido.');
      setSubmitting(false);
      return;
    }

    const finalComment = comment 
      ? `${comment} [Donado en: ${finalAmountRaw} ${currency}]`
      : `[Donado en: ${finalAmountRaw} ${currency}]`;

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName,
          email,
          amount: finalAmountUSD,
          projectId,
          comment: finalComment
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'No se pudo realizar la donación.');
      }

      setRegisteredAmount(finalAmountRaw);
      setRegisteredCurrency(currency);
      setSubmited(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falló la conexión con el servidor. Por favor intenta más tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedProjectTitle = () => {
    const proj = projects.find(p => p.id === projectId);
    return proj ? proj.title : 'VOSERDEM Bolivia';
  };

  return (
    <div className="py-16 bg-[#F5F2ED] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center space-y-3 mb-10">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block">Cambia una vida hoy</span>
          <h2 className="font-display text-3xl sm:text-4.5xl font-black text-[#1B3022] tracking-tight">
            Tu Apoyo Semilla Multiplica Impacto
          </h2>
          <SignatureDivider />
          <p className="text-xs text-[#2C2C2C] max-w-xl mx-auto font-sans">
            Cada dólar donado se asigna íntegramente a insumos operativos del programa elegido. Recibirás informes transparentes semanales sobre el avance.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!submited ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-5 sm:p-10 shadow-none space-y-6"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Target Project Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C2C2C] flex items-center gap-1.5 font-sans">
                    <Compass className="h-4 w-4 text-[#C5A059]" />
                    Seleccionar Proyecto de Destino
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[4px] py-3 px-4 text-xs text-[#2C2C2C] focus:outline-none focus:ring-1 focus:ring-[#1B3022] focus:border-[#1B3022] transition-all cursor-pointer font-sans"
                  >
                    <option value="" disabled>Seleccione un proyecto...</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (Meta: ${p.goal} | Recaudado: ${p.raised})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Currency Selection Toggle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C2C2C] flex items-center gap-1.5 font-sans">
                    <Sparkles className="h-4 w-4 text-[#C5A059]" />
                    Seleccionar Moneda de Donación
                  </label>
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency('USD');
                        setAmount(25);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-3 rounded-[4px] border font-bold text-[10.5px] sm:text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        currency === 'USD'
                          ? 'bg-[#1B3022] border-[#1B3022] text-[#F5F2ED]'
                          : 'bg-[#FCF9F8] border-[#C5A059]/30 text-[#2C2C2C] hover:bg-[#C5A059]/10'
                      }`}
                    >
                      Dólares ($ USD)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency('BOB');
                        setAmount(100);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-3 rounded-[4px] border font-bold text-[10.5px] sm:text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        currency === 'BOB'
                          ? 'bg-[#1B3022] border-[#1B3022] text-[#F5F2ED]'
                          : 'bg-[#FCF9F8] border-[#C5A059]/30 text-[#2C2C2C] hover:bg-[#C5A059]/10'
                      }`}
                    >
                      Bolivianos (Bs. BOB)
                    </button>
                  </div>
                </div>

                {/* 3. Amount Selection */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C2C2C] flex items-center gap-1.5 font-sans">
                    <Gift className="h-4 w-4 text-[#C5A059]" />
                    Monto de Donación en {currency === 'USD' ? 'Dólares' : 'Bolivianos'}
                  </label>

                  {/* Preset Row */}
                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2 px-1 rounded-[4px] font-black text-[10.5px] tracking-wider transition-all border cursor-pointer ${
                          amount === amt && !customAmount
                            ? 'bg-[#1B3022] border-[#1B3022] text-[#F5F2ED]'
                            : 'bg-[#FCF9F8] border-[#C5A059]/30 text-[#2C2C2C] hover:bg-[#C5A059]/10'
                        }`}
                      >
                        {currency === 'USD' ? '$' : 'Bs.'}{amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount input */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#2C2C2C] font-bold text-xs font-sans">
                      {currency === 'USD' ? '$' : 'Bs.'}
                    </span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Otro monto personalizado..."
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setAmount(0); // reset presets
                      }}
                      className="w-full bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[4px] py-3 pl-10 pr-12 text-xs text-[#2C2C2C] focus:outline-none focus:ring-1 focus:ring-[#1B3022] focus:border-[#1B3022] transition-all font-sans"
                    />
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-[10px] text-[#2C2C2C]/70 font-bold uppercase tracking-wider font-sans">
                      {currency}
                    </span>
                  </div>
                </div>

                {/* User Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C2C2C] flex items-center gap-1.5 font-sans">
                      <Smile className="h-4 w-4 text-[#C5A059]" />
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. María Elena Rojas"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[4px] py-3 px-4 text-xs text-[#2C2C2C] focus:outline-none focus:ring-1 focus:ring-[#1B3022] font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C2C2C] flex items-center gap-1.5 font-sans">
                      <Mail className="h-4 w-4 text-[#C5A059]" />
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="maria@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[4px] py-3 px-4 text-xs text-[#2C2C2C] focus:outline-none focus:ring-1 focus:ring-[#1B3022] font-sans"
                    />
                  </div>
                </div>

                {/* Optional comments */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C2C2C] flex items-center gap-1.5 font-sans">
                    <HelpCircle className="h-4 w-4 text-[#C5A059]" />
                    Mensaje o Dedicatoria (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Escribe un mensaje de apoyo para los voluntarios o beneficiarios..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[4px] py-3 px-4 text-xs text-[#2C2C2C] focus:outline-none focus:ring-1 focus:ring-[#1B3022] resize-none font-sans"
                  />
                </div>

                {/* Error Box */}
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200/40 text-red-700 rounded-[4px] text-xs font-bold font-sans flex items-center gap-2.5">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#C5A059] text-[#1B3022] hover:bg-[#C5A059]/95 border-b border-[#1B3022] py-4 rounded-[4px] text-xs font-black uppercase tracking-widest transition-all shadow-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="h-4.5 w-4.5 fill-current text-[#1B3022]" />
                  <span>{submitting ? 'Registrando Donación...' : 'Proceder a Comprometer Donación'}</span>
                </button>

              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1B3022] text-[#F5F2ED] border border-[#C5A059]/40 rounded-[8px] p-6 sm:p-10 shadow-none text-center space-y-6 max-w-2xl mx-auto"
            >
              <div className="w-14 h-14 bg-[#FCF9F8] text-[#C5A059] rounded-full flex items-center justify-center mx-auto border border-[#C5A059]/40">
                <Check className="h-7 w-7 text-[#1B3022]" />
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-2xl sm:text-3.5xl font-black tracking-tight text-white">¡Muchísimas Gracias, {donorName}!</h3>
                <p className="text-white/85 text-xs sm:text-sm leading-relaxed font-sans px-2">
                  Hemos registrado con profundo agradecimiento tu valioso compromiso en favor del proyecto <strong className="text-[#C5A059]">"{getSelectedProjectTitle()}"</strong>. 
                  Tu generosidad estimula el trabajo incansable de los voluntarios de VOSERDEM en Bolivia.
                </p>
              </div>

              {/* DYNAMIC PAYMENT METHOD INSTRUCTIONS */}
              <div className="py-4 border-t border-b border-[#C5A059]/20 space-y-4">
                {registeredCurrency === 'BOB' ? (
                  <div className="space-y-4">
                    <div className="max-w-md mx-auto text-center space-y-2">
                      <h4 className="text-[#C5A059] text-xs font-black uppercase tracking-widest">
                        Donación vía Transferencia QR Simple
                      </h4>
                      <p className="text-white/85 text-[11px] font-sans leading-relaxed">
                        Escanea el siguiente QR oficial Simple desde la app móvil de tu banco en Bolivia para realizar tu transferencia directa por el monto de <strong className="text-[#C5A059]">Bs. {registeredAmount.toLocaleString()} BOB</strong>.
                      </p>
                    </div>
                    <QRCodeSimpleVisual amount={registeredAmount} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-w-md mx-auto text-center space-y-2">
                      <h4 className="text-[#C5A059] text-xs font-black uppercase tracking-widest">
                        Donación vía Transferencia Banco BISA
                      </h4>
                      <p className="text-white/85 text-[11px] font-sans leading-relaxed">
                        Realiza tu depósito en dólares estadounidenses por un monto de <strong className="text-[#C5A059]">${registeredAmount.toLocaleString()} USD</strong> en nuestra cuenta corporativa oficial:
                      </p>
                    </div>
                    <BancoBisaCard amount={registeredAmount} />
                  </div>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-[8px] text-[11px] text-left text-white/90 leading-relaxed max-w-md mx-auto space-y-1 font-sans">
                <p className="font-bold text-[#C5A059] flex items-center gap-1 font-sans">
                  <Sparkles className="h-4 w-4" />
                  Siguiente paso administrativo:
                </p>
                <p>Hemos enviado una confirmación formal a tu correo <span className="text-[#C5A059] font-bold">{email}</span>. Una vez realizada tu transferencia bancaria o escaneo QR, por favor reenvíanos el comprobante electrónico para la emisión de tu certificado de canje de impacto deducible de impuestos.</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={() => {
                    setSubmited(false);
                    setDonorName('');
                    setComment('');
                    setCustomAmount('');
                  }}
                  className="w-full sm:w-auto bg-[#C5A059] text-[#1B3022] hover:bg-[#C5A059]/90 px-6 py-3 rounded-[4px] font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer border-b border-[#1B3022]"
                >
                  Hacer otra Donación
                </button>
                {onSuccessRedirect && (
                  <button
                    onClick={onSuccessRedirect}
                    className="w-full sm:w-auto bg-transparent text-[#F5F2ED] border border-[#C5A059]/40 hover:bg-white/10 px-6 py-3 rounded-[4px] font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Volver a Proyectos
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
