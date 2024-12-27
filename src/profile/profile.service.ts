import { Injectable } from '@nestjs/common';
import { UpdateStudentProfileDto } from './dto/update-profile.dto';
import { StudentProfile } from './entities/student-profile.entity';
import { GetStudentProfileDto } from './dto/get-profile.dto';
import { Op } from 'sequelize';
import { CreateJoinTeacherSubjectLevel, DeleteJoinTeacherSubjectLevel, GetJoinsTeacherSubjectLevelDto, GetTeacherProfileDto, UpdateTeacherProfileDto } from './dto/teacher-profile.dto';
import { TeacherProfile } from './entities/teacher-profile.entity';
import { JoinTeacherSubjectLevel } from './entities/join-teacher-subject-level.entity';
import { GetStudentsByLevelDto } from './dto/get-student.dto';
import { UpdateAdminDto } from './dto/admin.dto';
import { AdminProfile } from './entities/admin-profile.entity';


export class ProfileService {

    async getAdminProfile(req: any) {
        try {
            const admin_profile = await AdminProfile.findOne({
                where: {
                    user_id: {
                        [Op.eq]: req.user.sub
                    }
                }
            })
            return {
                statusCode: 200,
                data: admin_profile

            }
        } catch (error) {
            throw new Error("failed to fetch admin profile")
        }
    }

    async updateAdmin(updateAdminProfileDto: UpdateAdminDto, req: any) {

        try {
            const admin_profile_exist = await AdminProfile.findOne({
                where: {
                    user_id: {
                        [Op.eq]: req.user.sub
                    }
                }
            })

            if (!admin_profile_exist) {
                await AdminProfile.create({
                    openai: updateAdminProfileDto.openai,
                    dalle: updateAdminProfileDto.dalle,
                    deepgram: updateAdminProfileDto.deepgram,
                    master_prompt: updateAdminProfileDto.master_prompt,
                    user_id: req.user.sub
                })
            }
            await AdminProfile.update({
                openai: updateAdminProfileDto.openai,
                dalle: updateAdminProfileDto.dalle,
                deepgram: updateAdminProfileDto.deepgram,
                master_prompt: updateAdminProfileDto.master_prompt
            }, {
                where: {
                    user_id: {
                        [Op.eq]: req.user.sub
                    }
                }
            })
            return {
                statusCode: 200,
                message: "admin updated successfully",

            }
        } catch (error) {
            throw new Error("failed to update admin")
        }
    }

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

    async getJoinTeacherSubjectLevel(getJoinTeacherSubjectLevelDto: GetJoinsTeacherSubjectLevelDto, req: any) {
        try {

            const teacher_data = await TeacherProfile.findOne({
                where: {
                    user_id: {
                        [Op.eq]: getJoinTeacherSubjectLevelDto.user_id
                    }
                }
            }).then(async (teacher) => {
                const data = await JoinTeacherSubjectLevel.findAll({
                    where: {

                        teacher_id: {
                            [Op.eq]: teacher.id
                        },
                    }
                })

                return data

            })
            return {
                statusCode: 200,
                data: teacher_data
            }
        } catch (error) {
            console.log(error)
            throw new Error("failed to get teacher subject level join")
        }
    }

    async createJoinTeacherSubjectLevel(createJoinTeacherSubjectLevelDto: CreateJoinTeacherSubjectLevel, req: any) {
        try {

            createJoinTeacherSubjectLevelDto.subject_id.forEach(async (id) => {
                const join_already_exist = await JoinTeacherSubjectLevel.findOne({
                    where: {
                        level_id: {
                            [Op.eq]: createJoinTeacherSubjectLevelDto.level_id
                        },
                        subject_id: {
                            [Op.eq]: Number(id)
                        },
                        teacher_id: {
                            [Op.eq]: createJoinTeacherSubjectLevelDto.teacher_id
                        },
                    }
                })

                if (!join_already_exist) {
                    await JoinTeacherSubjectLevel.create({
                        level_id: createJoinTeacherSubjectLevelDto.level_id,
                        subject_id: Number(id),
                        teacher_id: createJoinTeacherSubjectLevelDto.teacher_id
                    })

                }

            })

            return {
                statusCode: 200,
                message: "teacher level subject join created successfully",

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
                title: updateTeacherProfile.title,
                level_id: updateTeacherProfile.level_id

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

    async getStudentsByLevel(req: any) {
        try {

            const data = await TeacherProfile.findOne({
                where: {
                    user_id: {
                        [Op.eq]: req.user.sub
                    }
                }
            }).then(async (teacher) => {
                const students = await StudentProfile.findAll({

                    where: {
                        level_id: {
                            [Op.eq]: teacher.level_id
                        }
                    }
                })

                return students
            })


            return {
                statusCode: 200,
                data: data
            }
        } catch (error) {
            throw new Error("Error getting students by level")
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
