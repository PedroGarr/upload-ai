import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function PromptSelect(){
    return(
        <Select>
            <SelectTrigger>
                <SelectValue placeholder="Select a prompt..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='title'> YouTube title</SelectItem>
                <SelectItem value='description'> YouTube description</SelectItem>
            </SelectContent>
        </Select>
    )
}