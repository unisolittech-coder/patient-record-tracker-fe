import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const authAtom = atom(createPersistedAtom("authState", {
  isAuthenticated: false,
}));

export const adminResAtom = atom(createPersistedAtom("adminResState", null));

export const receptionistResAtom = atom(createPersistedAtom("receptionistResState", null));
 