import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Form, Field } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { validateRequired, composeValidators, validateAlphaNumeric } from "utils/validators";

import { ConnectorModel } from "models/connectors";

import { actions as discoveryActions, selectors as discoverySelectors } from "ducks/discoveries";
import { actions as connectorActions } from "ducks/connectors";

import { mutators } from "utils/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes";

import Select from "react-select";
import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";


interface FormValues {
   name: string | undefined;
   discoveryProvider: { value: string; label: string } | undefined;
   storeKind: { value: string; label: string } | undefined;
}

export interface Props {
   title: string | JSX.Element;
}

export default function DiscoveryForm({
   title
}: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const discoverySelector = useSelector(discoverySelectors.discovery);
   const discoveryProviders = useSelector(discoverySelectors.discoveryProviders);
   const discoveryProviderAttributeDescriptors = useSelector(discoverySelectors.discoveryProviderAttributeDescriptors);

   const isFetchingDiscoveryDetail = useSelector(discoverySelectors.isFetchingDetail);
   const isFetchingDiscoveryProviders = useSelector(discoverySelectors.isFetchingDiscoveryProviders);
   const isFetchingAttributeDescriptors = useSelector(discoverySelectors.isFetchingDiscoveryProviderAttributeDescriptors);
   const isCreating = useSelector(discoverySelectors.isCreating);

   const [init, setInit] = useState(true);

   const [discoveryProvider, setDiscoveryProvider] = useState<ConnectorModel>();

   const isBusy = useMemo(
      () => isFetchingDiscoveryDetail || isFetchingDiscoveryProviders || isCreating || isFetchingAttributeDescriptors,
      [isFetchingDiscoveryDetail, isFetchingDiscoveryProviders, isCreating, isFetchingAttributeDescriptors]
   );

   useEffect(

      () => {

         if (init) {
            dispatch(discoveryActions.resetState());
            dispatch(connectorActions.clearCallbackData());
            setInit(false);
         }

         if (init) {
            dispatch(discoveryActions.listDiscoveryProviders());
         }

      },
      [dispatch, params.id, discoverySelector, discoveryProviders, isFetchingDiscoveryProviders, init]

   );


   const onDiscoveryProviderChange = useCallback(

      (event) => {

         dispatch(discoveryActions.clearDiscoveryProviderAttributeDescriptors());

         if (!event.value || !discoveryProviders) return;
         const provider = discoveryProviders.find(p => p.uuid === event.value);

         if (!provider) return;
         setDiscoveryProvider(provider);

      },
      [dispatch, discoveryProviders]

   );


   const onKindChange = useCallback(

      (event) => {

         if (!event.value || !discoveryProvider) return;
         dispatch(discoveryActions.getDiscoveryProviderAttributesDescriptors({ uuid: discoveryProvider.uuid, kind: event.value }));

      },
      [dispatch, discoveryProvider]

   );


   const onSubmit = useCallback(

      (values: FormValues, form: any) => {
         dispatch(discoveryActions.createDiscovery({
            name: values.name!,
            connectorUuid: values.discoveryProvider!.value,
            kind: values.storeKind?.value!,
            attributes: collectFormAttributes("discovery", discoveryProviderAttributeDescriptors, values)
         }));

      },
      [dispatch, discoveryProviderAttributeDescriptors]
   );


   const onCancel = useCallback(
      () => {
         history.goBack();
      },
      [history]
   )


   const submitTitle = "Create";
   const inProgressTitle = "Creating...";

   const optionsForDiscoveryProviders = useMemo(

      () => discoveryProviders?.map(
         provider => ({
            label: provider.name,
            value: provider.uuid,
         })
      ),
      [discoveryProviders]

   );


   const optionsForKinds = useMemo(

      () => discoveryProvider?.functionGroups.find(
         fg => fg.functionGroupCode === "discoveryProvider"
      )?.kinds.map(
         kind => ({
            label: kind,
            value: kind
         })
      ) ?? [],
      [discoveryProvider]

   );


   return (

      <Widget title={title} busy={isBusy}>

         <Form onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, pristine, submitting, values, valid, form }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">Discovery Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Enter the Discovery Name"
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>
                     )}

                  </Field>

                  <Field name="discoveryProvider" validate={validateRequired()}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="discoveryProvider">Discovery Provider</Label>

                           <Select
                              {...input}
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={optionsForDiscoveryProviders}
                              placeholder="Select Discovery Provider"
                              onChange={(event) => { onDiscoveryProviderChange(event); form.mutators.clearAttributes(); form.mutators.setAttribute("storeKind", undefined); input.onChange(event); }}
                              styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           />

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                        </FormGroup>

                     )}

                  </Field>

                  {discoveryProvider ? <Field name="storeKind" validate={validateRequired()}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="storeKind">Kind</Label>

                           <Select
                              {...input}
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={optionsForKinds}
                              placeholder="Select Kind"
                              onChange={(event) => { onKindChange(event); input.onChange(event); }}
                              styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           />

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>Required Field</div>

                        </FormGroup>
                     )}
                  </Field> : undefined}



                  {discoveryProvider && values.storeKind && discoveryProviderAttributeDescriptors && discoveryProviderAttributeDescriptors.length > 0 ? (

                     <>
                        <hr />
                        <h6>Discovery Attributes</h6>
                        <hr />

                        <AttributeEditor
                           id="discovery"
                           attributeDescriptors={discoveryProviderAttributeDescriptors}
                           connectorUuid={discoveryProvider.uuid}
                           functionGroupCode={"discoveryProvider"}
                           kind={values.storeKind.value}
                        />
                     </>

                  ) : null}

                  {

                     <div className="d-flex justify-content-end">

                        <ButtonGroup>

                           <ProgressButton
                              title={submitTitle}
                              inProgressTitle={inProgressTitle}
                              inProgress={submitting}
                              disabled={pristine || !valid}
                           />

                           <Button
                              color="default"
                              onClick={onCancel}
                              disabled={submitting}
                           >
                              Cancel
                           </Button>

                        </ButtonGroup>

                     </div>
                  }

               </BootstrapForm>
            )}
         </Form>

      </Widget>

   );

}
