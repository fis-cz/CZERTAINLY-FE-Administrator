import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

export const attributeFieldNameTransform: { [name: string]: string } = {
   name: "Name",
   credentialProvider: "Credential Provider",
   authorityProvider: "Authority Provider",
   discoveryProvider: "Discovery Provider",
   legacyAuthorityProvider: "Legacy Authority Provider",
   complianceProvider: "Compliance Provider",
   entityProvider: "Entity Provider"
};


export function collectFormAttributes(id: string, descriptors: AttributeDescriptorModel[] | undefined, values: Record<string, any>): AttributeModel[] {

   if (!descriptors || !values[`__attributes__${id}__`]) return [];

   const attributes = values[`__attributes__${id}__`];

   const attrs: AttributeModel[] = [];

   for (const attribute in attributes) {

      if (!attributes.hasOwnProperty(attribute)) continue;

      const info = attribute.split(":");

      const attributeName = info[0];
      // const attributeType = info[1];
      const attributeUuid = info.length === 3 ? info[2] : undefined;

      const descriptor = descriptors?.find(d => d.name === attributeName);

      if (!descriptor) continue;
      if (attributes[attribute] === undefined || attributes[attribute] === null) continue;

      let content: any;

      switch (descriptor.type) {


         case "BOOLEAN":

            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };

            break;


         case "INTEGER":

            if (descriptor.list) {
               if (Array.isArray(attributes[attribute]))
                  content = attributes[attribute].map((lv: any) => parseInt(lv.value));
               else
                  content = { value: parseInt(attributes[attribute].value.value) }
            } else {
               content = { value: parseInt(attributes[attribute]) };
            }

            break;


         case "FLOAT":
            if (descriptor.list) {
               if (Array.isArray(attributes[attribute]))
                  content = attributes[attribute].map((lv: any) => parseFloat(lv.value));
               else
                  content = { value: parseFloat(attributes[attribute].value.value) }
            } else {
               content = { value: parseFloat(attributes[attribute]) };
            }
            break;


         case "STRING":

            if (descriptor.list) {
               if (Array.isArray(attributes[attribute]))
                  content = attributes[attribute].map((lv: any) => lv.value);
               else
                  content = { value: attributes[attribute].value.value };
            } else {
               content = { value: attributes[attribute] };
            }

            break;


         case "TEXT":

            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };

            break;

         case "DATE":

            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: new Date(attributes[attribute]).toISOString() };

            break;


         case "TIME":

            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };

            break;


         case "DATETIME":

            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: new Date(attributes[attribute]).toISOString()};

            break;


         case "FILE":

            if (descriptor.list || descriptor.multiSelect) continue;
            content = attributes[attribute];

            break;


         case "SECRET":

            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };

            break;


         case "CREDENTIAL":

            if (descriptor.list) {
               if (Array.isArray(attributes[attribute]))
                  content = attributes[attribute].map((lv: any) => lv.value);
               else
                  content = attributes[attribute].value;
            } else {
               content = attributes[attribute];
            }

            break;


         case "JSON":

            if (descriptor.list) {
               if (Array.isArray(attributes[attribute])) {
                  content = attributes[attribute].map((lv: any) => lv.value);
               }
               else
                  content = attributes[attribute].value;
            } else {
               content = attributes[attribute];
            }

            break;


         default:

            continue;

      }

      if (content === undefined || !content.value === undefined) continue;

      const attr: AttributeModel = {
         name: attributeName,
         /*type: descriptor.type,
         label: descriptor.label,*/
         content: content,
      }

      if (attributeUuid) attr.uuid = attributeUuid;

      attrs.push(attr);

   }

   return attrs;

}
