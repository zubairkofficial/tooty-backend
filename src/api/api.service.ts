import { AddAPIkeyDto } from "./dto/create-api.dto";
import { API } from "./entities/api.entity";


export class ApiService {

    async addAPIkey(addAPIkeyDto: AddAPIkeyDto, req: any) {
        try {
            await API.create({
                api_key: addAPIkeyDto.api_key,
                user_id: req.body.user.user_id //get it throough token validation
            })

            return {
                statusCode: 200,
                message: "api added successfully"
            }
        } catch (error) {
            throw new Error("failed adding api key")
        }

    }


    async updateApiKey(addAPIkeyDto: AddAPIkeyDto, req: any) {
        try {
            await API.update({
                api_key: addAPIkeyDto.api_key,
            },
                {
                    where: {
                        user_id: req.body.user.user_id
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

}
