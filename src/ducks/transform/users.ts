import { UserCertificateDTO, UserDetailDTO, UserDTO } from "api/users";
import { UserCertificateModel, UserDetailModel, UserModel } from "models";
import { transformRoleDTOToModel } from "./roles";


export function transformUserCertificateDTOToModel(certificate: UserCertificateDTO): UserCertificateModel | undefined {

   return certificate ? {
      uuid: certificate.uuid,
      fingerprint: certificate.fingerprint,
   } : undefined;

}


export function transformUserDetailDTOToModel(user: UserDetailDTO): UserDetailModel {

   return {
      uuid: user.uuid,
      username: user.username,
      description: user.description,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      enabled: user.enabled,
      systemUser: user.systemUser,
      certificate: transformUserCertificateDTOToModel(user.certificate),
      roles: user.roles.map(role => transformRoleDTOToModel(role))
   }

}


export function transformUserDTOToModel(user: UserDTO): UserModel {

   return {
      uuid: user.uuid,
      username: user.username,
      description: user.description,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      enabled: user.enabled,
      systemUser: user.systemUser,
   }

}
