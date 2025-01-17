import { FunctionGroupCode } from "types/connectors";
import { AttributeCallbackMappingTarget_AttributeCallbackModel, AttributeType, AttributeValue } from "types/attributes";
import { HttpMethod } from "ts-rest-client";


export interface AttributeContentDTO {
   [key: string]: AttributeValue;
   value: AttributeValue;
}


export interface AttibuteCallbackMappingDTO {
   from?: string;
   attributeType?: AttributeType;
   to: string;
   targets: AttributeCallbackMappingTarget_AttributeCallbackModel[];
   value?: any;
}


export interface AttributeCallbackDescriptorDTO {
   callbackContext: string;
   callbackMethod: HttpMethod;
   mappings: AttibuteCallbackMappingDTO[];
}


export interface AttributeDependencyDTO {
   name: string;
   value: string;
}


/**
 * Used to describe properties of particular object attributes (generate the form)
 */
export interface AttributeDescriptorDTO {
   uuid: string;
   type: AttributeType;
   name: string;
   label: string;
   description?: string;
   group?: string;
   required: boolean;
   readOnly: boolean;
   visible: boolean;
   list: boolean;
   multiSelect: boolean;
   validationRegex?: string;
   attributeCallback?: AttributeCallbackDescriptorDTO;
   content?: AttributeContentDTO | AttributeContentDTO[];
}


/**
 * Used to obtain complete list of named
 */
export type AttributeDescriptorCollectionDTO = {
   [functionGroup in FunctionGroupCode]?: {
      [kind: string]: AttributeDescriptorDTO[];
   }
}


/**
 * Used to get or set attributes of a particular object
 */
export interface AttributeDTO {
   uuid?: string;
   name: string;
   label?: string;
   type?: AttributeType;
   content?: AttributeContentDTO | AttributeContentDTO[];
}


