import { Observable } from "rxjs";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";

import * as model from "./model";
import { CertificateIssuanceDTO } from "./model";
import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { CertificateRevocationReason } from "types/certificate";

const baseUrl = "/v2/operations";

export class OperationsBackend implements model.OperationsApi {


   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


   issueCertificate(
      raProfileUuid: string,
      pkcs10: string,
      attributes: AttributeDTO[],
      authorityUuid: string
   ): Observable<{ uuid: string, certificateData: string }> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/authorities/${authorityUuid}/raProfiles/${raProfileUuid}/certificates`, "POST", {
            raProfileUuid,
            pkcs10,
            attributes,
         })
      );

   }


   revokeCertificate(
      uuid: string,
      raProfileUuid: string,
      reason: CertificateRevocationReason,
      attributes: AttributeDTO[],
      authorityUuid: string
   ): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/authorities/${authorityUuid}/raProfiles/${raProfileUuid}/certificates/${uuid}/revoke`,
            "POST",
            {
               reason,
               attributes,
            }
         )
      );

   }


   renewCertificate(
      uuid: string,
      raProfileUuid: string,
      pkcs10: string,
      authorityUuid: string
   ): Observable<CertificateIssuanceDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/authorities/${authorityUuid}/raProfiles/${raProfileUuid}/certificates/${uuid}/renew`,
            "POST",
            {
               pkcs10,
            }
         )
      );

   }


   getIssuanceAttributes(raProfileUuid: string, authorityUuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/authorities/${authorityUuid}/raProfiles/${raProfileUuid}/attributes/issue`,
            "GET"
         )
      );
   }


   getRevocationAttributes(raProfileUuid: string, authorityUuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/authorities/${authorityUuid}/raProfiles/${raProfileUuid}/attributes/revoke`,
            "GET"
         )
      );
   }

}