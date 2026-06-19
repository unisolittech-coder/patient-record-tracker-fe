import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const patientResAtom = atom(createPersistedAtom("patientRes", []));

export const patientDetailsAtom = atom(createPersistedAtom("patientDetailsKey", null));