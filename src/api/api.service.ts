import { Op } from "sequelize";
import { API } from "./entities/api.entity";
import { UpdateApiKeyDto } from "./dto/update-api.dto";


export class ApiService {


    // async getApiKey(getApiKeyDto: getApiKeyDto, req: any) {

    //     console.log("get api name key",api_name)
    //     try {
    //         const data = await API.findOne({
    //             where: {
    //                 api_name: {
    //                     [Op.eq]: get
    //                 }
    //             }
    //         })
    //         return {
    //             statusCode: 200,
    //             api: data.api_key
    //         }
    //     } catch (error) {
    //         return {
    //             api: ""
    //         }
    //     }
    // }

    async getDeepGramApi(req: any) {
        try {
            const data = await API.findOne({
                where: {
                    api_name: {
                        [Op.eq]: "deepgram"
                    }
                }
            })
            return {
                statusCode: 200,
                api: data
            }
        } catch (error) {
            throw new Error("failed gettting api key")
        }
    }

    async getAllApiKeys(req: any) {
        try {
            const data = await API.findAll({
                where: {
                    user_id: {
                        [Op.eq]: req.user.sub
                    }
                }
            })
            return {
                statusCode: 200,
                apis: data
            }
        } catch (error) {
            throw new Error("failed gettting api keys")
        }
    }

    // async addAPIkey(addAPIkeyDto: AddAPIkeyDto, req: any) {
    //     try {
    //         await API.create({
    //             api_key: addAPIkeyDto.api_key,
    //             api_name: addAPIkeyDto.api_name + "-" + req.user.sub,
    //             user_id: req.user.sub //get it throough token validation
    //         })

    //         return {
    //             statusCode: 200,
    //             message: "api added successfully"
    //         }
    //     } catch (error) {
    //         throw new Error("failed adding api key")
    //     }
    // }


    async updateApiKey(updateApiKeyDto: UpdateApiKeyDto, req: any) {
        try {
            await API.update({
                api_key: updateApiKeyDto.api_key,
            },
                {
                    where: {
                        user_id: req.user.sub,
                        id: updateApiKeyDto.id
                    }
                })
            return {
                statusCode: 200,
                message: "api updated successfully"
            }
        } catch (error) {
            throw new Error("failed updating api key")
        }

    }
    // async deleteApiKey(deleteApiKeyDto: DeleteApiKeyDto, req: any) {
    //     try {
    //         await API.destroy({
    //             where: {
    //                 id: {
    //                     [Op.eq]: deleteApiKeyDto.id
    //                 }
    //             }
    //         })
    //         return {
    //             statusCode: 200,
    //             message: "api deleted successfully"
    //         }
    //     } catch (error) {
    //         throw new Error("failed deleting api key")
    //     }

    // }

}
