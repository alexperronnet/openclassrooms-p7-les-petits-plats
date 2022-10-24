export function ScrollTop() {
  // Get DOM
  const scrollTop = document.querySelector('.scroll-top')

  // Scroll to top
  scrollTop.addEventListener('click', () => {
    window.scrollTo(0, 0)
  })

  // Display/Hide button
  window.addEventListener('scroll', () => {
    if (scrollTop.hidden && window.scrollY > 100) {
      scrollTop.hidden = false
    }

    if (!scrollTop.hidden && window.scrollY < 100) {
      scrollTop.setAttribute('closing', '')

      scrollTop.addEventListener(
        'animationend',
        () => {
          scrollTop.hidden = true
          scrollTop.removeAttribute('closing')
        },
        { once: true }
      )
    }
  })
}
