import { Github,  Wand2} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Textarea } from './components/ui/textarea';
import { Separator } from './components/ui/separator';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Slider } from './components/ui/slider';
import { VideoInputForm } from './components/video-input-form';
import { PromptSelect } from './components/prompt-select';




//Voce parou em 43:40 minutos do video


 export function App() {
  return (
   <div className='min-h-screen flex flex-col'>

      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>

        <div className="flex items-center gap-3"> 
          <Button variant="outline">
            <Github className='w-4 h-4 mr-2'/>
            Github
          </Button>
        </div>
      </div>

      <main className='flex-1 p-6 flex gap-6'> 
        <div className='flex flex-col flex-1 gap-4'>
          <div className='grid grid-rows-2 gap-4 flex-1'>

            <Textarea 
            className='resize-none p-4 leading-relaxed'
            placeholder="Input the AI prompt..."
            />

            <Textarea 
            className='resize-none p-4 leading-relaxed'
            placeholder="AI generated output..." 
            readOnly
            />
          </div>

          <p className='text-sm text-muted-foreground '>
             Remember: You can use the variable <code className='text-orange-400'>{'{transcription}'}</code> on your prompt to add the content of the selected video's transcription 
          </p>
        </div>

        <aside className='w-80 space-y-6'>
          
          <VideoInputForm/>

          <Separator/>
          
          <form className='space-y-6'>

            <div className='space-y-2'>
              <Label>Prompt</Label>
              <PromptSelect/>
            </div>

            <div className='space-y-2'>
              <Label>Model</Label>
              <Select disabled defaultValue='gpt3.5'>
                <SelectTrigger>
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='gpt3.5'> GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className='block text-xs text-muted-foreground italic'>
                You cannot customize this option at the moment
              </span>
            </div>

            <Separator/>

            <div className='space-y-4'>
              <Label>Temperature</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
              />
              
              <span className='block text-xs text-muted-foreground italic leading relaxed'>
                Higher values will create more creative outcomes but will also be more prone to errors
              </span>
            </div>

            <Separator/>

            <Button type='submit' className='w-full'>
              Generate
              <Wand2 className='w-4 h-4 ml-2'/>
            </Button>

          </form>
        </aside>
      </main>
   </div>
  )
}
