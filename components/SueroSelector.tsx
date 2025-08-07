
import React, { useState, useMemo, useCallback } from 'react';
import { SUEROS, SECCIONES } from '../constants';
import type { Respuestas, ResultadoSuero, SeccionCuestionario, Pregunta, OpcionPregunta, Protocolo, DimensionesPuntuadas, Suero } from '../types';
import { 
    ChevronRight, ChevronLeft, RefreshCw, Whatsapp, MapPin, Sparkles, ArrowRight, BookOpen, 
    Target, FlaskConical, CheckCircle, Beaker, CalendarClock, Bot, ExclamationTriangle 
} from './icons';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';


// --- SUB-COMPONENTS (Modern Redesign) ---

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-slate-200/50 backdrop-blur-sm rounded-full h-3 border border-white/20">
    <div
      className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500 shadow-lg"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

const PantallaInicio: React.FC<{ onStart: () => void, onShowInfo: () => void }> = ({ onStart, onShowInfo }) => (
  <div className="text-center p-4 sm:p-8 max-w-2xl w-full mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl animate-fade-in border border-white/20">
    <div className="relative">
      <Sparkles className="mx-auto w-16 h-16 text-blue-500 mb-6 animate-pulse" />
      <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-r from-blue-400 to-teal-400 rounded-full blur-xl opacity-30"></div>
    </div>
    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">VitaScan</h1>
    <p className="text-slate-600 mb-10 text-lg max-w-lg mx-auto">
      Vamos a elegir el mejor suero para ti. Responde nuestro cuestionario inteligente para recibir una recomendación de sueroterapia IV 100% personalizada.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={onStart}
        className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:from-blue-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        Iniciar Test <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
      </button>
      <button
        onClick={onShowInfo}
        className="group inline-flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm text-slate-700 font-bold py-4 px-8 rounded-full text-lg hover:bg-white transition-all transform hover:scale-105 border border-white/30 shadow-lg"
      >
        <BookOpen className="w-6 h-6 text-slate-500" /> Ver Sueros
      </button>
    </div>
  </div>
);

