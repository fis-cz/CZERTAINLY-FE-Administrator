import React from "react";
import { Button, ButtonProps } from "reactstrap";
import ToolTip from "../ToolTip";


export interface WidgetButtonProps {
   icon: "plus" | "trash" | "times" | "check" | "plug" | "pencil" | "cross-circle" | "upload" | "download" | "group" | "user" | "cubes" | "retweet" | "minus-square" | "info" | "gavel" | "push" | "sync" | "minus" | "lock";
   additionalTooltipId?: string;
   tooltipScheme?: "dark" | "success" | "warning" | "error" | "info" | "light";
   tooltip?: any;
   disabled: boolean;
   custom?: React.ReactNode;
   onClick: (event: React.MouseEvent) => void
}


interface Props {
   buttons: WidgetButtonProps[];
}


const colors = {
   "plus": "auto",
   "trash": "red",
   "times": "red",
   "check": "auto",
   "plug": "auto",
   "pencil": "auto",
   "cross-circle": "black",
   "upload": "auto",
   "download": "auto",
   "group": "auto",
   "user": "auto",
   "cubes": "auto",
   "retweet": "auto",
   "minus-square": "red",
   "push": "auto",
   "sync": "auto",
   "info": "auto",
   "minus": "red",
   "gavel": "auto",
   "lock": "auto"
};


const classNames = {
   "plus": "fa fa-plus",
   "trash": "fa fa-trash",
   "times": "fa fa-times",
   "check": "fa fa-check",
   "plug": "fa fa-plug",
   "pencil": "fa fa-pencil-square-o",
   "cross-circle": "fa fa-times-circle",
   "upload": "fa fa-upload",
   "download": "fa fa-download",
   "group": "fa fa-group",
   "user": "fa fa-user-o",
   "cubes": "fa fa-cubes",
   "retweet": "fa fa-retweet",
   "minus-square": "fa fa-minus-square",
   "push": "fa fa-arrow-circle-up",
   "sync": "fa fa-refresh",
   "info": "fa fa-info-circle",
   "minus": "fa fa-minus",
   "gavel": "fa fa-gavel",
   "lock": "fa fa-lock"
}


function WidgetButtons({ buttons }: Props) {

   const renderButton = (button: WidgetButtonProps) => {

      let toolTip: JSX.Element | undefined;
      let style;

      let btnProps: ButtonProps = {
         key: button.icon + button.tooltip + button.additionalTooltipId || "",
         className: "btn btn-link",
         color: "white",
         onClick: button.onClick,
         disabled: button.disabled,
      }

      if (button.tooltip) {

         const toolTipId = `btn_tooltip_${button.tooltip}_${button.additionalTooltipId || ""}`;

         btnProps["data-for"] = toolTipId;
         btnProps["data-tip"] = "";

         toolTip = <ToolTip id={toolTipId} message={button.tooltip} tooltipType={button.tooltipScheme}/>

      }

      if (!button.disabled) {
         style = { color: colors[button.icon] }
      }

      return button.custom
         ?
         ( <span key={button.icon + button.tooltip}>{ button.custom }</span>)
         :
         (
            <Button {...btnProps}>
               <i className={classNames[button.icon]} style={style} />
               {toolTip}
            </Button>
         )

   }

   const renderedButtons: JSX.Element[] = [];

   buttons.forEach(button => {
      renderedButtons.push(renderButton(button))
   });

   return <>{renderedButtons}</>

}

export default WidgetButtons;