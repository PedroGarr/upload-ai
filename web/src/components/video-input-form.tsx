import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

export function VideoInputForm(){
    const [videoFile, setVideoFile] = useState<File | null >(null)

    const promptInputRef = useRef<HTMLTextAreaElement>(null)

    function handleSelectedFile(event: ChangeEvent<HTMLInputElement>){
        const {files} = event.currentTarget

        if(!files){
            return
        }

        const selectedFile = files[0]

        setVideoFile(selectedFile)
    }

    async function convertVideoToAudio(video:File) {
      console.log("Convert Start")


      const ffmpeg = await getFFmpeg()

      await ffmpeg.writeFile("input.mp4", await fetchFile(video))

      //ffmpeg.on("log", log =>{
      //  console.log(log)
      //})
      
      //Multiplying the progress by 100 to give a good 0-100% progress bar
      ffmpeg.on("progress", progress =>{
        console.log("Convert Progress: " + Math.round(progress.progress * 100 ))
      })

      await ffmpeg.exec([
        '-i',
        'input.mp4',
        '-map',
        '0:a',
        '-b:a',
        '20k',
        '-acodec',
        'libmp3lame',
        'output.mp3'
      ])

      const data = await ffmpeg.readFile('output.mp3')
      
      //Convert File Data in javascript-ready file
      const audioFileBlob = new Blob([data], { type: 'audio/mpeg'})
      const audioFile = new File([audioFileBlob], 'audio.mp3', {
        type: 'audio/mpeg',
      })

      console.log ('Convert finished.')

      return audioFile
    }

    async function handleUploadVideo(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        const prompt = promptInputRef.current?.value

        if(!videoFile){
            return
        }

        //Functions that converts video in audio with web assembly
        const audioFile = await convertVideoToAudio(videoFile)

        const data = new FormData()

        data.append('file', audioFile)

        const response = await api.post('/videos', data)

        const videoId = response.data.video.id

        await api.post(`/videos/${videoId}/transcription`, {
          prompt,
        })
        console.log("C'est fini")
    }

    const previewURL = useMemo(() =>{
        if (!videoFile){
            return null
        }

        return URL.createObjectURL(videoFile)
    },[videoFile])


    return(
        <form onSubmit={handleUploadVideo} className='space-y-6'>
            <label 
              htmlFor='video'
              className='relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/10'
            >
              {previewURL ? (
                <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0 "/>
              ) : (
                <>
                    <FileVideo className='w-4 h-4'/>
                    Select a video
                </>  
              )}
            </label>

            <input type='file' id='video' accept='video/mp4' className='sr-only' onChange={handleSelectedFile}/> 

            <Separator/>

            <div className='space-y-2'>
              <Label htmlFor='transcription_prompt'> Transcription prompt</Label>
              <Textarea
              ref = {promptInputRef} 
              id='transcription_prompt' 
              className='h-20 leading-relaxed resize-none'
              placeholder='Include keywords mentioned on your video separated by commas (,)'
              />
            </div>

            <Button type='submit' className='w-full'>
              Load video
              <Upload className='w-4 h-4 ml-2'/> 
            </Button>
          </form>
    )
}