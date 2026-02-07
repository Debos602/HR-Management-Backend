export interface User {
    id?: number;
    email: string;
    password_hash: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Employee {
    id?: number;
    name: string;
    age: number;
    designation: string;
    hiring_date: Date;
    date_of_birth: Date;
    salary: number;
    photo_path?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Attendance {
    id?: number;
    employee_id: number;
    date: Date;
    check_in_time: string;
    created_at?: Date;
    updated_at?: Date;
}
