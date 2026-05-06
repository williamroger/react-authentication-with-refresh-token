import { HttpClient } from "./HttpClient";

interface ISignUpDTO {
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  static async signUp({ name, email, password }: ISignUpDTO) {
    const { data } = await HttpClient.post('/signup', {
      name,
      email,
      password,
    });

    return data;
  }
}