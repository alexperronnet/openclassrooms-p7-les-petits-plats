export function PreLoader() {
  // Get elements
  const app = document.querySelector('#app')
  const preLoader = document.querySelector('.pre-loader')
  const preLoaderBarProgress = document.querySelector('.pre-loader__bar-progress')

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      preLoaderBarProgress.style.width = '25%'
    }, 1000)
  })

  // After DOMContentLoaded, load the rest of the assets
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
