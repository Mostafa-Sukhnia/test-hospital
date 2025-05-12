export enum Status {
    Pending = "pending",
    Confirmed = "confirmed",
    Cancelled = "cancelled"
}

export type Apointment  = {
    date:Date,
    patientId:number,
    notes:string,
    status:Status
}