import { Op } from "sequelize";
import { API } from "./entities/api.entity";
import { GetVoiceModelDto, UpdateApiKeyDto } from "./dto/update-api.dto";
import { AdminProfile } from "src/profile/entities/admin-profile.entity";
import axios from "axios";


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


    async getVoiceModel(getVoiceModelDto: GetVoiceModelDto) {
        try {
            const response = await axios.get(`https://api.deepgram.com/v1/models/${getVoiceModelDto.model_id}`);

            return {
                statusCode: 200,
                data: response?.data
            }
        } catch (error) {
            throw new Error("failed gettting model")
        }
    }

    async getDeepGramModels(req: any) {
        try {
            const response = await axios.get(
                "https://api.deepgram.com/v1/models", // Deepgram API endpoint
                // {
                //     headers: {
                //         "Authorization": `Token YOUR_DEEPGRAM_API_KEY`, // Replace with your API key
                //         "Content-Type": "multipart/form-data",
                //     },
                // }
            );
            console.log(response)
            return {
                statusCode: 200,
                api: response?.data
            }
        } catch (error) {
            throw new Error("failed gettting models")
        }
    }

    async getDeepGramApi(req: any) {
        try {
            const data = await AdminProfile.findOne({
                attributes: ["deepgram"]
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
            const data = await AdminProfile.findAll({
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
            if (updateApiKeyDto.api_name == "openai") {
                await AdminProfile.update({
                    openai: updateApiKeyDto.api_key,
                },
                    {
                        where: {
                            user_id: req.user.sub,

                        }
                    })

            }

            if (updateApiKeyDto.api_name == "dalle") {
                await AdminProfile.update({
                    dalle: updateApiKeyDto.api_key,
                },
                    {
                        where: {
                            user_id: req.user.sub,

                        }
                    })
            }
            if (updateApiKeyDto.api_name == "deepgram") {
                await AdminProfile.update({
                    deepgram: updateApiKeyDto.api_key,
                },
                    {
                        where: {
                            user_id: req.user.sub,

                        }
                    })
            }
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
