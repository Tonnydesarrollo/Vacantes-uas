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
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Vacante, FiltrosVacantes, Usuario } from "../types";

const COL = "Vacantes";

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

export async function listVacantes(
  f: FiltrosVacantes & { limit?: number; startAfterId?: string }
): Promise<{ items: Vacante[]; nextPageCursor?: string }> {
  const constraints: QueryConstraint[] = [];
  if (f.facultad) constraints.push(where("facultad", "==", f.facultad));
  if (f.estado) constraints.push(where("estado", "==", f.estado));
  if (f.rangoAlta?.desde)
    constraints.push(where("fechaAlta", ">=", f.rangoAlta.desde));
  if (f.rangoAlta?.hasta)
    constraints.push(where("fechaAlta", "<=", f.rangoAlta.hasta));

  let orderField: string = "fechaAlta";
  let orderDir: "asc" | "desc" = "desc";

  if (f.proximasVencerDias !== undefined) {
    const now = Timestamp.now();
    const future = Timestamp.fromMillis(
      now.toMillis() + f.proximasVencerDias * 86400000
    );
    constraints.push(where("fechaVencimiento", ">=", now));
    constraints.push(where("fechaVencimiento", "<=", future));
    orderField = "fechaVencimiento";
    orderDir = "asc";
  }

  constraints.push(orderBy(orderField, orderDir));
  const pageLimit = f.limit ?? 10;
  constraints.push(limitQuery(pageLimit));

  if (f.startAfterId) {
    const cursorSnap = await getDoc(doc(db, COL, f.startAfterId));
    if (cursorSnap.exists()) constraints.push(startAfter(cursorSnap));
  }

  const q = query(collection(db, COL), ...constraints);
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Vacante) }));

  const last = snap.docs[snap.docs.length - 1];
  const nextPageCursor = snap.docs.length === pageLimit ? last?.id : undefined;

  return { items, nextPageCursor };
}

export async function createVacante(
  data: Omit<Vacante, "id" | "actualizadoEn">,
  actor: Usuario
): Promise<string> {
  assertAdminOrMod(actor);
  const colRef = collection(db, COL);
  const docRef = await addDoc(colRef, {
    ...data,
    actualizadoEn: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateVacante(
  id: string,
  data: Partial<Vacante>,
  actor: Usuario
): Promise<void> {
  assertAdminOrMod(actor);
  if (data.fechaAlta && !(data.fechaAlta instanceof Timestamp)) {
    throw new Error("fechaAlta debe ser Timestamp");
  }
  if (data.fechaVencimiento && !(data.fechaVencimiento instanceof Timestamp)) {
    throw new Error("fechaVencimiento debe ser Timestamp");
  }
  const ref = doc(db, COL, id);
  await updateDoc(ref, { ...data, actualizadoEn: serverTimestamp() });
}

export async function deleteVacante(
  id: string,
  actor: Usuario
): Promise<void> {
  assertAdmin(actor);
  await deleteDoc(doc(db, COL, id));
}
