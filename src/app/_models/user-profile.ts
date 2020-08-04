export interface IUserProfile {
    schoolId: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}