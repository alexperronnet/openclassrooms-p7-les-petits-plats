export function PreLoader() {
  // Get elements
  const app = document.querySelector('#app')
  const preLoader = document.querySelector('.pre-loader')
  const preLoaderBarProgress = document.querySelector('.pre-loader__bar-progress')

  // Increase progress bar
  window.addEventListener('DOMContentLoaded', () => {
    preLoaderBarProgress.style.width = '0%'
  })
  window.addEventListener('load', () => {
    preLoaderBarProgress.style.width = '100%'
  })

  // Remove pre-loader when progress bar is 100%
  preLoaderBarProgress.addEventListener('transitionend', () => {
    if (preLoaderBarProgress.style.width === '100%') {
      preLoader.remove()
      app.removeAttribute('loading')
    }
  })
}
