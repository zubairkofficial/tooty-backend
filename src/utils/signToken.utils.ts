import { sign } from 'jsonwebtoken'


export const SignToken = (payload: { sub: number, email: string }) => {

    const token = sign(payload, `${process.env.JWT_SECRET_KEY}`)
    return token
}