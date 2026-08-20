import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const igmcPatientAtom = atom(createPersistedAtom("iggmcPatient", null));

export const igmcPatientResAtom = atom(createPersistedAtom("iggmcPatientRes", null));
