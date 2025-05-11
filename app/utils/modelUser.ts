export function validateEmail(email:string) {
    const regex = /\S+@\S+\.\S+/
    return regex.test(email);
}

export function validatePassword(password:string){
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
}