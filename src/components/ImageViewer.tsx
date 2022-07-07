import { createSignal } from 'solid-js'

export interface Props {
  class?: string
  images: string[]
}

const ImageViewer = (props: Props) => {
  const { class: className = '', images } = props

  const [selected, setSelected] = createSignal(images.at(0))
  const hasMultiple = images.length > 0

  return (
    <div class={`flex space-x-4 ${className}`}>
      {hasMultiple && (
        <div class="flex flex-col space-y-2 flex-shrink-0">
          {images.map((image) => (
            <img
              class={`border-black object-cover h-36 w-36 ${
                image === selected()
                  ? 'border-2'
                  : 'border cursor-pointer hover:opacity-95'
              }`}
              src={image}
              onClick={() => setSelected(image)}
            />
          ))}
        </div>
      )}

      <div class="relative inline-block flex-grow w-full after:block after:content-empty after:mt-[100%]">
        <img
          class="border border-black h-full object-cover w-full inset-0 absolute"
          src={selected()}
        />
      </div>
    </div>
  )
}

export default ImageViewer
