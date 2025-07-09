
import type React from 'react';

export interface ComponenteSuero {
  nombre: string;
  dosis: string;
  funcion: string;
}

export interface Suero {
  nombre: string;
  descripcion: string;
  componentes: ComponenteSuero[];
  dimensiones: string[];
  indicaciones: string[];
  color: string;
}

export interface OpcionPregunta {
  valor: string;
  texto: string;
  dimension?: string;
}

export interface Pregunta {
  id: string;
  texto: string;
  tipo: 'radio' | 'escala';
  opciones: (string | OpcionPregunta)[];
  dimension?: string;
  peso: number;
  inverso?: boolean;
}

export interface SeccionCuestionario {
  id: string;
  titulo: string;
  descripcion: string;
  icon: React.ReactNode;
  preguntas: Pregunta[];
}

export interface Respuestas {
  [key: string]: string;
}

export interface ResultadoSuero {
  suero: string;
  nombre: string;
  puntuacion: number;
  razones: string[];
  descripcion: string;
  componentes: ComponenteSuero[];
  color: string;
}

export interface DimensionPuntuada {
  puntos: number;
  peso: number;
  puntuacionNormalizada: number;
}

export interface DimensionesPuntuadas {
  [key: string]: DimensionPuntuada;
}

export interface Protocolo {
    frecuencia: string;
    duracion: string;
    seguimiento: string;
}