import { CreateLevelDto, GetLevelDto, UpdateLevelDto } from './dto/level.dto';
import { Level } from './entity/level.entity';
import { Op } from 'sequelize';


export class LevelService {


    async getLevel(getLevelDto: GetLevelDto, req: any) {
        try {

            const level_data = await Level.findByPk(getLevelDto.level_id)

            return {
                statusCode: 200,
                data: level_data
            }

        } catch (error) {
            throw new Error("failed to get a level")
        }
    }

    async getAllLevels(req: any) {
        try {

            const levels_data = await Level.findAll()

            return {
                statusCode: 200,
                data: levels_data
            }

        } catch (error) {
            throw new Error("failed to get all levels")
        }
    }
    async updateLevel(updateLevelDto: UpdateLevelDto, req: any) {
        try {

            await Level.update({
                level: updateLevelDto.level,
                description: updateLevelDto.description
            }, {
                where: {
                    level: {
                        [Op.eq]: updateLevelDto.level
                    }
                }
            })

            return {
                statusCode: 200,
                message: "success updating new level"
            }

        } catch (error) {
            throw new Error("failed to updating new level")
        }
    }

    async createLevel(createLevelDto: CreateLevelDto, req: any) {
        try {

            await Level.create({
                level: createLevelDto.level,
                description: createLevelDto.description
            })

            return {
                statusCode: 200,
                message: "success creating new level"
            }

        } catch (error) {
            throw new Error("failed to create new level")
        }
    }



}
