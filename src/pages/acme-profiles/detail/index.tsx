import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import { actions, selectors } from "ducks/acme-profiles";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import StatusBadge from "components/StatusBadge";
import AttributeViewer from "components/Attributes/AttributeViewer";


export default function AdministratorDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const history = useHistory();

   const acmeProfile = useSelector(selectors.acmeProfile);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isDisabling = useSelector(selectors.isDisabling);
   const isEnabling = useSelector(selectors.isEnabling);

   const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   const isBusy = useMemo(
      () => isFetchingDetail || isDisabling || isEnabling,
      [isFetchingDetail, isDisabling, isEnabling]
   );


   useEffect(

      () => {

         if (!params.id) return;

         dispatch(actions.getAcmeProfile({ uuid: params.id }));

      },
      [params.id, dispatch]
   );


   const onEditClick = useCallback(

      () => {

         history.push(`../../acmeprofiles/edit/${acmeProfile?.uuid}`);

      },
      [acmeProfile, history]

   );


   const onEnableClick = useCallback(

      () => {

         if (!acmeProfile) return;

         dispatch(actions.enableAcmeProfile({ uuid: acmeProfile.uuid }));

      },
      [acmeProfile, dispatch]

   );


   const onDisableClick = useCallback(

      () => {

         if (!acmeProfile) return;

         dispatch(actions.disableAcmeProfile({ uuid: acmeProfile.uuid }));

      },
      [acmeProfile, dispatch]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         if (!acmeProfile) return;

         dispatch(actions.deleteAcmeProfile({ uuid: acmeProfile.uuid }));
         setConfirmDelete(false);

      },
      [acmeProfile, dispatch]

   );

   const onForceDeleteAcmeProfile = useCallback(

      () => {

         if (!acmeProfile) return;

         dispatch(actions.bulkForceDeleteAcmeProfiles({ uuids: [acmeProfile.uuid], redirect: `../`}));

      },
      [acmeProfile, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: acmeProfile?.enabled || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !(acmeProfile?.enabled || false), tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [acmeProfile, onEditClick, onDisableClick, onEnableClick]

   );


   const detailsTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               ACME Profile <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ),
      [buttons]

   );


   const tableHeader: TableHeader[] = useMemo(

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


   const acmeProfileDetailData: TableDataRow[] = useMemo(

      () => !acmeProfile ? [] : [

         {
            id: "uuid",
            columns: ["UUID", acmeProfile.uuid]
         },
         {
            id: "name",
            columns: ["Name", acmeProfile.name]
         },
         {
            id: "description",
            columns: ["Description", acmeProfile.description || ""]
         },
         {
            id: "status",
            columns: ["Username", <StatusBadge enabled={acmeProfile.enabled} />]
         },
         {
            id: "websiteUrl",
            columns: ["Website URL", acmeProfile.websiteUrl || "N/A"]
         },
         {
            id: "retryInterval",
            columns: ["Retry Interval", `${acmeProfile.retryInterval || "N/A"} (seconds)`]
         },
         {
            id: "orderValidity",
            columns: ["Order Validity", `${acmeProfile.validity || "N/A"} (seconds)`]
         },
         {
            id: "directoryUrl",
            columns: ["Dierectory URL", acmeProfile.directoryUrl || "N/A"]
         },

      ],
      [acmeProfile]

   );


   const raProfileDetailData: TableDataRow[] = useMemo(

      () => !acmeProfile || !acmeProfile.raProfile ? [] : [

         {
            id: "uuid",
            columns: ["UUID", acmeProfile.raProfile.uuid]
         },
         {
            id: "name",
            columns: ["Name", acmeProfile.raProfile.name]
         },
         {
            id: "status",
            columns: ["Status", <StatusBadge enabled={acmeProfile.raProfile.enabled} />]
         },

      ],
      [acmeProfile]

   );


   const dnsData: TableDataRow[] = useMemo(

      () => !acmeProfile ? [] : [

         {
            id: "dnsResolverIpAddress",
            columns: ["DNS Resolver IP Address", acmeProfile.dnsResolverIp || "N/A"]
         },
         {
            id: "dnsResolverPort",
            columns: ["DNS Resolver Port", acmeProfile.dnsResolverPort || "N/A"]
         }

      ],
      [acmeProfile]

   );


   const termsOfServiceData: TableDataRow[] = useMemo(

      () => !acmeProfile ? [] : [

         {
            id: "termsOfServiceUrl",
            columns: ["Terms of Service URL", acmeProfile.termsOfServiceUrl || "N/A"]
         },
         {
            id: "changesToTermsOfServiceUrl",
            columns: ["Changes of Terms of Service URL", acmeProfile.termsOfServiceChangeUrl || "N/A"]
         },
         {
            id: "disableNewOrderPlacement",
            columns: ["Disable new Order placement? (due to change in Terms Of Service)", acmeProfile.termsOfServiceChangeDisable !== undefined ? acmeProfile.termsOfServiceChangeDisable ? "Yes" : "No" : "N/A"]
         },
         {
            id: "requireContact",
            columns: ["Require Contact information for new Accounts?", acmeProfile.requireContact !== undefined ? acmeProfile.requireContact ? "Yes" : "No" : "N/A"]
         },
         {
            id: "requireAgreement",
            columns: ["Require Agreement for new Accounts?", acmeProfile.requireTermsOfService !== undefined ? acmeProfile.requireTermsOfService ? "Yes" : "No" : "N/A"]
         }

      ],
      [acmeProfile]

   );


   return (

      <Container className="themed-container" fluid>

         <Row xs="1" sm="1" md="2" lg="2" xl="2">

            <Col>

               <Widget title={detailsTitle} busy={isBusy}>

                  <CustomTable
                     headers={tableHeader}
                     data={acmeProfileDetailData}
                  />

               </Widget>

            </Col>

            <Col>

               <Widget title="DNS" busy={isBusy}>

                  <CustomTable
                     headers={tableHeader}
                     data={dnsData}
                  />

               </Widget>

               <Widget title="Terms of Service" busy={isBusy}>

                  <CustomTable
                     headers={tableHeader}
                     data={termsOfServiceData}
                  />

               </Widget>


            </Col>

         </Row>




         <Widget title={raProfileDetailData.length > 0 ? "RA Profile Configuration" : "Default RA Profile not selected"} busy={isBusy}>

            {

               raProfileDetailData.length === 0 ? <></> : (

                  <>

                     <CustomTable
                        headers={tableHeader}
                        data={raProfileDetailData}
                     />

                     <Row xs="1" sm="1" md="2" lg="2" xl="2">

                        <Col>

                           {
                              (acmeProfile?.issueCertificateAttributes) === undefined || acmeProfile.issueCertificateAttributes.length === 0 ? <></> : (

                                 <Widget title="List of Attributes to Issue Certificate" busy={isBusy}>

                                    <AttributeViewer
                                       attributes={acmeProfile?.issueCertificateAttributes}
                                    />

                                 </Widget>

                              )
                           }

                        </Col>

                        <Col>

                           {
                              (acmeProfile?.revokeCertificateAttributes) === undefined || acmeProfile.revokeCertificateAttributes.length === 0 ? <></> : (

                                 <Widget title="List of Attributes to Revoke Certificate" busy={isBusy}>

                                    <AttributeViewer
                                       attributes={acmeProfile?.revokeCertificateAttributes}
                                    />

                                 </Widget>

                              )
                           }

                        </Col>

                     </Row>

                  </>

               )

            }

         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption="Delete ACME Profile"
            body="You are about to delete ACME Profile which may have associated ACME
                  Account(s). When deleted the ACME Account(s) will be revoked."
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={deleteErrorMessage.length > 0}
            caption="Delete ACME Profile"
            body={
               <>
                  Failed to delete the ACME Profile that has dependent objects.
                  Please find the details below:
                  <br />
                  <br />
                  {deleteErrorMessage}
               </>
            }
            toggle={() => dispatch(actions.clearDeleteErrorMessages())}
            buttons={[
               { color: "danger", onClick: onForceDeleteAcmeProfile, body: "Force" },
               { color: "secondary", onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: "Cancel" },
            ]}
         />


      </Container >
   );


}
