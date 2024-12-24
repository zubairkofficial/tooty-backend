
import { GetSubjectDto, UpdateSubjectDto, CreateSubjectDto } from './dto/subject.dto';
import { Subject } from './entity/subject.entity';
import { Op } from 'sequelize';
export class SubjectService {
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

                display_title: updateSubectDto.display_title,
                description: updateSubectDto.description
            }, {
                where: {
                    title: {
                        [Op.eq]: updateSubectDto.title
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

            await Subject.create({
                title: createSubjectDto.title,
                display_title: createSubjectDto.display_title,
                description: createSubjectDto.description
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
