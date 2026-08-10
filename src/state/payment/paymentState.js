import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const paymentCollectorPatientAtom = atom(createPersistedAtom("paymentCollectorPatient", []));
