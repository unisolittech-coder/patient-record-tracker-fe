import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const departmentsAtom = atom(createPersistedAtom("departments", []));
export const designationsAtom = atom(createPersistedAtom("designations", []));
export const rolesAtom = atom(createPersistedAtom("roles", []));
