import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import ShowContainer from './showContainer.vue'
import 'photoswipe/dist/default-skin/default-skin.css'
import 'photoswipe/dist/photoswipe.css'
import {
  ParseThumbnail,
  OpenPhotoSwipe,
  InitPhoto,
  Happypreview,
  HappypreviewStatic,
  Options,
  Win
} from '../types/index'

interface dom {
  getAttribute(prop: string): any
}

var parseThumbnailElements: ParseThumbnail = async function(items, isFn) {
  let arr: any[] = []
  for (var i = 0, len = items.length; i < len; i++) {
    await new Promise((resolve, reject) => {
      try {
        let current: dom
        let src = ''
        if (isFn) {
          src = items[i]
        } else {
          current = items[i]
          src = (current as dom).getAttribute('big') || (current as dom).getAttribute('src')
        }
        let image = document.createElement('img')
        image.setAttribute('src', src)
        image.onload = function() {
          arr.push({
            src: src,
            w: image.offsetWidth || image.width || 1024,
            h: image.offsetHeight || image.height || 1024,
            msrc: isFn ? src : current.getAttribute('src'),
            el: isFn ? image : current,
            title: isFn ? '' : current.getAttribute('previewTitle')
          })
          resolve()
        }
      } catch (error) {
        reject(error)
      }
    })
  }
  return arr
}

var openPhotoSwipe: OpenPhotoSwipe = async function(index, items, disableAnimation, fromURL, isFn) {
  var pswpElement = document.querySelectorAll('.pswp')[0], // 获取到 .pswp 对应的元素
    gallery,
    options: Options

  // 获取到所有figure对应的内容
  /* 每个item的结构
    {
      src: // 大图地址
      w: // 宽度
      h: // 高度
      msrc: //img地址
      el: figure对应的dom
      title: // 标题
    }
  */
  let itemsTemp = await parseThumbnailElements(items, isFn!)
  options = {
    // define gallery index (for URL)
    // galleryUID: items[index].getAttribute("data-pswp-uid"), // 获取.data-pswp-uid 属性
    history: false, // 不生成新的历史url
    shareEl: false, // 隐藏分享
    preloaderEl: true, // 提前下载
    getThumbBoundsFn: function(index: number) {
      // See Options -> getThumbBoundsFn section of documentation for more info
      var thumbnail = isFn ? itemsTemp[index].el : items[index], // find thumbnail
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop, // 获取被卷去的高度
        rect = thumbnail.getBoundingClientRect() // 返回缩略图的大小及其相对于视口的位置
      return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
    }
  }

  // PhotoSwipe opened from URL
  if (fromURL) {
    // 当 fromURL 为真的时候
    if (options.galleryPIDs) {
      // parse real index when custom PIDs are used
      // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
      for (var j = 0; j < itemsTemp.length; j++) {
        if (itemsTemp[j].pid == index) {
          options.index = j
          break
        }
      }
    } else {
      // in URL indexes start from 1
      options.index = parseInt(index as string, 10) - 1
    }
  } else {
    options.index = parseInt(index as string, 10)
  }

  if (disableAnimation) {
    // 当disableAnimation为真
    options.showAnimationDuration = 0
  }

  // Pass data to PhotoSwipe and initialize it
  gallery = new PhotoSwipe( // 创建一个画廊
    pswpElement as HTMLElement, // 传入 .pswp对应的元素
    PhotoSwipeUI_Default,
    itemsTemp, // 传入itemsTemp
    options // 传入options
  )
  gallery.init() // 初始化画廊
}

/**
 * imgMark 图片的标志，一个class，或者一个id
 * @param {*} imgMark
 */
let initPhotoSwipeFromDOM: InitPhoto = imgMark => {
  // parse slide data (url, title, size ...) from DOM elements
  // (children of imgMark)

  // find nearest parent element

  // 点击事件
  var onThumbnailsClick = function(e: any) {
    e = e || window.event
    e.preventDefault ? e.preventDefault() : (e.returnValue = false)
    var eTarget = e.target || e.srcElement
    let id = eTarget.getAttribute(imgMark)

    let items = document.querySelectorAll(`[${imgMark}="${id}"]`)
    let index
    for (let i = 0, len = items.length; i < len; i++) {
      if (items[i] === eTarget) {
        index = i
      }
    }
    if ((index as number) >= 0) {
      // 如果被点击的元素为有效元素
      openPhotoSwipe(index as number | string, items)
    }
    return false
  }

  // parse picture index and gallery index from URL (#&pid=1&gid=2)
  // var photoswipeParseHash = function() {
  //   var hash = window.location.hash.substring(1),
  //     params = {};

  //   if (hash.length < 5) {
  //     return params;
  //   }

  //   var vars = hash.split("&");
  //   for (var i = 0; i < vars.length; i++) {
  //     if (!vars[i]) {
  //       continue;
  //     }
  //     var pair = vars[i].split("=");
  //     if (pair.length < 2) {
  //       continue;
  //     }
  //     params[pair[0]] = pair[1];
  //   }

  //   if (params.gid) {
  //     params.gid = parseInt(params.gid, 10);
  //   }

  //   return params;
  // };

  // 获取所有的类名为 imgMark 的元素
  var imgElements = document.querySelectorAll('[' + imgMark + ']')

  for (var i = 0, l = imgElements.length; i < l; i++) {
    // 为每一个元素添加 data-pswp-uid 属性，并依次 + 1
    imgElements[i].setAttribute('data-pswp-uid', i + 1 + '')
    // 为每个元素添加点击事件 onThumbnailsClick
    ;(imgElements[i] as HTMLElement).onclick = onThumbnailsClick
  }

  // Parse URL and open gallery if it contains #&pid=3&gid=1
  // 如果hash值上面有pid和gid，那么就显示画廊
  // var hashData = photoswipeParseHash();
  // if (hashData.pid && hashData.gid) {
  //   openPhotoSwipe(
  //     hashData.pid,
  //     imgElements[hashData.gid - 1],
  //     true,
  //     true
  //   );
  // }
}

export let happypreview: Happypreview = argu => {
  if (argu && typeof argu !== 'object') {
    throw new Error('Parameters can only be arrays and objects')
  }
  let images = [] // 图片集
  let start = 0 // 默认开始的位置
  if (Array.isArray(argu)) {
    images = argu
  } else if (typeof argu === 'object') {
    images = argu.images
    start = argu.start
  }
  openPhotoSwipe(start, images, false, false, true)
}
;(happypreview as HappypreviewStatic).install = function(Vue, options = { select: 'previewId' }) {
  // 创建显示图片的容器，并把它追加到body里面
  let previewWrapper = document.createElement('div')
  document.body.appendChild(previewWrapper)
  previewWrapper.id = 'preview-wrapper'

  // 将ShowContainer挂载到previewWrapper上
  var Preview = Vue.extend(ShowContainer)

  // 创建 Profile 实例，并挂载到一个元素上。
  new Preview().$mount('#preview-wrapper')
  Vue.prototype.$happypreview = happypreview
  Vue.mixin({
    mounted() {
      initPhotoSwipeFromDOM(options.select)
    }
  })
}
export default happypreview

if (typeof window !== 'undefined' && !(window as Win).happypreview) {
  ;(window as Win).happypreview = happypreview
}
