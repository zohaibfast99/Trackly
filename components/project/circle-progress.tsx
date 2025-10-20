
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { Subtitles } from "lucide-react";
type VariantType="default"|"success"|"warning"|"inProgress";

interface CircleProps{
    title:string
    value:number
    subTitle:string 
    variant:VariantType
}
const variantStyles={
    default:"text-blue-500",
    success:"text-green-600",
    warning:"text-red-600",
    inProgress:"text-yellow-600",
};


export const CircleProgress=({title,subTitle,value,variant}:CircleProps)=>{
    return(<div className="flex flex-col items-center p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        <div className="relative w-20 h-28">
            <Progress
            value={value}
            className={cn(`h-20 w-20 rotate-[-90deg],${variantStyles[variant]}`)}
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn (`text-xl font-semibold ${variantStyles[variant]}`)}>
                    {`${Math.round(value||0)}%`}
                </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{subTitle}</p>
        </div>
    </div>
    );
};