# happypreview

一个网页端的图片预览插件，支持 vue2.x

## 安装

npm install happypreview

## 在 Vue 中使用

### 引入

import happypreview from 'happypreview';
Vue.use(happypreview);

### 方式一：通过标签的方式进行使用

```
  // 第一组
  <div class="first-group">
    <img big="xx.jpg" src="xx.jpg" alt="Image description" previewId="1" previewTitle="图片1" />
    <img big="xx.jpg" src="xx.jpg" alt="Image description" previewId="1" previewTitle="图片2" />
  </div>

  // 第二组
  <div class="second-group">
    <img big="xx.jpg" src="xx.jpg" alt="Image description" previewId="2" previewTitle="图片1" />
    <img big="xx.jpg" src="xx.jpg" alt="Image description" previewId="2" previewTitle="图片2" />
  </div>
```

1. previewId 相同的 img 标签会作为同一组进行显示；
2. big 是预览时的显示地址，通常是大图的地址，如果没有传入这个属性，那么默认将是 src 的属性；
3. previewTitle 设置预览时的描述；

### 方式二：通过注册的方式使用

```
<template>
  <div class="hello">
    <button @click="handleBtn">显示图片</button>
  </div>
</template>

<script>
export default {
  methods: {
    handleBtn() {
      this.$happypreview({
        images: [
          "https://farm3.staticflickr.com/2567/5697107145_a4c2eaa0cd_o.jpg",
          "https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg",
          "https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg"
        ],
        start: 0
      });
    }
  }
};
```

this.\$happypreview() 支持传入两种类型的参数，一种是只包含 src 路径的数组[]，例如：

```
this.$happypreview(['xxx.jpg', 'xxx1.jpg']);
```

另外一种方式是可以传入一个带有 images 和 start 属性的对象，start 属性用来标记默认显示的图片对应的索引，例如：

```
this.$happypreview({
  images: ["xxx.jpg", "xxx1.jpg", "xxx2.jpg"],
  start: 0
})
```

## 更新日志

### 2019/10/27

完成 vue2.x 的预览功能

### 2020/3/3

兼容 typescript
