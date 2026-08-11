import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const departmentResAtom = atom(createPersistedAtom("departmentRes_v2", []));

export const departmentDetailsAtom = atom(createPersistedAtom("departmentDetailsKey_v2", null));