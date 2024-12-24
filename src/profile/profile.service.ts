import { Injectable } from '@nestjs/common';
import { UpdateStudentProfileDto } from './dto/update-profile.dto';
import { StudentProfile } from './entities/student-profile.entity';
import { GetStudentProfileDto } from './dto/get-profile.dto';
import { Op } from 'sequelize';
import { CreateJoinTeacherSubjectLevel, DeleteJoinTeacherSubjectLevel, GetTeacherProfileDto, UpdateTeacherProfileDto } from './dto/teacher-profile.dto';
import { TeacherProfile } from './entities/teacher-profile.entity';
import { JoinTeacherSubjectLevel } from './entities/join-teacher-subject-level.entity';


export class ProfileService {

    //teacher management
    async deleteJoinTeacherSubjectLevel(deleteJoinTeacherSubjectLevelDto: DeleteJoinTeacherSubjectLevel, req: any) {
        try {
            await JoinTeacherSubjectLevel.destroy({
                where: {
                    level_id: {
                        [Op.eq]: deleteJoinTeacherSubjectLevelDto.level_id
                    },
                    subject_id: {
                        [Op.eq]: deleteJoinTeacherSubjectLevelDto.subject_id
                    },
                    teacher_id: {
                        [Op.eq]: deleteJoinTeacherSubjectLevelDto.teacher_id
                    },
                }
            })
            return {
                statusCode: 200,
                message: "teacher subject leve join deleted successfully",

            }
        } catch (error) {
            throw new Error("failed to delete teacher subject level join")
        }
    }

    async createJoinTeacherSubjectLevel(createJoinTeacherSubjectLevelDto: CreateJoinTeacherSubjectLevel, req: any) {
        try {

            const join_already_exist = await JoinTeacherSubjectLevel.findOne({
                where: {
                    level_id: {
                        [Op.eq]: createJoinTeacherSubjectLevelDto.level_id
                    },
                    subject_id: {
                        [Op.eq]: createJoinTeacherSubjectLevelDto.subject_id
                    },
                    teacher_id: {
                        [Op.eq]: createJoinTeacherSubjectLevelDto.teacher_id
                    },
                }
            })

            if (!join_already_exist) {
                await JoinTeacherSubjectLevel.create({
                    level_id: createJoinTeacherSubjectLevelDto.level_id,
                    subject_id: createJoinTeacherSubjectLevelDto.subject_id,
                    teacher_id: createJoinTeacherSubjectLevelDto.teacher_id
                })

                return {
                    statusCode: 200,
                    message: "teacher level subject join created successfully",

                }
            } else {
                throw new Error("Teacher level subject join already exist")
            }


        } catch (error) {
            throw new Error("Error creating teacher level subject join")
        }
    }


    async getTeacherProfile(getTeacherProfile: GetTeacherProfileDto, req: any) {
        try {
            const get_profile = await TeacherProfile.findOne({
                where: {
                    user_id: getTeacherProfile.user_id
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

    async updateTeacherProfile(updateTeacherProfile: UpdateTeacherProfileDto, req: any) {
        try {
            const update_profile = await TeacherProfile.update({
                title: updateTeacherProfile.title

            }, {
                where: {
                    user_id: {
                        [Op.eq]: updateTeacherProfile.user_id
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


    //student management
    async getStudentProfile(getProfileDto: GetStudentProfileDto, req: any) {
        try {
            const get_profile = await StudentProfile.findOne({
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


    async updateStudentProfile(updateProfileDto: UpdateStudentProfileDto, req: any) {
        try {
            const update_profile = await StudentProfile.update({
                level_id: updateProfileDto.level_id,
                user_roll_no: updateProfileDto.user_roll_no

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
