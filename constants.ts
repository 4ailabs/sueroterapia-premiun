
import React from 'react';
import type { Suero, SeccionCuestionario } from './types';
import { Activity, Zap, Brain, Shield, Target, Sparkles } from './components/icons';

export const SUEROS: Record<string, Suero> = {
  'INMUNO-BOOST': {
    nombre: 'INMUNO-BOOST',
    descripcion: 'Sirve para subir las defensas, combatir la fatiga y aumentar la resistencia al estrés.',
    componentes: [
      { nombre: 'Ácido ascórbico', dosis: '5g', funcion: 'Mejora función de glóbulos blancos y actúa como antioxidante.' },
      { nombre: 'Magnesio', dosis: '1g', funcion: 'Provee la energía (ATP) que las células inmunes necesitan para funcionar.' },
      { nombre: 'Zinc', dosis: '10-15mg', funcion: 'Esencial para el desarrollo y la función de las células de defensa (linfocitos).' }
    ],
    dimensiones: ['inmunidad', 'energia', 'estres'],
    indicaciones: ['Prevención de enfermedades', 'Recuperación post-enfermedad', 'Agotamiento', 'Necesidad de protección extra'],
    color: '#10B981' // emerald-500
  },
  'RELAX TOTAL': {
    nombre: 'RELAX TOTAL',
    descripcion: 'Diseñado para disminuir la hiperexcitabilidad del sistema nervioso central y periférico y para mitigar el daño metabólico del estrés.',
    componentes: [
      { nombre: 'Magnesio', dosis: '2g', funcion: 'Bloquea receptores excitatorios (NMDA) en el cerebro y relaja los músculos.' },
      { nombre: 'Ácido alfalipóico', dosis: '300mg', funcion: 'Antioxidante que protege las neuronas y optimiza el metabolismo de la glucosa.' },
      { nombre: 'Glicina', dosis: '1g', funcion: 'Neurotransmisor inhibidor que reduce la actividad neuronal, induciendo calma y sueño.' }
    ],
    dimensiones: ['estres', 'sueño', 'ansiedad'],
    indicaciones: ['Estrés crónico', 'Insomnio', 'Ansiedad', 'Tensión muscular'],
    color: '#8B5CF6' // violet-500
  },
  'ANTIOXIDANTE PROFILÁCTICO': {
    nombre: 'ANTIOXIDANTE PROFILÁCTICO',
    descripcion: 'Suero de "mantenimiento" o "bienestar general". Su objetivo es preventivo (profiláctico) y busca recargar al cuerpo de antioxidantes clave.',
    componentes: [
      { nombre: 'Ascorbato de Sodio', dosis: '10 ml (Vit C)', funcion: 'Antioxidante principal, apoya sistema inmune y producción de colágeno.' },
      { nombre: 'Selenio', dosis: '4 ml', funcion: 'Activa las enzimas antioxidantes más potentes del cuerpo.' },
      { nombre: 'Zinc', dosis: '4 ml', funcion: 'Clave para la función inmune, cicatrización y protección contra daño oxidativo.' },
      { nombre: 'Carzilasa', dosis: '5 ml (B1)', funcion: 'Esencial para el metabolismo energético, cerebro y sistema nervioso.' },
      { nombre: 'Arginina', dosis: '5 ml', funcion: 'Mejora el flujo sanguíneo y la oxigenación.' }
    ],
    dimensiones: ['oxidacion', 'prevencion', 'energia'],
    indicaciones: ['Mantenimiento preventivo', 'Anti-envejecimiento', 'Exposición a contaminación', 'Bienestar general'],
    color: '#3B82F6' // blue-500
  },
  'ANTIOXIDANTE + RESISTENCIA A LA INSULINA': {
    nombre: 'ANTIOXIDANTE + RESISTENCIA A LA INSULINA',
    descripcion: 'Diseñado para pacientes con problemas metabólicos, como resistencia a la insulina, pre-diabetes o como apoyo en el control de la diabetes tipo 2.',
    componentes: [
      { nombre: 'Ácido Ascórbico', dosis: '10 ml (Vit C)', funcion: 'Reduce el daño oxidativo elevado en la resistencia a la insulina.' },
      { nombre: 'Selenio', dosis: '6ml', funcion: 'Mayor apoyo antioxidante.' },
      { nombre: 'Cromo', dosis: '2 ml', funcion: 'Potencia la acción de la insulina en los receptores celulares.' },
      { nombre: 'Complejo B', dosis: '10 ml', funcion: 'Cofactores esenciales para todas las reacciones metabólicas de energía.' },
      { nombre: 'Carnitina', dosis: '5ml', funcion: 'Crucial para transportar las grasas a la mitocondria para ser quemadas como energía.' }
    ],
    dimensiones: ['metabolismo', 'oxidacion', 'energia'],
    indicaciones: ['Resistencia a insulina', 'Pre-diabetes', 'Síndrome metabólico', 'Control de peso'],
    color: '#F59E0B' // amber-500
  }
};

