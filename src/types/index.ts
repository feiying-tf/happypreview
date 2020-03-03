import Vue from 'vue'

export interface ParseThumbnail {
  (items: NodeListOf<any>, isFn: boolean): any
}

export interface OpenPhotoSwipe {
  (
    index: number | string,
    items: NodeListOf<any>,
    disableAnimation?: boolean,
    fromURL?: boolean,
    isFn?: boolean
  ): void
}

export interface InitPhoto {
  (mark: string): void
}

export interface Happypreview {
  (argu: any): void
}

export interface HappypreviewStatic extends Happypreview {
  install?: (vue: typeof Vue, options?: any) => void
}

export interface Options {
  history?: boolean
  shareEl?: boolean
  preloaderEl?: boolean
  getThumbBoundsFn?: (index: number) => any
  galleryPIDs?: boolean
  index?: number
  showAnimationDuration?: number
}
export interface Win {
  happypreview?: HappypreviewStatic
  [prop: string]: any
}