const SueroInfoCard: React.FC<{ suero: Suero }> = ({ suero }) => (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-t-8 flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/20 w-full max-w-full" style={{ borderColor: suero.color }}>
        <h3 className="text-2xl font-bold mb-3" style={{ color: suero.color }}>{suero.nombre}</h3>
        <p className="text-slate-600 mb-6 flex-grow">{suero.descripcion}</p>
        <div className="mb-6">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Target className="w-5 h-5" style={{color: suero.color}}/> Ideal para:</h4>
            <ul className="space-y-2">
                {suero.indicaciones.map((indicacion, i) => (
                    <li key={i} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600">{indicacion}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="border-t border-slate-200 pt-4 mt-auto">
             <h4 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2"><FlaskConical className="w-5 h-5" style={{color: suero.color}}/> Componentes principales:</h4>
             <p className="text-sm text-slate-500 leading-relaxed">
                {suero.componentes.map(c => c.nombre).join(' • ')}
             </p>
        </div>
    </div>
);

const PantallaInfoSueros: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="max-w-6xl w-full p-4 animate-fade-in">
        <h1 className="text-center text-4xl sm:text-5xl font-bold mb-10 text-white drop-shadow-lg">Nuestra Gama de Sueros</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-full">
            {Object.values(SUEROS).map(suero => (
                <SueroInfoCard key={suero.nombre} suero={suero} />
            ))}
        </div>
        <div className="text-center mt-12">
            <button
                onClick={onBack}
                className="bg-teal-500 text-white font-bold py-3 px-6 rounded-full hover:bg-teal-600 transition-all flex items-center gap-2 mx-auto shadow-md"
            >
                <ChevronLeft className="w-5 h-5" />
                Volver al inicio
            </button>
        </div>
    </div>
);

const PreguntaControl: React.FC<{ pregunta: Pregunta; respuesta: string | undefined; onRespuestaChange: (id: string, valor: string) => void; }> = ({ pregunta, respuesta, onRespuestaChange }) => {
  const handleRadioChange = (valor: string) => onRespuestaChange(pregunta.id, valor);

  if (pregunta.tipo === 'radio') {
    return (
      <div className="space-y-2 sm:space-y-3">
        {pregunta.opciones.map((opcion) => {
          const opt = opcion as OpcionPregunta;
          const seleccionado = respuesta === opt.valor;
          return (
            <label key={opt.valor} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${seleccionado ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' : 'border-slate-200 hover:border-blue-300'}`}>
              <input type="radio" name={pregunta.id} value={opt.valor} checked={seleccionado} onChange={() => handleRadioChange(opt.valor)} className="sr-only" />
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-all duration-200 ${seleccionado ? 'border-blue-500 bg-blue-500' : 'border-slate-400 bg-white'}`}>
                {seleccionado && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
              </div>
              <span className={`text-slate-800 font-medium text-lg ${seleccionado ? 'text-blue-900' : ''}`}>{opt.texto}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (pregunta.tipo === 'escala') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {pregunta.opciones.map((opcion, index) => {
          const opt = opcion as string;
          const seleccionado = respuesta === opt;
          return (
            <button key={index} onClick={() => handleRadioChange(opt)} className={`p-3 rounded-lg border-2 text-center transition-all duration-200 text-sm sm:text-base font-semibold ${seleccionado ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
              {opt}
            </button>
          );
        })}
      </div>
    );
  }
  return null;
};

// --- Cuestionario ---
const Cuestionario: React.FC<{
  seccion: SeccionCuestionario;
  respuestas: Respuestas;
  onRespuestaChange: (id: string, valor: string) => void;
  preguntasIncompletas?: string[];
}> = ({ seccion, respuestas, onRespuestaChange, preguntasIncompletas = [] }) => (
    <div className="w-full animate-fade-in-up">
        <div className="flex items-center gap-4 mb-2">
            {seccion.icon}
            <h2 className="text-3xl font-bold text-slate-900">{seccion.titulo}</h2>
        </div>
        <p className="text-slate-500 mb-8">{seccion.descripcion}</p>
        <div className="space-y-10">
            {seccion.preguntas.map(pregunta => {
                const incompleta = preguntasIncompletas.includes(pregunta.id);
                return (
                <div key={pregunta.id} className={incompleta ? 'border-2 border-red-500 rounded-xl p-2 bg-red-50/30 transition-all duration-300' : ''}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-slate-700 text-center mb-0">{pregunta.texto}</h3>
                      {incompleta && <ExclamationTriangle className="w-6 h-6 text-red-500" title="Falta responder" />}
                    </div>
                    <PreguntaControl
                        pregunta={pregunta}
                        respuesta={respuestas[pregunta.id]}
                        onRespuestaChange={onRespuestaChange}
                    />
                </div>
            )})}
        </div>
    </div>
);

const ScoreCircle: React.FC<{ score: number; color: string; }> = ({ score, color }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="#e6e6e6" strokeWidth="10" fill="none" />
                <circle
                    cx="50" cy="50" r="45"
                    stroke={color}
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    className="transition-stroke-dashoffset duration-1000 ease-out"
                    style={{ strokeDashoffset: offset }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-3xl font-bold" style={{ color }}>{Math.round(score)}<span className="text-xl text-slate-500">%</span></span>
            </div>
        </div>
    );
};

const ResultadoPrincipalCard: React.FC<{ suero: ResultadoSuero; }> = ({ suero }) => (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-8 mb-8 border-t-8 border border-white/20 w-full max-w-full" style={{ borderColor: suero.color }}>
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: suero.color }}>Tu suero recomendado</h2>
                <h3 className="text-4xl font-bold mt-1 mb-4 text-slate-900">{suero.nombre}</h3>
                <p className="text-slate-600 mb-6 text-lg">{suero.descripcion}</p>
                <div className="mb-6">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> ¿Por qué es para ti?</h4>
                    <ul className="space-y-2 pl-8">
                        {suero.razones.slice(0, 3).map((razon, i) => (
                            <li key={i} className="text-slate-600 list-disc marker:text-green-500">{razon}</li>
                        ))}
                    </ul>
                </div>
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-2 text-sm flex items-center gap-2"><Beaker className="w-5 h-5 text-slate-500"/> Componentes Clave:</h4>
                     <p className="text-sm text-slate-500 leading-relaxed">
                        {suero.componentes.map(c => c.nombre).join(' • ')}
                     </p>
                </div>
            </div>
            <div className="md:w-1/3 flex flex-col items-center justify-center">
                <ScoreCircle score={suero.puntuacion} color={suero.color} />
                <p className="text-lg font-semibold text-slate-600 mt-3">Nivel de compatibilidad</p>
            </div>
        </div>
    </div>
);

const ResultadoAlternativoCard: React.FC<{ suero: ResultadoSuero }> = ({ suero }) => (
    <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg flex-1 min-w-0 flex flex-col border-t-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/20 w-full max-w-full" style={{ borderColor: suero.color }}>
        <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-xl text-slate-900" >{suero.nombre}</h3>
            <div className="font-bold text-lg" style={{color: suero.color}}>{Math.round(suero.puntuacion)}%</div>
        </div>
        <p className="text-sm text-slate-500 mb-4 flex-grow">{suero.razones[0] || suero.descripcion}</p>
        <div className="border-t border-slate-200 pt-3 mt-3">
             <h4 className="font-semibold text-slate-500 text-xs uppercase tracking-wider mb-2">Contiene:</h4>
             <p className="text-xs text-slate-500">{suero.componentes.slice(0, 3).map(c => c.nombre).join(' • ')}</p>
        </div>
    </div>
);

const ProtocoloSugeridoCard: React.FC<{ protocolo: Protocolo }> = ({ protocolo }) => (
    <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border-l-4 border-blue-400 border border-white/20 w-full max-w-full">
        <div className="flex items-start sm:items-center gap-5">
            <CalendarClock className="h-10 w-10 text-blue-500 flex-shrink-0" />
            <div>
                <h3 className="text-xl font-bold text-slate-900">Protocolo Sugerido</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 mt-2 text-slate-600">
                    <div><strong className="text-slate-800">Frecuencia:</strong> {protocolo.frecuencia}</div>
                    <div><strong className="text-slate-800">Duración:</strong> {protocolo.duracion}</div>
                    <div><strong className="text-slate-800">Seguimiento:</strong> {protocolo.seguimiento}</div>
                </div>
            </div>
        </div>
    </div>
);

const PantallaResultados: React.FC<{ resultados: ResultadoSuero[]; onRestart: () => void; respuestas: Respuestas; dimensiones?: DimensionesPuntuadas }> = ({ resultados, onRestart, respuestas, dimensiones }) => {
    const sueroPrincipal = resultados[0];
    const suerosAlternativos = resultados.slice(1, 3);
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = React.useState(true);
    
    // Determinar la necesidad principal para mostrar en los resultados
    const determinarNecesidadPrincipal = (dimensiones: DimensionesPuntuadas): string => {
        const prioridades = [
            { dimension: 'metabolismo', objetivo: 'metabolismo', umbral: 60 },
            { dimension: 'inmunidad', objetivo: 'inmunidad', umbral: 65 },
            { dimension: 'estres', objetivo: 'estres', umbral: 70 },
            { dimension: 'energia', objetivo: 'energia', umbral: 75 },
            { dimension: 'oxidacion', objetivo: 'antienvejecimiento', umbral: 60 }
        ];

        for (const prioridad of prioridades) {
            const puntuacion = dimensiones[prioridad.dimension]?.puntuacionNormalizada || 0;
            if (puntuacion >= prioridad.umbral) {
                return prioridad.objetivo;
            }
        }

        let maxPuntuacion = 0;
        let objetivoDefault = 'energia';
        
        Object.entries(dimensiones).forEach(([dimension, data]) => {
            if (data.puntuacionNormalizada > maxPuntuacion) {
                maxPuntuacion = data.puntuacionNormalizada;
                const mapeo: Record<string, string> = {
                    'metabolismo': 'metabolismo',
                    'inmunidad': 'inmunidad', 
                    'estres': 'estres',
                    'energia': 'energia',
                    'oxidacion': 'antienvejecimiento',
                    'prevencion': 'antienvejecimiento'
                };
                objetivoDefault = mapeo[dimension] || 'energia';
            }
        });

        return objetivoDefault;
    };

    const obtenerTextoNecesidad = (necesidad: string): string => {
        const textos: Record<string, string> = {
            'energia': 'Aumentar energía y combatir fatiga',
            'estres': 'Reducir estrés y mejorar sueño',
            'inmunidad': 'Fortalecer sistema inmune',
            'metabolismo': 'Mejorar control de azúcar y metabolismo',
            'antienvejecimiento': 'Anti-envejecimiento y bienestar general'
        };
        return textos[necesidad] || 'Mejorar tu bienestar general';
    };

    React.useEffect(() => {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2200);
      return () => clearTimeout(timer);
    }, []);
    
    const calcularProtocolo = (suero: ResultadoSuero, respuestas: Respuestas): Protocolo => {
        let puntuacionSeveridad = 0;
        if(respuestas.fatiga_frecuencia === 'Diariamente' || respuestas.nivel_estres === 'Muy alto') puntuacionSeveridad += 2;
        if(respuestas.calidad_sueno === 'Muy mala' || respuestas.frecuencia_enfermedades === 'Más de 6 veces/año') puntuacionSeveridad += 1;

        if (puntuacionSeveridad >= 2) {
            return { frecuencia: "1-2 veces/semana", duracion: "4-6 semanas", seguimiento: "Reevaluar en 1 mes" };
        } else if (puntuacionSeveridad > 0 || suero.puntuacion > 75) {
            return { frecuencia: "1 vez por semana", duracion: "4 semanas", seguimiento: "Reevaluar en 1 mes" };
        } else {
            return { frecuencia: "1 vez cada 2 semanas", duracion: "Mantenimiento", seguimiento: "Reevaluar en 2 meses" };
        }
    };
    
    const protocolo = calcularProtocolo(sueroPrincipal, respuestas);

    return (
        <div className="max-w-full md:max-w-4xl w-full animate-fade-in px-2 sm:px-0 relative">
            {showConfetti && (
              <Confetti
                width={width}
                height={height}
                numberOfPieces={120}
                recycle={false}
                gravity={0.25}
                colors={["#38bdf8","#34d399","#f472b6","#fbbf24","#fff"]}
                initialVelocityY={8}
                opacity={0.7}
              />
            )}
             <div className="text-center mb-8">
                <Bot className="mx-auto w-12 h-12 text-blue-500 mb-2" />
                <h1 className="text-center text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">Tus Resultados Personalizados</h1>
                <div className="mt-6 p-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Después de analizar todo:</h2>
                    <p className="text-lg text-slate-700 font-semibold">
                        Tu necesidad principal es: <span className="text-blue-600 font-bold">{obtenerTextoNecesidad(determinarNecesidadPrincipal(dimensiones || {}))}</span>
                    </p>
                </div>
            </div>
            <ResultadoPrincipalCard suero={sueroPrincipal} />
            <div className="mt-8">
              <ProtocoloSugeridoCard protocolo={protocolo} />
            </div>

            {suerosAlternativos.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-center mb-6 text-white drop-shadow-lg">Otras Opciones a Considerar</h2>
                    <div className="flex flex-col md:flex-row gap-6">
                        {suerosAlternativos.map(suero => <ResultadoAlternativoCard key={suero.suero} suero={suero} />)}
                    </div>
                </div>
            )}
            
            <div className="mt-12 text-center p-8 bg-white rounded-2xl shadow-lg">
                 <h3 className="text-2xl font-bold mb-4 text-slate-900">¿Listo para sentirte mejor?</h3>
                 <p className="text-slate-600 mb-6 max-w-md mx-auto">Agenda tu cita hoy mismo y comienza tu camino hacia el bienestar.</p>
                <a
                    href="https://wa.me/+525579076626"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg mb-6"
                >
                    <Whatsapp className="w-6 h-6" />
                    Agendar Cita
                </a>
                <div className="border-t border-slate-200 pt-6">
                     <div className="inline-flex items-center justify-center text-slate-500">
                        <MapPin className="w-5 h-5 mr-3" />
                        <p>Acapulco 36, int. 104, Col. Roma, Ciudad de México</p>
                    </div>
                </div>
            </div>
            <div className="text-center mt-8">
              <button
                  onClick={onRestart}
                  className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto shadow-md"
              >
                  <RefreshCw className="w-4 h-4" />
                  Realizar de nuevo el cuestionario
              </button>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
export default function SueroSelector() {
    const [pantallaActual, setPantallaActual] = useState<'inicio' | 'cuestionario' | 'resultados' | 'infoSueros'>('inicio');
    const [seccionActual, setSeccionActual] = useState(0);
    const [respuestas, setRespuestas] = useState<Respuestas>({});
    const [resultados, setResultados] = useState<ResultadoSuero[] | null>(null);
    const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);
    const [preguntasIncompletas, setPreguntasIncompletas] = useState<string[]>([]);

    const handleRespuestaChange = useCallback((id: string, valor: string) => {
        setRespuestas(prev => ({ ...prev, [id]: valor }));
    }, []);

    const determinarNecesidadPrincipal = useCallback((dimensiones: DimensionesPuntuadas): string => {
        // Prioridades de salud (de más crítica a menos crítica)
        const prioridades = [
            { dimension: 'metabolismo', objetivo: 'metabolismo', umbral: 60 },
            { dimension: 'inmunidad', objetivo: 'inmunidad', umbral: 65 },
            { dimension: 'estres', objetivo: 'estres', umbral: 70 },
            { dimension: 'energia', objetivo: 'energia', umbral: 75 },
            { dimension: 'oxidacion', objetivo: 'antienvejecimiento', umbral: 60 }
        ];

        // Buscar la primera dimensión que supere su umbral
        for (const prioridad of prioridades) {
            const puntuacion = dimensiones[prioridad.dimension]?.puntuacionNormalizada || 0;
            if (puntuacion >= prioridad.umbral) {
                return prioridad.objetivo;
            }
        }

        // Si ninguna supera el umbral, tomar la de mayor puntuación
        let maxPuntuacion = 0;
        let objetivoDefault = 'energia';
        
        Object.entries(dimensiones).forEach(([dimension, data]) => {
            if (data.puntuacionNormalizada > maxPuntuacion) {
                maxPuntuacion = data.puntuacionNormalizada;
                // Mapear dimensión a objetivo
                const mapeo: Record<string, string> = {
                    'metabolismo': 'metabolismo',
                    'inmunidad': 'inmunidad', 
                    'estres': 'estres',
                    'energia': 'energia',
                    'oxidacion': 'antienvejecimiento',
                    'prevencion': 'antienvejecimiento'
                };
                objetivoDefault = mapeo[dimension] || 'energia';
            }
        });

        return objetivoDefault;
    }, []);

    const generarRazones = useCallback((sueroNombre: string, dimensiones: DimensionesPuntuadas): string[] => {
        const razones: string[] = [];
        const umbralAlto = 70;
        const umbralMedio = 40;
        
        const mapaRazones: Record<string, { alto: string; medio: string }> = {
            energia: { alto: "Tu nivel de fatiga y cansancio es significativamente alto.", medio: "Muestras necesidad de un impulso energético." },
            estres: { alto: "Tus respuestas indican un nivel de estrés muy elevado.", medio: "Necesitas apoyo para manejar el estrés diario." },
            sueño: { alto: "La calidad de tu sueño parece muy afectada.", medio: "Mejorar tu descanso es un área de oportunidad." },
            inmunidad: { alto: "Tu sistema inmune parece necesitar un refuerzo importante.", medio: "Fortalecer tus defensas podría beneficiarte." },
            metabolismo: { alto: "Tus respuestas sugieren un desbalance metabólico que debe atenderse.", medio: "Hay indicadores de que tu metabolismo puede optimizarse." },
            oxidacion: { alto: "Tu estilo de vida te expone a un alto estrés oxidativo.", medio: "Una carga antioxidante extra te sería útil." },
        };
        
        // Determinar automáticamente la necesidad principal
        const necesidadPrincipal = determinarNecesidadPrincipal(dimensiones);
        
        // Priorizar razones basadas en la necesidad principal determinada automáticamente
        if (necesidadPrincipal === 'energia' && sueroNombre.includes('Immunity Prime')) razones.unshift("Después de analizar todo, tu necesidad principal es la energía, y este suero es perfecto para combatir la fatiga.");
        if (necesidadPrincipal === 'estres' && sueroNombre.includes('Serenity Balance')) razones.unshift("Después de analizar todo, tu necesidad principal es reducir el estrés, y este suero está diseñado específicamente para la relajación.");
        if (necesidadPrincipal === 'metabolismo' && sueroNombre.includes('Sugar Sync')) razones.unshift("Después de analizar todo, tu necesidad principal es mejorar tu metabolismo, y este es el suero más especializado.");
        if (necesidadPrincipal === 'inmunidad' && sueroNombre.includes('Immunity Prime')) razones.unshift("Después de analizar todo, tu necesidad principal es fortalecer tu sistema inmune, y este suero es ideal para ello.");
        if (necesidadPrincipal === 'antienvejecimiento' && sueroNombre.includes('Radiance Defense')) razones.unshift("Después de analizar todo, tu necesidad principal es el anti-envejecimiento, y este suero antioxidante es perfecto.");

        Object.entries(dimensiones).forEach(([key, value]) => {
             if(mapaRazones[key]){
                if (value.puntuacionNormalizada > umbralAlto) razones.push(mapaRazones[key].alto);
                else if (value.puntuacionNormalizada > umbralMedio) razones.push(mapaRazones[key].medio);
             }
        });

        return [...new Set(razones)]; // Remove duplicates
    }, [determinarNecesidadPrincipal]);

    const calcularDimensiones = useCallback((): DimensionesPuntuadas => {
        const dims: DimensionesPuntuadas = {
            energia: { puntos: 0, peso: 0, puntuacionNormalizada: 0 },
            estres: { puntos: 0, peso: 0, puntuacionNormalizada: 0 },
            sueño: { puntos: 0, peso: 0, puntuacionNormalizada: 0 },
            ansiedad: { puntos: 0, peso: 0, puntuacionNormalizada: 0 },
            inmunidad: { puntos: 0, peso: 0, puntuacionNormalizada: 0 },
            metabolismo: { puntos: 0, peso: 0, puntuacionNormalizada: 0 },
            oxidacion: { puntos: 0, peso: 0, puntuacionNormalizada: 0 },
            prevencion: { puntos: 0, peso: 0, puntuacionNormalizada: 0 }
        };
        
        SECCIONES.forEach(seccion => {
            seccion.preguntas.forEach(pregunta => {
                const respuesta = respuestas[pregunta.id];
                if (respuesta !== undefined && pregunta.dimension && dims[pregunta.dimension]) {
                    let puntos = 0;
                    const indice = pregunta.opciones.findIndex(o => typeof o === 'string' ? o === respuesta : o.valor === respuesta);
                    if (indice !== -1) {
                      puntos = pregunta.inverso ? (pregunta.opciones.length - 1 - indice) : indice;
                      puntos = (puntos / (pregunta.opciones.length - 1)) * pregunta.peso;
                      dims[pregunta.dimension].puntos += puntos;
                      dims[pregunta.dimension].peso += pregunta.peso;
                    }
                }
            });
        });

        Object.keys(dims).forEach(key => {
            const dim = dims[key];
            dim.puntuacionNormalizada = dim.peso > 0 ? (dim.puntos / dim.peso) * 100 : 0;
        });

        return dims;
    }, [respuestas]);

    const calcularResultados = useCallback(() => {
        const dims = calcularDimensiones();
        
        // Determinar automáticamente la necesidad principal después de calcular todas las puntuaciones
        const necesidadPrincipal = determinarNecesidadPrincipal(dims);
        
        // Agregar peso extra a la dimensión principal para mejorar la recomendación
        const mapeoDimension: Record<string, string> = {
            'metabolismo': 'metabolismo',
            'inmunidad': 'inmunidad', 
            'estres': 'estres',
            'energia': 'energia',
            'antienvejecimiento': 'oxidacion'
        };
        
        const dimensionPrincipal = mapeoDimension[necesidadPrincipal];
        if (dimensionPrincipal && dims[dimensionPrincipal]) {
            dims[dimensionPrincipal].puntos += 20; // Peso extra significativo
            dims[dimensionPrincipal].peso += 20;
            dims[dimensionPrincipal].puntuacionNormalizada = (dims[dimensionPrincipal].puntos / dims[dimensionPrincipal].peso) * 100;
        }

        const compatibilidad: ResultadoSuero[] = Object.values(SUEROS).map(suero => {
            let puntuacionTotal = 0;
            const mapaDimensiones: Record<string, Record<string, number>> = {
                'Immunity Prime': { inmunidad: 35, energia: 30, estres: 20, prevencion: 15 },
                'Serenity Balance': { estres: 35, sueño: 30, ansiedad: 25, energia: 10 },
                'Radiance Defense': { oxidacion: 30, prevencion: 30, energia: 20, inmunidad: 20 },
                'Sugar Sync': { metabolismo: 40, oxidacion: 25, energia: 20, prevencion: 15 }
            };

            const pesosDimension = mapaDimensiones[suero.nombre];
            if (pesosDimension) {
                Object.entries(pesosDimension).forEach(([dimension, peso]) => {
                    puntuacionTotal += ((dims[dimension]?.puntuacionNormalizada || 0) * peso) / 100;
                });
            }

            return {
                ...suero,
                suero: suero.nombre,
                puntuacion: Math.min(puntuacionTotal, 100),
                razones: generarRazones(suero.nombre, dims),
            };
        });

        return compatibilidad.sort((a, b) => b.puntuacion - a.puntuacion);

    }, [respuestas, generarRazones]);
    
    const siguienteSeccion = () => {
        const preguntasFaltantes = SECCIONES[seccionActual].preguntas.filter(p => respuestas[p.id] === undefined).map(p => p.id);
        if (preguntasFaltantes.length > 0) {
            setMostrarAdvertencia(true);
            setPreguntasIncompletas(preguntasFaltantes);
            return;
        }
        setMostrarAdvertencia(false);
        setPreguntasIncompletas([]);
        if (seccionActual < SECCIONES.length - 1) {
            setSeccionActual(seccionActual + 1);
        } else {
            const resultadosCalculados = calcularResultados();
            setResultados(resultadosCalculados);
            setPantallaActual('resultados');
        }
    };

    const seccionAnterior = () => {
        if (seccionActual > 0) setSeccionActual(seccionActual - 1);
    };

    const reiniciar = () => {
        setPantallaActual('inicio');
        setSeccionActual(0);
        setRespuestas({});
        setResultados(null);
    };

    const seccionCompleta = seccionActual >= 0 && seccionActual < SECCIONES.length ? SECCIONES[seccionActual].preguntas.every(p => respuestas[p.id] !== undefined) : false;
    const progreso = ((seccionActual) / SECCIONES.length) * 100;

    const renderContent = () => {
        switch (pantallaActual) {
            case 'inicio':
                return <PantallaInicio onStart={() => setPantallaActual('cuestionario')} onShowInfo={() => setPantallaActual('infoSueros')} />;
            case 'infoSueros':
                return <PantallaInfoSueros onBack={() => setPantallaActual('inicio')} />;
            case 'cuestionario':
                return (
                    <div className="bg-white p-4 sm:p-10 rounded-3xl shadow-2xl w-full max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto">
                        <ProgressBar value={progreso} />
                        <div className="mt-6">
                            <Cuestionario
                                seccion={SECCIONES[seccionActual]}
                                respuestas={respuestas}
                                onRespuestaChange={handleRespuestaChange}
                                preguntasIncompletas={preguntasIncompletas}
                            />
                        </div>
                        {mostrarAdvertencia && preguntasIncompletas.length > 0 && (
                          <div className="text-3xl font-extrabold text-red-700 text-center mt-4 mb-2 animate-bounce">
                            PRUEBA: FALTAN RESPUESTAS
                          </div>
                        )}
                        {mostrarAdvertencia && (
                          <div className="text-red-600 font-semibold text-center mt-6 mb-2 animate-pulse">
                            Por favor responde todas las preguntas antes de continuar.
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 mt-10 pt-6 border-t border-slate-200">
                            <button onClick={seccionAnterior} disabled={seccionActual === 0} className="w-full sm:w-auto mb-2 sm:mb-0 flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                                Anterior
                            </button>
                            <span className="text-sm font-bold text-slate-500 text-center w-full sm:w-auto mb-2 sm:mb-0">Paso {seccionActual + 1} de {SECCIONES.length}</span>
                            <button onClick={siguienteSeccion} disabled={!seccionCompleta} className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/30">
                                {seccionActual === SECCIONES.length - 1 ? 'Ver Resultados' : 'Siguiente'}
                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                );
            case 'resultados':
                return resultados && <PantallaResultados resultados={resultados} onRestart={reiniciar} respuestas={respuestas} dimensiones={calcularDimensiones()}/>;
            default:
                return null;
        }
    };

    // LOGS DE DEPURACIÓN
    console.log('mostrarAdvertencia:', mostrarAdvertencia);
    console.log('preguntasIncompletas:', preguntasIncompletas);
    return <div className="w-full flex items-center justify-center p-4">{renderContent()}</div>;
}