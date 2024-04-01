export default defineAppConfig({
  lazyCodeLoading: 'requiredComponents',
  pages: [
    'components/splash/splash',
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
