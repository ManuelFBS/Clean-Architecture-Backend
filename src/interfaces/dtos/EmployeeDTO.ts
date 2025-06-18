export interface CreateEmployeeDTO {
    dni: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface UpdateEmployeeDTO {
    dni?: string;
    name?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}
