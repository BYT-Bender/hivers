
export interface RoommatePreference {
  id: string;
  userId: string;
  budget: number;
  location: string;
  prefers: string[];
  about: string;
}

export interface RoommateFormData {
  name: string;
  age: number;
  gender: string;
  budget: number;
  location: string;
  interests: string;
  about: string;
}
