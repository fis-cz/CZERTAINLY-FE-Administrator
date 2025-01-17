import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";

import { Col, Container, Label, Row } from "reactstrap";

import { actions, selectors } from "ducks/discoveries";

import Widget from "components/Widget";
import Dialog from "components/Dialog";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import AttributeViewer from "components/Attributes/AttributeViewer";
import DiscoveryStatusBadge from "components/pages/discoveries/DiscoveryStatus";
import { dateFormatter } from "utils/dateUtil";

export default function DiscoveryDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const discovery = useSelector(selectors.discovery);

   const isFetching = useSelector(selectors.isFetchingDetail);
   const isDeleting = useSelector(selectors.isDeleting);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const isBusy = useMemo(
      () => isFetching || isDeleting,
      [isFetching, isDeleting]
   );


   useEffect(

      () => {

         if (!params.id) return;

         dispatch(actions.getDiscoveryDetail({ uuid: params.id }));

      },
      [dispatch, params.id]

   )


   const onDeleteConfirmed = useCallback(

      () => {

         if (!discovery) return;

         dispatch(actions.deleteDiscovery({ uuid: discovery.uuid }));
         setConfirmDelete(false);

      },
      [discovery, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      ],
      []

   );


   const discoveryTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Certificate Discovery <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ),
      [buttons]

   );

    const metaTitle = (
      <h5>
        <span className="fw-semi-bold">Meta Data</span>
      </h5>
    );

    const certificatesTitle = (
      <h5>
        <span className="fw-semi-bold">Discovered Certificates</span>
      </h5>
    );


   const detailHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "property",
            content: "Property",
         },
         {
            id: "value",
            content: "Value",
         },
      ],
      []

   );

   const certificateHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "commonName",
            content: "Common Name",
         },
         {
            id: "serialNumber",
            content: "Serial Number",
         },
         {
            id: "notAfter",
            content: "Not After",
         },
         {
            id: "notBefore",
            content: "Not Before",
         },
         {
            id: "issuerCommonName",
            content: "Issuer Common Name",
         },
         {
            id: "fingerprint",
            content: "Fingerprint",
         },
      ],
      []

   );

   const metaData: TableDataRow[] = useMemo(

      () => !discovery ? [] : Object.entries(discovery.meta).map(function([key, value]) {
         return (
            {
               id: key,
               columns: [key, value.toString()],
            }
         )
      }
      ),
      [discovery]
   )


   const certificateData: TableDataRow[] = useMemo(

      () => !discovery?.certificate ? [] : discovery.certificate.map(function(r:any) {
         return (
            {
               id: r.serialNumber + r.fingerprint,
               columns: [
                  r.commonName,
                  r.serialNumber,
                  <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(r.notAfter)}</span>,
                  <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(r.notBefore)}</span>,
                  r.issuerCommonName,
                  r.fingerprint,
               ],
            }
         )
      }
      ),
      [discovery?.certificate]
   )


   const detailData: TableDataRow[] = useMemo(

      () => !discovery ? [] : [

         {
            id: "uuid",
            columns: ["UUID", discovery.uuid],

         },
         {
            id: "name",
            columns: ["Name", discovery.name],
         },
         {
            id: "kind",
            columns: ["Kind", discovery.kind],
         },
         {
            id: "discoveryProviderUUID",
            columns: ["Discovery Provider UUID", discovery.connectorUuid],
         },
         {
            id: "discoveryProviderName",
            columns: ["Discovery Provider Name", discovery.connectorName],
         },
         {
            id: "status",
            columns: ["Status", <DiscoveryStatusBadge status={discovery.status} />],
         },
         {
            id: "startTime",
            columns: ["Discovery Start Time", <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(discovery.startTime)}</span>],
         },
         {
            id: "endTime",
            columns: ["Discovery End Time", <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(discovery.endTime)}</span>],
         },
         {
            id: "totalCertificatesDiscovered",
            columns: ["Total Certificates Discovered", discovery.totalCertificatesDiscovered?.toString() || "0"],
         },
         {
            id: "message",
            columns: ["Message", discovery.message || ""],
         },

      ],
      [discovery]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={discoveryTitle} busy={isBusy}>

            <br />

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>

         <Row xs="1" sm="1" md="2" lg="2" xl="2">
            <Col>
               <Widget title="Attributes">
                  <br />
                  <Label>Discovery Attributes</Label>
                  <AttributeViewer attributes={discovery?.attributes} />
               </Widget>
            </Col>
            <Col>
               <Widget title={metaTitle}>
                  <br />
                  <Label>Metadata</Label>
                  <CustomTable
                     headers={detailHeaders}
                     data={metaData}
                  />
               </Widget>
            </Col>
         </Row>

         <Widget title={certificatesTitle} busy={isBusy}>

            <br />

            <CustomTable
               hasPagination={true}
               headers={certificateHeaders}
               data={certificateData}
            />

         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption="Delete Certification Discovery"
            body="You are about to delete Discovery. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />
      </Container>

   )

}
