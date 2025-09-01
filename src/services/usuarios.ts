import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as limitQuery,
  startAfter,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Usuario } from "../types";

const COL = "Usuarios";

const assertAdminOrMod = (actor: Usuario) => {
  if (actor.rol !== "Administrador" && actor.rol !== "Moderador") {
    throw new Error("No autorizado");
  }
};

const assertAdmin = (actor: Usuario) => {
  if (actor.rol !== "Administrador") {
    throw new Error("No autorizado");
  }
};

export async function getPerfilByEmail(email: string): Promise<Usuario | null> {
  const ref = doc(db, COL, email);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { ...(snap.data() as Usuario) };
  }
  return null;
}

export async function listUsuarios(opts?: {
  rol?: Usuario["rol"];
  facultad?: string;
  activo?: boolean;
  limit?: number;
  startAfterId?: string;
}): Promise<{ items: Usuario[]; nextPageCursor?: string }> {
  const constraints: QueryConstraint[] = [];
  if (opts?.rol) constraints.push(where("rol", "==", opts.rol));
  if (opts?.facultad) constraints.push(where("facultad", "==", opts.facultad));
  if (opts?.activo !== undefined) constraints.push(where("activo", "==", opts.activo));

  constraints.push(orderBy("email"));
  const pageLimit = opts?.limit ?? 10;
  constraints.push(limitQuery(pageLimit));

  if (opts?.startAfterId) {
    const cursorSnap = await getDoc(doc(db, COL, opts.startAfterId));
    if (cursorSnap.exists()) constraints.push(startAfter(cursorSnap));
  }

  const q = query(collection(db, COL), ...constraints);
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => d.data() as Usuario);

  const last = snap.docs[snap.docs.length - 1];
  const nextPageCursor = snap.docs.length === pageLimit ? last?.id : undefined;

  return { items, nextPageCursor };
}

export async function createUsuario(
  data: Usuario,
  actor: Usuario
): Promise<void> {
  assertAdminOrMod(actor);
  const ref = doc(db, COL, data.email);
  await setDoc(ref, {
    ...data,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  });
}

export async function updateUsuario(
  email: string,
  data: Partial<Usuario>,
  actor: Usuario
): Promise<void> {
  assertAdminOrMod(actor);
  const ref = doc(db, COL, email);
  await updateDoc(ref, { ...data, actualizadoEn: serverTimestamp() });
}

export async function deleteUsuario(
  email: string,
  actor: Usuario
): Promise<void> {
  assertAdmin(actor);
  await deleteDoc(doc(db, COL, email));
}
