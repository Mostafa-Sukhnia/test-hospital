export type JwT = {
    userId:string,
    email:string,
    role:string,
}
export type JwTPatch = {
    password?:string,
    email:string,
    name?:string,
    birthDate?:string,
}