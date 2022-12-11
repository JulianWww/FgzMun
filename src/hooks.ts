import { useLocalStorage, uuidv4 } from "./utils";
import { useEffect, useState } from 'react'

export type VoterID = string;

export function useVoterID(): [string] {
  let [voterID, setVoterID] = useLocalStorage('voterID', undefined);

  if (!voterID) {
    voterID = uuidv4();
    setVoterID(voterID);
  }
  
  return [voterID];
}

function preloadImage (src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function() {
      resolve(img)
    }
    img.onerror = img.onabort = function() {
      reject(src)
    }
    img.src = src
  })
}

export default function useImagePreloader(imageList: string[]) {
  const [imagesPreloaded, setImagesPreloaded] = useState<boolean>(false)

  useEffect(() => {
    let isCancelled = false

    async function effect() {
      console.log('PRELOAD')

      if (isCancelled) {
        return
      }

      const imagesPromiseList: Promise<any>[] = []
      for (const i of imageList) {
        imagesPromiseList.push(preloadImage(i))
      }
  
      await Promise.all(imagesPromiseList)

      if (isCancelled) {
        return
      }

      setImagesPreloaded(true)
    }

    effect()

    return () => {
      isCancelled = true
    }
  }, [imageList])

  return imagesPreloaded;
}