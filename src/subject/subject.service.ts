
import { JoinTeacherSubjectLevel } from 'src/profile/entities/join-teacher-subject-level.entity';
import { GetSubjectDto, UpdateSubjectDto, CreateSubjectDto, GetSubjectByLevelDto } from './dto/subject.dto';
import { Subject } from './entity/subject.entity';
import { Op } from 'sequelize';
export class SubjectService {

    async getSubjectsByTeacher(req: any) {
        try {

            await JoinTeacherSubjectLevel.findAll({
                attributes: ["subject_id"],
                where: {
                    teacher_id: {
                        [Op.eq]: req.user.sub
                    }
                }
            }).then(async (assigned_subjects) => {
                const subjects_by_teaher = await Subject.findAll({
                    where: {
                        id: {
                            [Op.in]: assigned_subjects.map(({ subject_id }) => subject_id)
                        }
                    }
                })

                return {
                    statusCode: 200,
                    data: subjects_by_teaher
                }
            }).catch(() => {
                throw new Error("Error fetching subjects by teacher")
            })

        } catch (error) {
            throw new Error("failed to get a subject")
        }
    }



    async getSubjectsByLevel(getSubjectByLevelDto: GetSubjectByLevelDto, req: any) {
        try {
            console.log("subject [patload", getSubjectByLevelDto)
            const subjects_data = await Subject.findAll({
                where: {
                    level_id: {
                        [Op.eq]: getSubjectByLevelDto.level_id
                    }
                }
            })
            console.log(subjects_data)
            return {
                statusCode: 200,
                data: subjects_data
            }

        } catch (error) {
            throw new Error("failed to get all subjects by level")
        }
    }

    async getSubject(getSubjectDto: GetSubjectDto, req: any) {
        try {

            const subject = await Subject.findByPk(getSubjectDto.subject_id)

            return {
                statusCode: 200,
                data: subject
            }

        } catch (error) {
            throw new Error("failed to get a subject")
        }
    }

    async getAllSubjects(req: any) {
        console.log("sbuject coming here")
        try {

            const subjects_data = await Subject.findAll()

            return {
                statusCode: 200,
                data: subjects_data
            }

        } catch (error) {
            throw new Error("failed to get all subjects")
        }
    }
    async updateSubject(updateSubectDto: UpdateSubjectDto, req: any) {
        try {

            await Subject.update({
                title:updateSubectDto.title,
                display_title: updateSubectDto.display_title,
                description: updateSubectDto.description,
                level_id: updateSubectDto.level_id
            }, {
                where: {

                    id: {
                        [Op.eq]: updateSubectDto.id
                    }
                }
            })

            return {
                statusCode: 200,
                message: "success updating new subject"
            }

        } catch (error) {
            throw new Error("failed to updating new subject")
        }
    }

    async createSubject(createSubjectDto: CreateSubjectDto, req: any) {
        try {
console.log("subject creae")
            await Subject.create({
                title: createSubjectDto.title,
                display_title: createSubjectDto.display_title,
                description: createSubjectDto.description,
                level_id: createSubjectDto.level_id
            })

            return {
                statusCode: 200,
                message: "success creating new subject"
            }

        } catch (error) {
            throw new Error("failed to create new subject")
        }
    }
}
