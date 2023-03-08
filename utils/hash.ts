import {compare, hash} from "bcrypt";

export const hashPassword = async (pwd: string): Promise<string> => await hash(pwd, 10);

export const compareHash = async (pwd: string, hash: string): Promise<boolean> => await compare(pwd, hash);