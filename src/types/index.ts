import type { Timestamp, DocumentReference } from "firebase/firestore";

export interface Usuario {
  email: string;
  nombre: string;
  rol: "Administrador" | "Moderador" | "Usuario";
  facultad: string;
  activo: boolean;
  creadoEn?: Timestamp;
  actualizadoEn?: Timestamp;
}

export interface Empresa {
  id?: string;
  nombre: string;
  rfc?: string;
  facultad: string;
  activa: boolean;
  fechaAlta: Timestamp;
  fechaVencimiento?: Timestamp;
  creadoPor?: string;
  actualizadoEn?: Timestamp;
}

export interface Vacante {
  id?: string;
  empresaRef: DocumentReference;
  facultad: string;
  titulo: string;
  descripcion: string;
  fechaAlta: Timestamp;
  fechaVencimiento: Timestamp;
  estado: "activa" | "vencida" | "cerrada";
  plazas: number;
  contrataciones: {
    total: number;
    uas: number;
  };
  creadoPor?: string;
  actualizadoEn?: Timestamp;
}

export type RangoFechas = {
  desde?: Timestamp;
  hasta?: Timestamp;
};

export type FiltrosEmpresas = {
  facultad?: string;
  rangoAlta?: RangoFechas;
  proximasVencerDias?: number;
  status?: "activas" | "vencidas";
};

export type FiltrosVacantes = {
  facultad?: string;
  estado?: "activa" | "vencida" | "cerrada";
  rangoAlta?: RangoFechas;
  proximasVencerDias?: number;
};
