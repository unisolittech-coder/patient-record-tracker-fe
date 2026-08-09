import { atom } from "recoil";

// Patient data atom
export const patientDataAtom = atom({
    key: "patientDataAtom",
    default: null,
});

// Patient search results
export const patientSearchResultsAtom = atom({
    key: "patientSearchResultsAtom",
    default: [],
});

// Patient medical history
export const patientHistoryAtom = atom({
    key: "patientHistoryAtom",
    default: [],
});

// Current treatment
export const currentTreatmentAtom = atom({
    key: "currentTreatmentAtom",
    default: null,
});

// Lab tests
export const labTestsAtom = atom({
    key: "labTestsAtom",
    default: [],
});

// Departments
export const departmentsAtom = atom({
    key: "departmentsAtom",
    default: [],
});

// Doctors list
export const doctorsListAtom = atom({
    key: "doctorsListAtom",
    default: [],
});

// Loading state
export const patientLoadingAtom = atom({
    key: "patientLoadingAtom",
    default: false,
});

// Error state
export const patientErrorAtom = atom({
    key: "patientErrorAtom",
    default: null,
});

// Selected patient ID (for navigation)
export const selectedPatientIdAtom = atom({
    key: "selectedPatientIdAtom",
    default: null,
});

// Treatment form data (for multi-step forms)
export const treatmentFormDataAtom = atom({
    key: "treatmentFormDataAtom",
    default: {
        symptoms: '',
        diagnosis: '',
        prescription: [],
        labTests: [],
        assignedTo: '',
        notes: ''
    },
});