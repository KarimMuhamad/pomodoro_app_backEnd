import {User} from "@prisma/client";
import {toUserResponse, UpdateUserRequest, UserResponse} from "../model/users-model";
import prisma from "../application/database";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {ResponseError} from "../error/response-error";
import argon2 from "argon2";

export class UserService {

    static async getUsers(user:User) : Promise<UserResponse> {
        const getUsers = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        });

        return toUserResponse(getUsers!);
    }

    static async updateUser(req: UpdateUserRequest ,user:User) : Promise<UserResponse> {
        const validateUpdate = Validation.validate(UserValidation.UPDATE, req);

        if (validateUpdate.username) {
            const isUsernameExist = await prisma.user.findUnique({
               where: {
                   username: validateUpdate.username
               }
            });
            if (isUsernameExist) throw new ResponseError(409, 'Username already exists');
            user.username = validateUpdate.username;
        }

        if (validateUpdate.email) {
            const isEmailExist = await prisma.user.findUnique({
                where: {
                    email: validateUpdate.email
                }
            });
            if (isEmailExist) throw new ResponseError(409, 'Email already exists');
            user.email = validateUpdate.email;
        }

        if (validateUpdate.password) {
            user.password = await argon2.hash(validateUpdate.password);
        }

        const updateUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: user
        });

        return toUserResponse(updateUser);

    }

    static async deleteUser(user:User) : Promise<UserResponse> {
        const deleteUser = await prisma.user.delete({
            where: {
                id: user.id
            }
        });

        return toUserResponse(deleteUser);
    }

}