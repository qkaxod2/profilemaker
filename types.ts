export interface UserProfileData {
  name: string;
  species: string;
  height: string;
  weight: string;
  team: string;
  position: string;
  image: string | null; // Base64 Data URL

  tacticalCommand: string;
  antiPersonnelCombat: string;
  antiMaterielDestruction: string;
  crowdControl: string;
  specialAbilityUtilization: string;
  maxSpecialAbilityOutput: string;
  overallEvaluation: string;

  selfIntroduction: string;
  employmentEvaluation: string;
  personalReport1: string;
  personalReport2: string;
}

export const initialProfileData: UserProfileData = {
  name: "",
  species: "",
  height: "",
  weight: "",
  team: "",
  position: "",
  image: null,
  tacticalCommand: "",
  antiPersonnelCombat: "",
  antiMaterielDestruction: "",
  crowdControl: "",
  specialAbilityUtilization: "",
  maxSpecialAbilityOutput: "",
  overallEvaluation: "",
  selfIntroduction: "",
  employmentEvaluation: "",
  personalReport1: "",
  personalReport2: "",
};