export const SECCIONES: SeccionCuestionario[] = [
    {
      id: 'objetivo_principal',
      titulo: 'Objetivo Principal',
      descripcion: 'Ayúdanos a entender tu necesidad principal.',
      icon: React.createElement(Target, { className: "w-8 h-8 text-rose-500" }),
      preguntas: [
        {
          id: 'objetivo',
          texto: '¿Cuál es tu objetivo principal al buscar un suero IV?',
          tipo: 'radio',
          opciones: [
            { valor: 'energia', texto: 'Aumentar energía y combatir fatiga', dimension: 'energia' },
            { valor: 'estres', texto: 'Reducir estrés y mejorar sueño', dimension: 'estres' },
            { valor: 'inmunidad', texto: 'Fortalecer sistema inmune', dimension: 'inmunidad' },
            { valor: 'metabolismo', texto: 'Mejorar control de azúcar y metabolismo', dimension: 'metabolismo' },
            { valor: 'antienvejecimiento', texto: 'Anti-envejecimiento y bienestar general', dimension: 'oxidacion' }
          ],
          peso: 10
        },
      ]
    },
    {
      id: 'sintomas_energia',
      titulo: 'Energía y Vitalidad',
      descripcion: 'Evaluamos tu nivel de energía actual.',
      icon: React.createElement(Zap, { className: "w-8 h-8 text-yellow-500" }),
      preguntas: [
        {
          id: 'fatiga_frecuencia',
          texto: '¿Con qué frecuencia experimentas fatiga que interfiere con tus actividades?',
          tipo: 'escala',
          opciones: ['Nunca', '1-2 días/semana', '3-4 días/semana', '5-6 días/semana', 'Diariamente'],
          dimension: 'energia',
          peso: 8
        },
        {
          id: 'energia_manana',
          texto: '¿Cómo te sientes al despertar por la mañana?',
          tipo: 'escala',
          opciones: ['Muy energético', 'Descansado', 'Algo cansado', 'Muy cansado', 'Exhausto'],
          dimension: 'energia',
          peso: 6
        },
      ]
    },
    {
      id: 'sintomas_estres',
      titulo: 'Estrés y Sistema Nervioso',
      descripcion: 'Evaluamos tu nivel de estrés y calidad del sueño.',
      icon: React.createElement(Brain, { className: "w-8 h-8 text-violet-500" }),
      preguntas: [
        {
          id: 'nivel_estres',
          texto: '¿Cómo describirías tu nivel de estrés en las últimas 2 semanas?',
          tipo: 'escala',
          opciones: ['Muy bajo', 'Bajo', 'Moderado', 'Alto', 'Muy alto'],
          dimension: 'estres',
          peso: 8
        },
        {
          id: 'calidad_sueno',
          texto: '¿Cómo calificarías la calidad de tu sueño?',
          tipo: 'escala',
          opciones: ['Excelente', 'Buena', 'Regular', 'Mala', 'Muy mala'],
          dimension: 'sueño',
          peso: 7
        },
      ]
    },
    {
      id: 'sistema_inmune',
      titulo: 'Sistema Inmunológico',
      descripcion: 'Evaluamos la fortaleza de tu sistema inmune.',
      icon: React.createElement(Shield, { className: "w-8 h-8 text-emerald-500" }),
      preguntas: [
        {
          id: 'frecuencia_enfermedades',
          texto: '¿Con qué frecuencia te enfermas (resfriados, gripes, etc.)?',
          tipo: 'escala',
          opciones: ['Casi nunca', '1-2 veces/año', '3-4 veces/año', '5-6 veces/año', 'Más de 6 veces/año'],
          dimension: 'inmunidad',
          peso: 8
        },
        {
          id: 'recuperacion',
          texto: 'Cuando te enfermas, ¿cuánto tiempo tardas en recuperarte?',
          tipo: 'escala',
          opciones: ['2-3 días', '4-5 días', '1 semana', '10-14 días', 'Más de 2 semanas'],
          dimension: 'inmunidad',
          peso: 6
        },
      ]
    },
    {
      id: 'salud_metabolica',
      titulo: 'Salud Metabólica',
      descripcion: 'Evaluamos factores relacionados con tu metabolismo.',
      icon: React.createElement(Activity, { className: "w-8 h-8 text-amber-500" }),
      preguntas: [
        {
          id: 'diabetes_historial',
          texto: '¿Tienes diagnóstico o antecedentes familiares de diabetes?',
          tipo: 'radio',
          opciones: [
            { valor: 'no', texto: 'No' },
            { valor: 'familiar', texto: 'Antecedentes familiares' },
            { valor: 'prediabetes', texto: 'Prediabetes' },
            { valor: 'diabetes2', texto: 'Diabetes tipo 2' }
          ],
          dimension: 'metabolismo',
          peso: 9
        },
        {
          id: 'antojos_azucar',
          texto: '¿Con qué frecuencia experimentas antojos de azúcar o carbohidratos?',
          tipo: 'escala',
          opciones: ['Nunca', 'Raramente', 'A veces', 'Frecuentemente', 'Constantemente'],
          dimension: 'metabolismo',
          peso: 5
        },
      ]
    },
    {
      id: 'estilo_vida',
      titulo: 'Estilo de Vida y Oxidación',
      descripcion: 'Factores que afectan tu salud general.',
      icon: React.createElement(Sparkles, { className: "w-8 h-8 text-blue-500" }),
      preguntas: [
        {
          id: 'alimentacion',
          texto: '¿Cómo calificarías tu alimentación actual?',
          tipo: 'escala',
          opciones: ['Muy saludable', 'Saludable', 'Regular', 'Poco saludable', 'Muy poco saludable'],
          dimension: 'prevencion',
          peso: 4,
          inverso: true
        },
        {
          id: 'alcohol',
          texto: '¿Con qué frecuencia consumes alcohol?',
          tipo: 'escala',
          opciones: ['No bebo', 'Ocasionalmente', '1-2 veces/semana', '3-4 veces/semana', 'Diariamente'],
          dimension: 'oxidacion',
          peso: 4
        },
        {
          id: 'tabaco',
          texto: '¿Fumas o estás expuesto al humo de tabaco?',
          tipo: 'radio',
          opciones: [
            { valor: 'no', texto: 'No fumo ni estoy expuesto' },
            { valor: 'expuesto', texto: 'Expuesto ocasionalmente' },
            { valor: 'ocasional', texto: 'Fumador ocasional' },
            { valor: 'regular', texto: 'Fumador regular' }
          ],
          dimension: 'oxidacion',
          peso: 5
        }
      ]
    },
];
