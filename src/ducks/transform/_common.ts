import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO"
import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel"

export function transformDeleteObjectErrorDtoToModel(error: DeleteObjectErrorDTO): DeleteObjectErrorModel {

   return {
      uuid: error.uuid,
      name: error.name,
      message: error.message
   }

}