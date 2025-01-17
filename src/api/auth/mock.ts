import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { dbData } from 'mocks/db';
import { randomDelay } from 'utils/mock';
import * as model from './model';
import { UserDetailDTO } from 'api/users';


export class AuthMock implements model.AuthApi {


   profile(): Observable<UserDetailDTO> {

      return of(
         dbData.users[0]
      ).pipe(

         delay(randomDelay()),
         map(
            user => user
         ),
      );

   }


   updateProfile(user: model.ProfileDetailDTO): Observable<UserDetailDTO> {

      return of(
         dbData.users[0]
      ).pipe(

         delay(randomDelay()),

      );

   }


   getAllResources(): Observable<model.ResourceDetailDTO[]> {

      return of(
         []
      ).pipe(

         delay(randomDelay()),
         map(

            resources => resources

         ),

      );
   }


   listObjects(endpoint: string): Observable<{ uuid: string; name: string; }[]> {

         return of(
            []
         ).pipe(

            delay(randomDelay())
         );

   }


}
