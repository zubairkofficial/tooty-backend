import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { API } from '../api/entities/api.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../utils/roles.enum';


export class UserSeeder {


    async seed() {
        const users = [
            {
                name: "John Doe",
                email: "admin@mail.com",
                contact: "12345678",
                password: "12345678",
                role: Role.ADMIN,
                isVerified: true,
            },
            {
                name: "John Doe",
                email: "teacher@mail.com",
                contact: "12345678",
                password: "12345678",
                role: Role.TEACHER,
                isVerified: true,
            },
        ];
        const apis = [
            "open-ai",
            "dalle",
            "deepgram"
        ]

        for (const user of users) {
            const existingUser = await User.findOne({
                where: { email: user.email },
            });

            if (!existingUser) {
                const u = await User.create(user);
                if (u.role == Role.ADMIN) {
                    for (const api in apis) {
                        await API.create({
                            api_key: "",
                            api_name: api + "-" + u.id,
                            user_id: u.id
                        })
                    }
                }
            }
        }

        console.log('User seeds executed successfully');
    }
}
