import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { GetProfileDto } from './dto/get-profile.dto';
import { Op } from 'sequelize';


export class ProfileService {


    async getProfile(getProfileDto: GetProfileDto, req: any) {
        try {
            const get_profile = await Profile.findOne({
                where: {
                    user_id: getProfileDto.user_id
                }
            });
            console.log("proflie ", get_profile)

            return {
                statusCode: 200,
                data: get_profile
            }

        } catch (error) {
            console.log(error)
            throw new Error('error getting profile')
        }
    }


    async updateProfile(updateProfileDto: UpdateProfileDto, req: any) {
        try {
            const update_profile = await Profile.update({
                level: updateProfileDto.level,

            }, {
                where: {
                    user_id: {
                        [Op.eq]: updateProfileDto.user_id
                    }
                }
            });
            console.log("proflie updated", update_profile)

            return {
                statusCode: 200,
                message: "profile updated successfully",
                data: update_profile
            }

        } catch (error) {
            console.log(error)
            throw new Error('error updating profile')
        }
    }

}
