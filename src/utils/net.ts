import { Observable, from } from "rxjs";
import { HttpErrorResponse, StringMap } from "ts-rest-client";


export function createNewResource<T = any>(
   url: string,
   body: any,
   headers?: any
): Observable<T extends any ? T : (string | null)> {

   const apiUrl = (window as any).__ENV__.API_URL + url;

   return from(doFetch(apiUrl, body, headers));

}


async function doFetch<T>(
   url: string,
   body: any,
   headers?: any
): Promise<T> {

   let errorResponse = null;

   try {

      const response = await fetch(
         url,
         {

            body: JSON.stringify(body),
            headers: {
               "Content-Type": "application/json",
               ...(headers || {}),
            },
            method: "POST",

         }
      );


      if (response.ok) {
         return await getResponseBody(response);
      }

      const responseHeaders = {} as StringMap;

      if (response.headers) {
         response.headers.forEach((value, key) => (responseHeaders[key] = value));
      }

      const error = await getResponseBody(response);

      errorResponse = new HttpErrorResponse({
         headers: responseHeaders,
         status: response.status,
         statusText: response.statusText,
         url: response.url,
         error,
      });

   } catch (err) {

      let error: Event;

      if (err instanceof Event) {
         error = err;
      } else {
         error = new ErrorEvent("error", { error: err });
      }

      throw new HttpErrorResponse({
         error,
         url,
      });

   }

   throw errorResponse;

}


function getResponseBody(response: Response): Promise<any> {

   const contentType = response.headers.get("Content-Type");

   if (response.status === 204) return Promise.resolve(null);

   if (contentType?.includes("application/json")) return response.json();

   return response.text();

}


export function extractError(err: HttpErrorResponse, headline: string): string {

   if (!err.error) return headline;

   if (err.error instanceof Event) return `${headline}: Network connection failure`;

   if (err.status === 422) {
      if (typeof err.error === "string") return `${headline} ${err.error}`;
      return `${headline}. ${err.error.join(", ")}`;
   }

   if (err.error.message) {

      const jsons = /{[^}]*}/gm.exec(err.error.message);
      if (!jsons) return `${headline}: ${err.error.message}`;

      let msg: string = err.error.message.replace(/(<([^>]+)>)/ig, "");

      for (let i = 0; i < jsons.length; i++) {

         const json = JSON.parse(jsons[i]);

         let obj = "";

         Object.keys(json).forEach(
            key => {
               obj += `<br />${key === "message" ? "" : `${key}: `}${json[key]}<br />`;
            }
         );

         msg = msg.replace(/{[^}]*}/, obj);

      }

      msg = msg.replace(/\\n/g, "");

      return `${headline}: ${msg}`;

   }

   if (typeof err.error === "string") {

      try {
         const json = JSON.parse(err.error);
         if (json.message) return `${headline}: ${json.message}`;
      } catch (e) { }

      return `${headline}: ${err.error}`;
   }

   return headline;

}
