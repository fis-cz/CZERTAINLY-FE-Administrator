import CertificateAttributes from "components/CertificateAttributes";
import { CertificateModel } from "models";
import { useCallback, useState } from "react";
import { Button, ButtonGroup, Col, FormGroup, FormText, Input, Label, Row } from "reactstrap";
import { getCertificateInformation } from "utils/certificate";

interface Props {
   onCancel: () => void;
   onUpload: (data: { fileContent: string, fileName: string, contentType: string, certificate: CertificateModel }) => void;
   okButtonTitle?: string;
}

export default function CertificateUploadDialog({
   onCancel,
   onUpload,
   okButtonTitle = "Upload"
}: Props) {

   const [fileName, setFileName] = useState("");
   const [contentType, setContentType] = useState("");
   const [file, setFile] = useState<string>("");

   const [error, setError] = useState<string>("");

   const [certificate, setCertificate] = useState<CertificateModel | undefined>();


   const onFileLoaded = useCallback(

      (data, fileName) => {

         const fileInfo = data.target!.result as string;

         const contentType = fileInfo.split(",")[0].split(":")[1].split(";")[0];
         const fileContent = fileInfo.split(",")[1];

         setFileName(fileName);
         setContentType(contentType);

         let b64decoded: string;

         try {
            b64decoded = atob(fileContent);
            setFile(b64decoded.includes("-----BEGIN CERTIFICATE-----") ? b64decoded : fileContent);
         } catch (e) {
            setError("Failed to decode passed file. Certificate will not be shown.");
            setFile("base64:" + fileContent);
            setCertificate(undefined);
            return;
         }

         let crt: CertificateModel | undefined = undefined;

         try {
            crt = getCertificateInformation(b64decoded);
         } catch (e) {

            try {
               crt = getCertificateInformation(btoa(b64decoded));
            } catch (e) {
            }

         }

         if (!crt) {
            setError("Failed to decode passed file. Certificate will not be shown.");
         } else {
            setError("");
         }

         setCertificate(crt);

      },
      []

   );


   const onFileChanged = useCallback(

      (e: React.ChangeEvent<HTMLInputElement>) => {

         if (!e.target.files || e.target.files.length === 0) return;

         const fileName = e.target.files[0].name;

         const reader = new FileReader();
         reader.readAsDataURL(e.target.files[0]);
         reader.onload = (data) => onFileLoaded(data, fileName);

      },
      [onFileLoaded]

   )


   const onFileDrop = useCallback(

      (e: React.DragEvent<HTMLInputElement>) => {

         e.preventDefault();

         if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

         const fileName = e.dataTransfer.files[0].name;

         const reader = new FileReader();
         reader.readAsDataURL(e.dataTransfer.files[0]);
         reader.onload = (data) => { onFileLoaded(data, fileName); }

      },
      [onFileLoaded]

   )


   const onFileDragOver = useCallback(

      (e: React.DragEvent<HTMLInputElement>) => {

         e.preventDefault();
      },
      []

   )

   return (

      <div>

         <div className="border border-light rounded mb-0" style={{ padding: "1em", borderStyle: "dashed", borderWidth: "2px" }} onDrop={onFileDrop} onDragOver={onFileDragOver}>

            <Row>

               <Col>

                  <FormGroup>

                     <Label for="fileName">File name</Label>

                     <Input
                        id="fileName"
                        type="text"
                        placeholder="File not selected"
                        disabled={true}
                        style={{ textAlign: "center" }}
                        value={fileName}
                     />

                  </FormGroup>

               </Col>

               <Col>

                  <FormGroup>

                     <Label for="contentType">Content type</Label>

                     <Input
                        id="contentType"
                        type="text"
                        placeholder="File not selected"
                        disabled={true}
                        style={{ textAlign: "center" }}
                        value={contentType}
                     />

                  </FormGroup>

               </Col>

            </Row>


            <FormGroup>

               <Label for="fileContent">File content</Label>

               <Input
                  id="fileContent"
                  type="textarea"
                  rows={10}
                  placeholder={`Select or drag & drop a certificate File`}
                  readOnly={true}
                  value={file}
               />

            </FormGroup>

            <FormGroup style={{ textAlign: "right" }}>

               <Label className="btn btn-default" for="file" style={{ margin: 0 }}>Select file...</Label>

               <Input id="file" type="file" style={{ display: "none" }} onChange={onFileChanged} />

            </FormGroup>

            <div className="text-muted" style={{ textAlign: "center", flexBasis: "100%", marginTop: "1rem" }}>
               Select or Drag &amp; Drop file to Drop Zone.
            </div>

         </div>

         {error && <><br /><div className="text-muted" style={{ textAlign: "center" }}>{error}</div><FormText style={{ textAlign: "center" }}>Possibly the certificate can be decoded on the server side</FormText></>}

         {certificate && <><br /><CertificateAttributes certificate={certificate} /></>}

         <br />

         <div className="d-flex justify-content-end">

            <ButtonGroup>

               <Button
                  color="primary"
                  onClick={() => onUpload({ fileContent: file, fileName, contentType, certificate: certificate! })}
                  disabled={!file}
               >
                  {okButtonTitle}
               </Button>

               <Button
                  color="default"
                  onClick={onCancel}
               >
                  Cancel
               </Button>



            </ButtonGroup>

         </div>


      </div>

   );

}