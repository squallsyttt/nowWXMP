export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/contact/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
  },
  requiredBackgroundModes: [
      'audio'
  ],
})
