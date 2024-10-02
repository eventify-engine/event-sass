import Repository from "~/repos/Repository";
import {type InferType, object, ref as yupRef, string} from "yup";
import type Resource from "~/types/Resource";

export default class AuthRepository extends Repository {
    public login() {
        const schema = object({
            email                : string().email().required().label('E-mail'),
            password             : string().min(8).max(255).required().label('Password')
        });

        type Schema = InferType<typeof schema>;

        return {
            schema,
            action: (data: Schema) => {
                return this.client.post<Resource<{token: string}>>('/login', data);
            }
        };
    }

    public register() {
        const schema = object({
            name                 : string().max(25).required().label('Name'),
            email                : string().email().required().label('E-mail'),
            password             : string().min(8).max(255).required().label('Password'),
            password_confirmation: string()
                .min(8)
                .oneOf([yupRef('password')], 'Passwords must match')
                .required()
                .label('Password confirmation')
        });

        type Schema = InferType<typeof schema>;

        return {
            schema,
            action: (data: Schema) => {
                return this.client.post<void>('/register', data);
            }
        };
    }
}