import { cn } from "@/lib/utils"

const AddImageSvg: React.FC<{svg_color?:string}> = ({svg_color}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("lucide lucide-image-plus",svg_color)}
        >
            <path d="M16 5h6"></path>
            <path d="M19 2v6"></path>
            <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"></path>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            <circle cx="9" cy="9" r="2"></circle>
        </svg>
    );
};

export default AddImageSvg;