import jwt from "jsonwebtoken";

export const generarJWT = (id) => {
    return(jwt.sign({ id }, process.env.JWT_SECRETE, {
        expiresIn: "30d"
    }));
}